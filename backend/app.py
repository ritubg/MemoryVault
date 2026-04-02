import os
import uuid
import base64
import boto3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient

# ---------------- INIT ----------------
load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------- DB CONNECTION ----------------
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    # Fallback/Debug check
    raise RuntimeError("MONGO_URI not set in environment variables.")

client = MongoClient(MONGO_URI)
db = client["memoryvault"]

users_col = db["users"]
events_col = db["events"]
capsules_col = db["capsules"]

# ---------------- S3 CLIENT ----------------
s3_client = boto3.client(
    "s3",
    endpoint_url=os.getenv("S3_ENDPOINT", "http://localhost:4566"),
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1"
)
BUCKET_NAME = "memoryvault-media"

try:
    s3_client.head_bucket(Bucket=BUCKET_NAME)
except Exception:
    try:
        s3_client.create_bucket(Bucket=BUCKET_NAME)
        s3_client.put_bucket_cors(
            Bucket=BUCKET_NAME,
            CORSConfiguration={
                'CORSRules': [{
                    'AllowedHeaders': ['*'],
                    'AllowedMethods': ['GET', 'PUT', 'POST', 'DELETE'],
                    'AllowedOrigins': ['*'],
                    'ExposeHeaders': []
                }]
            }
        )
    except Exception as e:
        print("Could not create bucket:", e)

def process_media_item(item):
    if not isinstance(item, dict) or not item.get("data"):
        return item
    if not item["data"].startswith("data:"):
        return item # Already URL or raw text

    try:
        header, base64_str = item["data"].split(",", 1)
        mime_type = item.get("type")
        if not mime_type:
            mime_type = header.split(";")[0].split(":")[1]
        file_bytes = base64.b64decode(base64_str)
        
        filename = f"{uuid.uuid4()}_{item.get('name', 'file')}"
        
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=file_bytes,
            ContentType=mime_type,
            ACL='public-read'
        )
        
        url = f"{os.getenv('S3_EXTERNAL_ENDPOINT', 'http://localhost:4566')}/{BUCKET_NAME}/{filename}"
        
        return {
            "name": item.get("name"),
            "data": url,
            "type": mime_type
        }
    except Exception as e:
        print("S3 Upload error:", e)
        return item

# ---------------- AUTH ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.form
    email = data.get("email")

    if users_col.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    user = {
        "name": data.get("name"),
        "email": email,
        "password": data.get("password"),
        "dob": data.get("dob")
    }

    users_col.insert_one(user)
    return jsonify({"message": "Signup successful"}), 200


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users_col.find_one(
        {"email": email, "password": password},
        {"_id": 0}
    )

    if user:
        return jsonify({
            "message": "Login successful",
            "user": user
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401


@app.route("/users", methods=["GET"])
def get_users():
    users = list(users_col.find({}, {"_id": 0, "password": 0}))
    return jsonify(users), 200


# ---------------- PROFILE ----------------
@app.route("/profile/<email>", methods=["GET"])
def get_profile(email):
    user = users_col.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user), 200


@app.route("/change_password", methods=["POST"])
def change_password():
    data = request.json
    email = data.get("email")
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not email or not current_password or not new_password:
        return jsonify({"message": "All fields required"}), 400

    if len(new_password) < 8:
        return jsonify({"message": "Password must be >= 8 chars"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found"}), 404

    if user["password"] != current_password:
        return jsonify({"message": "Incorrect current password"}), 401

    if current_password == new_password:
        return jsonify({"message": "New password must differ"}), 400

    users_col.update_one(
        {"email": email},
        {"$set": {"password": new_password}}
    )
    return jsonify({"message": "Password updated"}), 200


# ---------------- EVENTS ----------------
@app.route("/api/events/<user_email>", methods=["GET"])
def get_events(user_email):
    events = list(events_col.find({"user_email": user_email}, {"_id": 0}))
    return jsonify({"events": events}), 200


@app.route("/api/events/<user_email>", methods=["POST"])
def add_event(user_email):
    data = request.json
    if not data or not data.get("event_name") or not data.get("date"):
        return jsonify({"message": "event_name & date required"}), 400

    event_id = data.get("id", str(uuid.uuid4()))

    event = {
        "id": event_id,
        "event_name": data.get("event_name"),
        "date": data.get("date"),
        "notes": data.get("notes", ""),
        "media": {
            "images": [process_media_item(img) for img in data.get("media", {}).get("images", [])],
            "audio": [process_media_item(a) for a in data.get("media", {}).get("audio", [])],
            "video": [process_media_item(v) for v in data.get("media", {}).get("video", [])],
        },
        "is_dob": data.get("is_dob", False),
        "user_email": user_email,
    }

    # Idempotent insert/update
    events_col.update_one(
        {"id": event_id, "user_email": user_email},
        {"$set": event},
        upsert=True
    )
    return jsonify({"message": "Event saved", "event": event}), 201


@app.route("/api/events/<user_email>/<event_id>", methods=["DELETE"])
def delete_event(user_email, event_id):
    result = events_col.delete_one({"id": event_id, "user_email": user_email})
    if result.deleted_count:
        return jsonify({"message": "Deleted"}), 200
    return jsonify({"message": "Not found"}), 404


# ---------------- CAPSULES ----------------
@app.route("/add_capsule", methods=["POST"])
def add_capsule():
    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    raw_media = data.get("media", {})
    processed_media = {
        "images": [process_media_item(img) for img in raw_media.get("images", [])],
        "audio":  [process_media_item(a)   for a   in raw_media.get("audio", [])],
        "video":  [process_media_item(v)   for v   in raw_media.get("video", [])],
    }

    capsule = {
        "name":         data.get("name"),
        "email":        data.get("email"),
        "date_created": datetime.now().strftime("%Y-%m-%d"),
        "open_date":    data.get("open_date"),
        "notes":        data.get("notes", ""),
        "letter":       data.get("letter", ""),
        "media":        processed_media,
    }
    capsules_col.insert_one(capsule)
    return jsonify({"message": "Capsule created"}), 200


@app.route("/capsules/<email>", methods=["GET"])
def get_capsules(email):
    capsules = list(capsules_col.find({"email": email}, {"_id": 0}))
    return jsonify(capsules), 200


@app.route("/open_capsule", methods=["POST"])
def open_capsule():
    data = request.json
    name = data.get("name")
    email = data.get("email")

    capsule = capsules_col.find_one(
        {"name": name, "email": email},
        {"_id": 0}
    )

    if not capsule:
        return jsonify({"message": "Not found"}), 404

    today = datetime.now().strftime("%Y-%m-%d")
    if today >= capsule["open_date"]:
        return jsonify({"status": "open", "capsule": capsule})
    else:
        return jsonify({"status": "locked", "message": "Too early!"})

from groq import Groq

client_ai = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-70b-8192")  # fallback if not set


@app.route("/api/summary/<user_email>", methods=["GET"])
def get_summary(user_email):
    user_events = list(events_col.find({"user_email": user_email}, {"_id": 0}))

    if not user_events:
        return jsonify({"summary": "No events found."}), 200

    text_data = ""
    for e in user_events:
        text_data += (
            f"\nEvent: {e.get('event_name', 'Unnamed')}"
            f"\nDate: {e.get('date', 'Unknown')}"
            f"\nNotes: {e.get('notes', '').strip() or 'None'}"
            f"\n---"
        )

    prompt = f"""You are a thoughtful personal memory assistant.
Analyse the user's life timeline below and respond with exactly four clearly labelled sections:

## Key Highlights
List the most significant or memorable events as bullet points.

## Patterns
Identify any recurring themes, habits, or life patterns as bullet points.

## Insights
Share meaningful observations or reflections about their journey as bullet points.

## Short Summary
Write 2-3 warm, personal sentences summarising their timeline as a narrative.

Keep the tone warm, personal, and encouraging. Be concise.

Timeline:
{text_data}
"""

    # ── Call Groq ─────────────────────────────────────────────────────────
    try:
        response = client_ai.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a warm and insightful personal memory assistant. "
                        "Always respond with exactly the four sections requested, "
                        "using ## headings and bullet points where instructed."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        summary = response.choices[0].message.content

    except Exception as e:
        print("GROQ ERROR:", e)
        return jsonify({"message": f"Error generating summary: {str(e)}"}), 500

    return jsonify({"summary": summary}), 200


if __name__ == "__main__":
    app.run(debug=True)
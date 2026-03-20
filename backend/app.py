from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory "database"
users = []
from datetime import datetime
capsules = []

# ---------------- SIGNUP ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.form

    user = {
        "name": data.get("name"),
        "email": data.get("email"),
        "password": data.get("password"),
        "dob": data.get("dob")
    }

    # check if user exists
    for u in users:
        if u["email"] == user["email"]:
            return jsonify({"message": "User already exists"}), 400

    users.append(user)
    return jsonify({"message": "Signup successful"}), 200


# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    for user in users:
        if user["email"] == email and user["password"] == password:
            return jsonify({"message": "Login successful"}), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/users", methods=["GET"])
def get_users():
    return jsonify(users), 200

@app.route("/add_capsule", methods=["POST"])
def add_capsule():
    data = request.form

    capsule = {
        "name": data.get("name"),
        "email": data.get("email"),
        "date_created": datetime.now().strftime("%Y-%m-%d"),
        "open_date": data.get("open_date"),
        "notes": data.get("notes"),
        "letter": data.get("letter")
    }

    capsules.append(capsule)

    return jsonify({"message": "Capsule created"}), 200

@app.route("/capsules/<email>", methods=["GET"])
def get_capsules(email):
    user_capsules = [c for c in capsules if c["email"] == email]
    return jsonify(user_capsules), 200

@app.route("/open_capsule", methods=["POST"])
def open_capsule():
    data = request.json

    name = data.get("name")
    email = data.get("email")

    for c in capsules:
        if c["name"] == name and c["email"] == email:
            today = datetime.now().strftime("%Y-%m-%d")

            if today >= c["open_date"]:
                return jsonify({"status": "open", "capsule": c})
            else:
                return jsonify({"status": "locked", "message": "Too early!"})

    return jsonify({"message": "Capsule not found"}), 404
if __name__ == "__main__":
    app.run(debug=True)
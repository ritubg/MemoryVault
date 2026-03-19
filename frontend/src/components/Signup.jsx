import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    photo: null,
  });

  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("password", form.password);
  formData.append("dob", form.dob);
  if (form.photo) formData.append("photo", form.photo);

  const res = await fetch("http://127.0.0.1:5000/signup", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (res.status === 200) {
    alert(data.message);
    navigate("/login");   
  } else {
    alert(data.message);
  }
};

  return (
    <div style={styles.container}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <div style={styles.photoUpload}>
          <label htmlFor="photoInput" style={styles.photoLabel}>
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                style={styles.photoPreview}
              />
            ) : (
              <div style={styles.photoPlaceholder}>+</div>
            )}
          </label>
          <input
            type="file"
            id="photoInput"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />
        </div>

        <button type="submit" style={styles.button}>
          Signup
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "50px" },
  form: { display: "inline-block", width: "300px" },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    marginTop: "10px",
    cursor: "pointer",
  },
  photoUpload: {
    display: "flex",
    justifyContent: "center",
    margin: "10px 0",
  },
  photoLabel: {
    cursor: "pointer",
  },
  photoPlaceholder: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    color: "#fff",
  },
  photoPreview: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
  },
};

export default Signup;
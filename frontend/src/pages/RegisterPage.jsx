import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, saveSession } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!form.email || form.password.length < 6) {
      setError("Use a valid email and a password with at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      saveSession(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Create your workspace</p>
        <h1>Register for Task Manager</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="alex"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />

          {error && <p className="form-error">{error}</p>}

          <button className="button primary full-width" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="auth-link">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

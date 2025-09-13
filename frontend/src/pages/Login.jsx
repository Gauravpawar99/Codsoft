import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/auth.css";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(form.email.trim(), form.password);
    if (!res.ok) return setError(res.error || "Login failed");
    const from = location.state?.from?.pathname || "/";
    nav(from, { replace: true }); // go home or back to protected page
  };

  return (
    <main className="auth-page">
      <section className="auth-card" role="region" aria-label="Login">
        <div className="auth-header">
          <span className="brand-dot" />
          <h1 className="auth-title">Welcome back</h1>
        </div>
        <p className="auth-subtle">Sign in to continue shopping.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <input
                id="password"
                className="auth-input"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className="auth-error" aria-live="polite">{error}</div>}

          <div className="auth-actions">
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
          </div>
        </form>

        <div className="auth-foot">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </section>
    </main>
  );
}

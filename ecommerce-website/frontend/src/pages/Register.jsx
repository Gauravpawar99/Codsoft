import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/auth.css";

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setOk("");
    const res = await register(form.name.trim(), form.email.trim(), form.password);
    if (!res.ok) return setError(res.error || "Registration failed");
    setOk("Account created!");
    const from = location.state?.from?.pathname || "/";
    nav(from, { replace: true }); // go home or back
  };

  return (
    <main className="auth-page">
      <section className="auth-card" role="region" aria-label="Create account">
        <div className="auth-header">
          <span className="brand-dot" />
          <h1 className="auth-title">Create your account</h1>
        </div>
        <p className="auth-subtle">Join us and start shopping in seconds.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">Name</label>
            <input
              id="name"
              className="auth-input"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

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
                autoComplete="new-password"
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
          {ok && <div className="auth-ok" aria-live="polite">{ok}</div>}

          <div className="auth-actions">
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Sign up"}
            </button>
          </div>
        </form>

        <div className="auth-foot">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </section>
    </main>
  );
}

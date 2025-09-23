import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (!res.ok) setError(res.error);
    else nav("/dashboard");
  };

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto" }}>
      <h2>Sign in</h2>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Email"
               value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input type="password" placeholder="Password"
               value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        {error && <p style={{color:"crimson"}}>{error}</p>}
        <button disabled={loading} type="submit">Login</button>
      </form>
      <p>New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}

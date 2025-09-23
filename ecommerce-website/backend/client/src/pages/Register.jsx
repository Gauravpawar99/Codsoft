import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form.name, form.email, form.password);
    if (!res.ok) setError(res.error);
  };

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto" }}>
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Name" value={form.name}
               onChange={e=>setForm({...form, name:e.target.value})} required />
        <input type="email" placeholder="Email" value={form.email}
               onChange={e=>setForm({...form, email:e.target.value})} required />
        <input type="password" placeholder="Password" value={form.password}
               onChange={e=>setForm({...form, password:e.target.value})} required />
        {error && <p style={{color:"crimson"}}>{error}</p>}
        <button disabled={loading} type="submit">Sign up</button>
      </form>
    </div>
  );
}

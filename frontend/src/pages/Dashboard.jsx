import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/account")
      .then(({ data }) => setMessage(data.message))
      .catch(() => setMessage("Failed to load account"));
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: "4rem auto" }}>
      <h2>Dashboard</h2>
      <p>Signed in as: <b>{user?.email}</b></p>
      <p>{message}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"; // create this too (below)

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = api.interceptors.request.use((config) => {
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });
    return () => api.interceptors.request.eject(id);
  }, [accessToken]);

  useEffect(() => {
    const id = api.interceptors.response.use(
      (r) => r,
      async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
            const { data } = await api.post("/auth/refresh");
            setAccessToken(data.accessToken);
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(original);
          } catch {
            setUser(null);
            setAccessToken(null);
          }
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setUser(data.user);
      setAccessToken(data.accessToken);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.response?.data?.error || e.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user);
      setAccessToken(data.accessToken);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.response?.data?.error || e.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

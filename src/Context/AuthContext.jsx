import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setAuthToken } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../functions/getCurrentUser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Charger l’utilisateur au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("auth");

    if (saved) {
      const parsed = JSON.parse(saved);
      setToken(parsed.token);
      setAuthToken(parsed.token);

      // Charger le user depuis le back avec le token
      getCurrentUser()
        .then((u) => setUser(u.name))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Fonction de connexion
  const login = (tk, usr) => {
    setUser(usr);
    setToken(tk);
    setAuthToken(tk);
    localStorage.setItem("auth", JSON.stringify({ token: tk}));
    navigate("/");
    window.location.reload();
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const value = useMemo(
    () => ({ user, token, login, logout, loading }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

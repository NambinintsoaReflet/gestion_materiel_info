import { api } from "../api/axios";

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const response = await api.get("/user");
    const user = response.data; 
    return user;
  } catch (error) {
    console.error("Erreur récupération utilisateur:", error);
    return null;
  }
}

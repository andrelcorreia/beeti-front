// src/services/auth.ts
import api from "@/services/axios";

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/sessions", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.response?.data?.message || "Erro ao fazer login");
  }
}

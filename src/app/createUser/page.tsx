"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { UsersRequest } from "@/services/usersRequest";
import { AccessLevelRequest } from "@/services/accessLevelRequest";
import { UserNav } from "@/components/UserNav";

export default function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessLevels, setAccessLevels] = useState<
    { id: string; description: string }[]
  >([]);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usersService = new UsersRequest();
  const accessLevelRequest = new AccessLevelRequest();
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Função para buscar os níveis de acesso
  useEffect(() => {
    const fetchAccessLevels = async () => {
      try {
        if (token) {
          const response = await accessLevelRequest.listAll(token);

          setAccessLevels(response?.data.data ?? []);
        }
      } catch (err) {
        console.error("Erro ao buscar níveis de acesso:", err);
      }
    };

    fetchAccessLevels();
  }, [token]);

  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);

    // Validação dos campos
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !selectedAccessLevel
    ) {
      setError("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      if (!token) {
        throw new Error("Token não encontrado.");
      }

      // Chamada para criar o usuário
      await usersService.createUser(token, {
        name,
        email,
        password,
        access_level_id: selectedAccessLevel, // Novo campo para nível de acesso
      });

      router.push("/users");
    } catch (err: any) {
      setError(err.message || "Erro ao criar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="absolute top-4 right-4">
        <UserNav />
      </div>
      <div className="h-[100vh]">
        <Sidebar />
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Criar Novo Usuário</h1>
        {error && <p className="text-red-500">Erro: {error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Nome: *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
              required
              maxLength={80}
            />
          </div>
          <div>
            <label className="block font-medium">Email: *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
              required
              maxLength={30}
            />
          </div>
          <div>
            <label className="block font-medium">Senha: *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full"
              required
              maxLength={12}
            />
          </div>
          <div>
            <label className="block font-medium">Confirmar Senha: *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded w-full"
              required
              maxLength={12}
            />
          </div>
          <div>
            <label className="block font-medium">Nível de Acesso *:</label>
            <select
              value={selectedAccessLevel}
              onChange={(e) => setSelectedAccessLevel(e.target.value)}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Selecione um Nível de Acesso</option>
              {accessLevels.length > 0 ? (
                accessLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.description}
                  </option>
                ))
              ) : (
                <option disabled>Nenhum nível de acesso encontrado</option>
              )}
            </select>
          </div>
          <div className="flex space-x-4 mt-5">
            <button
              className="bg-green-500 text-white p-2 rounded"
              onClick={handleCreateUser}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded"
              onClick={() => router.push("/users")}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

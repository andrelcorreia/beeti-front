"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { UsersRequest } from "@/services/usersRequest";
import { AccessLevelRequest } from "@/services/accessLevelRequest";
import { UserNav } from "@/components/UserNav";

export default function UserDetails({ params }: any) {
  const router = useRouter();
  const { userId } = params;

  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("");
  const [accessLevels, setAccessLevels] = useState<
    { id: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usersRequest = useMemo(() => new UsersRequest(), []);
  const accessLevelRequest = useMemo(() => new AccessLevelRequest(), []);

  const token = localStorage.getItem("token") || "";

  // Função para buscar os detalhes do usuário
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");

        const data = await usersRequest.listAll(token);
        const selectedUser = data.users.find((c: any) => c.id === userId);

        if (!selectedUser) throw new Error("Usuário não encontrado.");

        setUser(selectedUser);
        setName(selectedUser.name);
        setEmail(selectedUser.email);
        setSelectedAccessLevel(selectedUser.access_level_id);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, token, usersRequest]);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!token) throw new Error("Token não encontrado.");

      await usersRequest.editUser(token, userId, {
        name,
        email,
        access_level_id: selectedAccessLevel,
      });

      setIsEditing(false);
      router.push("/users");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    router.push("/users");
  };

  const handleDelete = async () => {
    try {
      if (!token) throw new Error("Token não encontrado.");
      await usersRequest.inactive(token, userId);
      router.push("/users");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="absolute top-4 right-4">
        <UserNav />
      </div>
      <div className="h-[100vh]">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            <h1 className="text-xl font-bold mb-5">Detalhes do Usuário</h1>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Nome:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                    maxLength={140}
                  />
                ) : (
                  <p>{name}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                    maxLength={80}
                  />
                ) : (
                  <p>{email}</p>
                )}
              </div>

              {/* Campo para Nível de Acesso */}
              <div>
                <label className="block font-medium">Nível de Acesso:</label>
                {isEditing ? (
                  <select
                    value={selectedAccessLevel}
                    onChange={(e) => setSelectedAccessLevel(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Selecione um Nível de Acesso</option>
                    {accessLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.description}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>
                    {
                      accessLevels.find(
                        (level) => level.id === selectedAccessLevel
                      )?.description
                    }
                  </p>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex space-x-4 mt-5">
                {!isEditing ? (
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={handleEdit}
                  >
                    Editar
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={handleSave}
                  >
                    Salvar
                  </button>
                )}
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={handleDelete}
                >
                  Deletar
                </button>
                <button
                  className="bg-gray-500 text-white p-2 rounded"
                  onClick={handleBack}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

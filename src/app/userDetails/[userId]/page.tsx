"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { Clients } from "@/services/clientsRequest";
import { UsersRequest } from "@/services/usersRequest";

export default function UserDetails({ params }: any) {
  const router = useRouter();
  const { userId } = params;

  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const usersRequest = useMemo(() => new UsersRequest(), []);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchClient = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");

        const data = await usersRequest.listAll(token);
        const selectedClient = data.users.find((c: any) => c.id === userId);

        if (!selectedClient) throw new Error("Cliente não encontrado.");

        setUser(selectedClient);
        setName(selectedClient.name);
        setEmail(selectedClient.email);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [userId, token, usersRequest]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log("info received", { userId });
    try {
      await usersRequest.editUser(token, userId, {
        name,
        email,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    router.push("/users");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
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
            <h1 className="text-xl font-bold mb-5">{user.name}</h1>
            <div className="space-y-4">
              {/* Campos de nome, endereço e telefone */}
              <div>
                <label className="block font-medium">Name:</label>
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
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                    maxLength={80}
                  />
                ) : (
                  <p>{email}</p>
                )}
              </div>

              {/* Botão de editar */}
              {!isEditing ? (
                <button
                  className="mt-4 bg-blue-500 text-white p-2 rounded"
                  onClick={handleEdit}
                >
                  Editar
                </button>
              ) : (
                <button
                  className="mt-4 bg-green-500 text-white p-2 rounded"
                  onClick={handleSave}
                >
                  Salvar
                </button>
              )}

              {/* Botão de voltar */}
              <button
                className="mt-4 bg-gray-500 text-white p-2 rounded"
                onClick={handleBack}
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { Clients } from "@/services/clientsRequest";

export default function ClientDetails({ params }: any) {
  const router = useRouter();
  const { clientId } = params;
  const clientsService = useMemo(() => new Clients(), []);

  console.log({ clientId });

  const [client, setClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchClient = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");

        const data = await clientsService.listAllClients(token);
        const selectedClient = data.find((c: any) => c.id === clientId);

        if (!selectedClient) throw new Error("Cliente não encontrado.");

        setClient(selectedClient);
        setName(selectedClient.name);
        setFullAddress(selectedClient.full_address);
        setTelephone(selectedClient.telephone);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, token, clientsService]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log("info received", { clientId });
    try {
      await clientsService.editClient(token, clientId, {
        name,
        full_address: fullAddress,
        telephone,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
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
            <h1 className="text-xl font-bold mb-5">{client.name}</h1>
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
                  />
                ) : (
                  <p>{name}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Full Address:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{fullAddress}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Telephone:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{telephone}</p>
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

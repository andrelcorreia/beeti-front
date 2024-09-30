"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SideBar";
import { Clients } from "@/services/clientsRequest";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clientsService = new Clients();
  const router = useRouter();

  // Simulação do token (substitua pelo seu método de pegar o token)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        if (!token) {
          throw new Error("Token não encontrado.");
        }

        const data = await clientsService.listAllClients(token);
        setClients(data);
      } catch (err: any) {
        setError(err.message);
        if (err.message === "Token não encontrado.") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  const handleClientClick = (clientId: string) => {
    router.push(`/clientDetails/${clientId}`);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-[100vh]">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Clients</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            {clients.length > 0 ? (
              <ul className="space-y-4">
                {clients.map((client) => (
                  <li
                    key={client.id}
                    className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handleClientClick(client.id)} // Faz o bloco ser clicável
                  >
                    <p>
                      <strong>Name:</strong> {client.name}
                    </p>
                    <p>
                      <strong>Full Address:</strong> {client.full_address}
                    </p>
                    <p>
                      <strong>Telephone:</strong> {client.telephone}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No clients found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

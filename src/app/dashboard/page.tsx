"use client";
import React from "react";
import Sidebar from "@/components/SideBar";
import { Clients } from "@/services/clientsRequest";
import { useRouter } from "next/navigation";
import { UserNav } from "@/components/UserNav";

export default function Dashboard() {
  const [clients, setClients] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const clientsService = React.useMemo(() => new Clients(), []);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        if (!token) {
          throw new Error("Token não encontrado.");
        }
        const data = await clientsService.listAllClients(token);
        setClients(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token, clientsService]);

  const handleClientClick = (clientId: string) => {
    router.push(`/clientDetails/${clientId}`);
  };

  const handleCreateClient = () => {
    router.push("/createClient");
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
        <h1 className="text-xl font-bold mb-5">Clientes</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <ul className="space-y-4">
            {clients.map((client) => (
              <li
                key={client.id}
                className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() => handleClientClick(client.id)}
              >
                <p>
                  <strong>Nome:</strong> {client.name}
                </p>
                <p>
                  <strong>Endereço completo:</strong> {client.full_address}
                </p>
                <p>
                  <strong>Telefone:</strong> {client.telephone}
                </p>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleCreateClient}
          className="mb-4 bg-blue-500 text-white p-2 rounded"
        >
          Criar Cliente
        </button>
      </div>
    </div>
  );
}

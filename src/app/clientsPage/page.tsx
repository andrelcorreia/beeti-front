// app/dashboard/clients.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clients } from "@/services/clientsRequest";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = "your-auth-token"; // Mudar para o token correto
        const clientsService = new Clients();
        const data = await clientsService.listAllClients(token);
        setClients(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientClick = (id: string) => {
    router.push(`/dashboard/clients/${id}`);
  };

  const handleCreateNewClient = () => {
    router.push(`/dashboard/clients/create`);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Clientes</h1>
      <button onClick={handleCreateNewClient}>Novo Cadastro</button>
      {loading ? (
        <p>Carregando...</p>
      ) : clients.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Data de Entrada</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client: any) => (
              <tr key={client.id} onClick={() => handleClientClick(client.id)}>
                <td>{client.name}</td>
                <td>{client.document}</td>
                <td>{client.full_address}</td>
                <td>{client.telephone}</td>
                <td>{new Date(client.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum cliente encontrado</p>
      )}
    </div>
  );
};

export default ClientsPage;

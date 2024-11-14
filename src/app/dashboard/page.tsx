"use client";
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/SideBar";
import { Clients } from "@/services/clientsRequest";
import { UserNav } from "@/components/UserNav";
import { Search } from "lucide-react"; // Ícone de busca do Lucide React
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [totalClients, setTotalClients] = useState(0);
  const [search, setSearch] = useState("");
  const clientsService = useMemo(() => new Clients(), []);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        if (!token) {
          throw new Error("Token não encontrado.");
        }

        const response = await clientsService.listAllClients(
          token,
          page,
          limit,
          search
        );
        console.log({ responseTTTT: response });
        if (Array.isArray(response)) {
          setClients(response);
          setTotalClients(response.length);
        } else {
          setClients([]);
          setTotalClients(0);
        }
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
  }, [page, limit, search, token, clientsService, router]);

  const handleClientClick = (clientId: string) => {
    router.push(`/clientDetails/${clientId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalClients / limit)) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleCreateClient = () => {
    router.push("/createClient");
  };

  return (
    <div className="flex">
      {/* Barra de Navegação do Usuário */}
      <div className="absolute top-4 right-4">
        <UserNav />
      </div>

      {/* Sidebar */}
      <div className="h-[100vh]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Clientes</h1>

        {/* Barra de Pesquisa */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full mr-2"
          />
          <button className="p-2 bg-gray-200 rounded">
            <Search size={20} />
          </button>
        </div>

        {/* Lista de Clientes */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            {Array.isArray(clients) && clients.length > 0 ? (
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
            ) : (
              <p>Nenhum cliente encontrado.</p>
            )}
          </div>
        )}

        {/* Paginação */}
        <Pagination
          totalItems={totalClients}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          isLastPage={page >= Math.ceil(totalClients / limit)}
        />

        {/* Limite por página e botão de criação */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <label htmlFor="limit" className="mr-2">
              Itens por página:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border p-2 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleCreateClient}
          >
            Criar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

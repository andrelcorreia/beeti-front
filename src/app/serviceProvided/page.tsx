"use client";
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/SideBar";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { ServiceProvidedRequest } from "@/services/serviceProvidedRequest";
import { Search } from "lucide-react"; // Ícone de busca do Lucide React

export default function ServiceProvided() {
  const [service, setService] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const serviceProvidedRequest = useMemo(
    () => new ServiceProvidedRequest(),
    []
  );
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (!token) {
          throw new Error("Token não encontrado.");
        }

        const response = await serviceProvidedRequest.listAll(
          token,
          page,
          limit,
          search
        );

        console.log({ response });

        // Atualizar para usar a estrutura correta da resposta da API
        if (response.result === "success" && Array.isArray(response.data)) {
          setService(response.data);
          setTotalUsers(response.data.length); // Atualize com base na contagem correta
        } else {
          setService([]);
          setTotalUsers(0);
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

    fetchUsers();
  }, [page, limit, search, token, serviceProvidedRequest, router]);

  const handleUserClick = (serviceId: string) => {
    router.push(`/serviceDetails/${serviceId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalUsers / limit)) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleCreateService = () => {
    router.push("/createService");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-[100vh]">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Serviços Providenciados</h1>

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

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            {Array.isArray(service) && service.length > 0 ? (
              <ul className="space-y-4">
                {service.map((service) => (
                  <li
                    key={service.id}
                    className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handleUserClick(service.id)}
                  >
                    <p>
                      <strong>Descrição:</strong> {service.description}
                    </p>
                    <p>
                      <strong>Quem fez:</strong> {service.user.name}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum serviço encontrado.</p>
            )}
          </div>
        )}

        {/* Paginação */}
        <Pagination
          totalItems={totalUsers}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          isLastPage={page >= Math.ceil(totalUsers / limit)}
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
            onClick={handleCreateService}
          >
            Criar Novo Serviço
          </button>
        </div>
      </div>
    </div>
  );
}

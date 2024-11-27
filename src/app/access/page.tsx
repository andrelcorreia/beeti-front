"use client";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/SideBar";
import { UserNav } from "@/components/UserNav";
import { AccessLevelRequest } from "@/services/accessLevelRequest";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Access() {
  const [access, setAccess] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [totalAccess, setTotalAccess] = useState(0);
  const accessLevelRequest = useMemo(() => new AccessLevelRequest(), []);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        if (!token) {
          throw new Error("Token não encontrado.");
        }

        const data = await accessLevelRequest.listAll(token, page, limit);
        console.log({ data });
        setAccess(data.data.data);
      } catch (err: any) {
        setError(err.message);
        if (err.message === "Token não encontrado.") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccess();
  }, [page, limit, router, token, accessLevelRequest]);

  const handleAccessClick = (accessLevelId: string) => {
    router.push(`/accessDetails/${accessLevelId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalAccess / limit)) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleCreateUser = () => {
    router.push("/createUser");
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
        <h1 className="text-xl font-bold mb-5">Níveis de acesso</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            {Array.isArray(access) && access.length > 0 ? (
              <ul className="space-y-4">
                {access.map((accessLevel) => (
                  <li
                    key={accessLevel.id}
                    className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handleAccessClick(accessLevel.id)}
                  >
                    <p>
                      <strong>Nome:</strong> {accessLevel.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Níveis de acesso não encontrado.</p>
            )}
          </div>
        )}

        {/* Paginação */}
        <Pagination
          totalItems={2}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          isLastPage={false}
        />

        {/* Limite por página */}
        <div className="mt-4">
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
        {/* <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleCreateUser}
        >
          Criar Novo Nível de accesso
        </button> */}
      </div>
    </div>
  );
}

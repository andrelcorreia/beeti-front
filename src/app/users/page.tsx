"use client";
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/SideBar";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { UsersRequest } from "@/services/usersRequest";
import { UserNav } from "@/components/UserNav";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersRequest = useMemo(() => new UsersRequest(), []);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          throw new Error("Token não encontrado.");
        }

        const data = await usersRequest.listAll(token, page, limit);

        setUsers(data.users);
        setTotalUsers(data.total);
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
  }, [page, limit, router, token, usersRequest]);

  const handleUserClick = (userId: string) => {
    router.push(`/userDetails/${userId}`);
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
        <h1 className="text-xl font-bold mb-5">Usuários</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            {Array.isArray(users) && users.length > 0 ? (
              <ul className="space-y-4">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}

        {/* Paginação */}
        <Pagination
          totalItems={totalUsers}
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
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleCreateUser}
        >
          Criar Novo Usuário
        </button>
      </div>
    </div>
  );
}

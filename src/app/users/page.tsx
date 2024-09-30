"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SideBar";
import { useRouter } from "next/navigation";
import { UsersRequest } from "@/services/usersRequest";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userService = new UsersRequest();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          throw new Error("Token não encontrado.");
        }

        const data = await userService.listAll(token);
        setUsers(data);
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
  }, [token]);

  const handleUserClick = (userId: string) => {
    router.push(`/userDetails/${userId}`);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
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
            {users.length > 0 ? (
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
      </div>
    </div>
  );
}

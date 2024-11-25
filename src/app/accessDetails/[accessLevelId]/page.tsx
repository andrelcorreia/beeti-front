"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { AccessLevelRequest } from "@/services/accessLevelRequest";
import { UserNav } from "@/components/UserNav";
import Pagination from "@/components/Pagination";
import EditPermissions from "@/components/EditPermissions";

export default function AccessDetails({ params }: any) {
  const router = useRouter();
  const { accessLevelId } = params;

  const [accessLevel, setAccessLevel] = useState<any>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPermissions, setTotalPermissions] = useState(0);

  const accessLevelRequest = useMemo(() => new AccessLevelRequest(), []);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Busca detalhes do nível de acesso
  useEffect(() => {
    const fetchAccessLevelDetails = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");
        const data = await accessLevelRequest.listById(token, accessLevelId);

        console.log("nivel", { data });
        setAccessLevel(data.data.data);
        setName(data.data.data.description);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessLevelDetails();
  }, [accessLevelId, token, accessLevelRequest]);

  // Busca permissões relacionadas ao nível de acesso
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");
        const data = await accessLevelRequest.listPermissions(
          token,
          accessLevelId,
          page,
          limit
        );

        console.log({ data });
        setPermissions(data.data.data);
        setTotalPermissions(6);
      } catch (err) {
        console.error("Erro ao buscar permissões:", err);
      }
    };

    fetchPermissions();
  }, [accessLevelId, page, limit, token, accessLevelRequest]);

  const handleSave = async () => {
    try {
      if (!token) throw new Error("Token não encontrado.");
      await accessLevelRequest.edit(token, accessLevelId, {
        description: name,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    router.push("/access");
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
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            <h1 className="text-xl font-bold mb-5">
              Detalhes do Nível de Acesso
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Nome:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                    maxLength={140}
                  />
                ) : (
                  <p>{accessLevel?.description}</p>
                )}
              </div>

              {/* Lista de permissões */}
              <div>
                <h2 className="font-medium mb-3">Permissões:</h2>
                {permissions.length > 0 ? (
                  <ul className="space-y-2">
                    {permissions.map((permission) => (
                      <li key={permission.id} className="border p-2 rounded">
                        {permission.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Sem permissões encontradas.</p>
                )}
              </div>

              {/* Paginação */}
              <Pagination
                totalItems={totalPermissions}
                currentPage={page}
                itemsPerPage={limit}
                onPageChange={setPage}
                isLastPage={permissions.length < limit}
              />

              {/* Botões */}
              <div className="flex space-x-4 mt-5">
                <button
                  onClick={() => setIsEditingPermissions(true)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Editar Permissões
                </button>

                {isEditingPermissions && (
                  <EditPermissions
                    accessLevelId={accessLevelId}
                    token={token!}
                    onClose={() => setIsEditingPermissions(false)}
                    onSave={() => {
                      setIsEditingPermissions(false);
                      // Atualiza permissões na tela principal
                      setPage(1); // Reseta a paginação para refazer a busca
                    }}
                  />
                )}

                <button
                  className="bg-gray-500 text-white p-2 rounded"
                  onClick={handleBack}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

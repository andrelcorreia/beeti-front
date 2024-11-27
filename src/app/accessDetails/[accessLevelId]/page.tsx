"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { AccessLevelRequest } from "@/services/accessLevelRequest";
import { UserNav } from "@/components/UserNav";
import Pagination from "@/components/Pagination";

export default function AccessDetails({ params }: any) {
  const router = useRouter();
  const { accessLevelId } = params;

  const [accessLevel, setAccessLevel] = useState<any>(null);
  const [appliedPermissions, setAppliedPermissions] = useState<any[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPermissions, setTotalPermissions] = useState(0);

  const [availablePage, setAvailablePage] = useState(1);
  const [availableTotal, setAvailableTotal] = useState(0);

  const accessLevelRequest = useMemo(() => new AccessLevelRequest(), []);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch detalhes do nível de acesso
  useEffect(() => {
    const fetchAccessLevelDetails = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");
        const data = await accessLevelRequest.listById(token, accessLevelId);

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

  // Fetch permissões aplicadas
  useEffect(() => {
    const fetchAppliedPermissions = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");
        const data = await accessLevelRequest.listPermissions(
          token,
          accessLevelId,
          page,
          limit
        );

        setAppliedPermissions(data.data.data);
        setTotalPermissions(data.data.total);
      } catch (err) {
        console.error("Erro ao buscar permissões aplicadas:", err);
      }
    };

    fetchAppliedPermissions();
  }, [accessLevelId, page, limit, token, accessLevelRequest]);

  // Fetch permissões disponíveis
  useEffect(() => {
    const fetchAvailablePermissions = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");
        const data = await accessLevelRequest.listAvailablePermissions(
          token,
          accessLevelId,
          availablePage,
          limit
        );

        setAvailablePermissions(data.data.data);
        setAvailableTotal(data.data.total);
      } catch (err) {
        console.error("Erro ao buscar permissões disponíveis:", err);
      }
    };

    fetchAvailablePermissions();
  }, [accessLevelId, availablePage, limit, token, accessLevelRequest]);

  const movePermission = (id: string, fromApplied: boolean) => {
    if (fromApplied) {
      const permission = appliedPermissions.find((perm) => perm.id === id);
      setAppliedPermissions((prev) => prev.filter((perm) => perm.id !== id));
      setAvailablePermissions((prev) => [...prev, permission]);
    } else {
      const permission = availablePermissions.find((perm) => perm.id === id);
      setAvailablePermissions((prev) => prev.filter((perm) => perm.id !== id));
      setAppliedPermissions((prev) => [...prev, permission]);
    }
  };

  const handleSavePermissions = async () => {
    try {
      if (!token) throw new Error("Token não encontrado.");
      const appliedIds = appliedPermissions.map((perm) => perm.id);
      await accessLevelRequest.updatePermissions(
        token,
        accessLevelId,
        appliedIds
      );
      alert("Permissões atualizadas com sucesso!");
      setIsEditingPermissions(false);
    } catch (err) {
      console.error("Erro ao salvar permissões:", err);
    }
  };

  const handleBack = () => {
    router.push("/access");
  };

  const toggleEditing = () => {
    setIsEditingPermissions((prev) => !prev);
  };

  const totalPages = (total: number) => Math.ceil(total / limit);

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
                <p>{accessLevel?.description}</p>
              </div>

              <button
                onClick={toggleEditing}
                className="bg-blue-500 text-white p-2 rounded"
              >
                {isEditingPermissions ? "Cancelar" : "Editar"}
              </button>

              {/* Permissões aplicadas */}
              <div>
                <h2 className="font-medium mb-3">Permissões Aplicadas:</h2>
                <ul className="space-y-2">
                  {appliedPermissions.map((permission) => (
                    <li
                      key={permission.id}
                      className="border p-2 rounded flex justify-between"
                    >
                      {permission.description}
                      {isEditingPermissions && (
                        <button
                          className="text-red-500"
                          onClick={() => movePermission(permission.id, true)}
                        >
                          Remover
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Paginação aplicada */}
              {/* <Pagination
                totalItems={totalPermissions}
                currentPage={page}
                itemsPerPage={limit}
                onPageChange={setPage}
                isLastPage={page >= totalPages(totalPermissions)}
              /> */}

              {/* Permissões disponíveis */}
              <div>
                <h2 className="font-medium mb-3">Permissões Disponíveis:</h2>
                <ul className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <li
                      key={permission.id}
                      className="border p-2 rounded flex justify-between"
                    >
                      {permission.description}
                      {isEditingPermissions && (
                        <button
                          className="text-blue-500"
                          onClick={() => movePermission(permission.id, false)}
                        >
                          Adicionar
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Paginação disponível */}
              {/* <Pagination
                totalItems={availableTotal}
                currentPage={availablePage}
                itemsPerPage={limit}
                onPageChange={setAvailablePage}
                isLastPage={availablePage >= totalPages(availableTotal)}
              /> */}

              {/* Botões */}
              <div className="flex space-x-4 mt-5">
                {isEditingPermissions && (
                  <button
                    onClick={handleSavePermissions}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Salvar
                  </button>
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

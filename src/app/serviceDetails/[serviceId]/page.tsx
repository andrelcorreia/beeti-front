"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { Clients } from "@/services/clientsRequest";
import { ServiceProvidedRequest } from "@/services/serviceProvidedRequest";
import { UserNav } from "@/components/UserNav";

export default function ServiceProvidedDetails({ params }: any) {
  const router = useRouter();
  const { serviceId } = params; // Alterado para pegar o serviceId
  const clientsService = useMemo(() => new Clients(), []);
  const serviceProvidedRequest = useMemo(
    () => new ServiceProvidedRequest(),
    []
  );

  const [service, setService] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");
  const [technicalDate, setTechnicalDate] = useState<boolean | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

  // Fetch Service Details
  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");

        const data = await serviceProvidedRequest.listById(token, serviceId);

        if (!data || data.result !== "success") {
          throw new Error("Serviço não encontrado.");
        }
        console.log({ data });
        console.log({ servi: data.data });
        setService(data.data);
        setDescription(data.data.description);
        setEstimatedDate(data.data.estimated_date);
        // Verifica se technical_date é booleano ou deixa como undefined
        setTechnicalDate(
          typeof data.data.technical_date === "boolean"
            ? data.data.technical_date
            : undefined
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, token, serviceProvidedRequest]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await serviceProvidedRequest.edit(token, serviceId, {
        description,
        estimated_date:
          estimatedDate && estimatedDate !== ""
            ? new Date(estimatedDate)
            : undefined,
        technical_date: technicalDate,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (confirm("Você tem certeza que deseja deletar o serviço?")) {
      try {
        await serviceProvidedRequest.delete(token, serviceId);
        router.push("/serviceProvided");
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleBack = () => {
    router.push("/serviceProvided");
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
            <h1 className="text-xl font-bold mb-5">{service.client.name}</h1>
            <div className="space-y-4">
              {/* Campos de descrição, data estimada, data técnica */}
              <div>
                <label className="block font-medium">Descrição:</label>
                {isEditing ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{service.description}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Data de Criação:</label>
                <p>{new Date(service.created_at).toLocaleDateString()}</p>
              </div>

              <div>
                <label className="block font-medium">Data Estimada:</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={estimatedDate}
                    onChange={(e) => setEstimatedDate(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{service.estimated_date || "Não definida"}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Data Técnica:</label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={technicalDate === true}
                      onChange={(e) =>
                        setTechnicalDate(e.target.checked ? true : undefined)
                      }
                    />
                    <span>
                      {technicalDate ? "Confirmado" : "Não confirmado"}
                    </span>
                  </div>
                ) : (
                  <p>{technicalDate ? "Confirmado" : "Não confirmado"}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Responsável:</label>
                <p>{service.user.name}</p>
              </div>

              {/* Botão de editar */}
              {!isEditing ? (
                <button
                  className="mt-4 bg-blue-500 text-white p-2 rounded"
                  onClick={handleEdit}
                >
                  Editar
                </button>
              ) : (
                <button
                  className="mt-4 bg-green-500 text-white p-2 rounded"
                  onClick={handleSave}
                >
                  Salvar
                </button>
              )}

              {/* Botão de deletar */}
              <button
                className="mt-4 bg-red-500 text-white p-2 rounded"
                onClick={handleDelete}
              >
                Deletar
              </button>

              {/* Botão de voltar */}
              <button
                className="mt-4 bg-gray-500 text-white p-2 rounded"
                onClick={handleBack}
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

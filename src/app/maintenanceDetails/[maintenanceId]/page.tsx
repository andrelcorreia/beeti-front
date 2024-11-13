"use client";
import Sidebar from "@/components/SideBar";
import { Clients } from "@/services/clientsRequest";
import { MaintenanceRequest } from "@/services/maintenanceRequest";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function MaintenanceDetails({ params }: any) {
  const router = useRouter();
  const { maintenanceId } = params; // Alterado para pegar o serviceId
  const clientsService = useMemo(() => new Clients(), []);
  const maintenanceRequest = useMemo(() => new MaintenanceRequest(), []);

  const [maintenance, setMaintenance] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");
  const [technicalDate, setTechnicalDate] = useState<boolean | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");

        const data = await maintenanceRequest.listById(token, maintenanceId);

        if (!data || data.result !== "success") {
          throw new Error("Serviço não encontrado.");
        }

        console.log({ servi: data.data });
        setMaintenance(data.data);
        setDescription(data.data.description);
        setEstimatedDate(data.data.estimated_date);

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
  }, [maintenanceId, token, maintenanceRequest]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await maintenanceRequest.edit(token, maintenanceId, {
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
        await maintenanceRequest.delete(token, maintenanceId);
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
              {maintenance.client.name}
            </h1>
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
                  <p>{maintenance.description}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Data de Criação:</label>
                <p>{new Date(maintenance.created_at).toLocaleDateString()}</p>
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
                  <p>
                    {new Date(
                      maintenance.estimated_date
                    ).toLocaleDateString() || "Não definida"}
                  </p>
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
                <p>{maintenance.user.name}</p>
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

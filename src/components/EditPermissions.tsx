import React, { useEffect, useState } from "react";
import { AccessLevelRequest } from "@/services/accessLevelRequest";

interface EditPermissionsProps {
  accessLevelId: string;
  token: string;
  onClose: () => void;
  onSave: () => void;
}

const EditPermissions: React.FC<EditPermissionsProps> = ({
  accessLevelId,
  token,
  onClose,
  onSave,
}) => {
  const [activePermissions, setActivePermissions] = useState<any[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const accessLevelRequest = React.useMemo(() => new AccessLevelRequest(), []);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const [active, available] = await Promise.all([
          accessLevelRequest.listPermissions(token, accessLevelId),
          accessLevelRequest.listAvailablePermissions(token, accessLevelId),
        ]);

        console.log({ active, available });

        setActivePermissions(active);
        setAvailablePermissions(available);
      } catch (err) {
        console.error("Erro ao buscar permissões:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [accessLevelId, token, accessLevelRequest]);

  const handleAddPermission = (permission: any) => {
    setActivePermissions((prev) => [...prev, permission]);
    setAvailablePermissions((prev) =>
      prev.filter((item) => item.id !== permission.id)
    );
  };

  const handleRemovePermission = (permission: any) => {
    setAvailablePermissions((prev) => [...prev, permission]);
    setActivePermissions((prev) =>
      prev.filter((item) => item.id !== permission.id)
    );
  };

  const handleSave = async () => {
    try {
      await accessLevelRequest.updatePermissions(token, accessLevelId, {
        activePermissions: activePermissions.map((p) => p.id),
      }); //Aqui deve enviar os ids em uma array

      onSave();
    } catch (err) {
      console.error("Erro ao salvar permissões:", err);
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Editar Permissões</h2>
          <div className="flex space-x-4">
            {/* Permissões Ativas */}
            <div className="w-1/2">
              <h3 className="font-medium">Permissões Ativas</h3>
              <ul className="border rounded p-2 space-y-2">
                {activePermissions.map((permission) => (
                  <li
                    key={permission.id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    {permission.name}
                    <button
                      onClick={() => handleRemovePermission(permission)}
                      className="text-red-500"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Permissões Disponíveis */}
            <div className="w-1/2">
              <h3 className="font-medium">Permissões Disponíveis</h3>
              <ul className="border rounded p-2 space-y-2">
                {availablePermissions.map((permission) => (
                  <li
                    key={permission.id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    {permission.name}
                    <button
                      onClick={() => handleAddPermission(permission)}
                      className="text-green-500"
                    >
                      Adicionar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white p-2 rounded"
            >
              Salvar
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPermissions;

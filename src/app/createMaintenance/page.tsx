"use client";
import Sidebar from "@/components/SideBar";
import { UserNav } from "@/components/UserNav";
import { Clients } from "@/services/clientsRequest";
import { MaintenanceRequest } from "@/services/maintenanceRequest";
import { ProductsRequest } from "@/services/productRequest";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateMaintenance() {
  const [description, setDescription] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");
  const [technicalDate, setTechnicalDate] = useState(false);
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maintenanceRequest = new MaintenanceRequest();
  const productsRequest = new ProductsRequest();
  const clientsService = new Clients();
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        if (token) {
          const data = await clientsService.listAllClients(token);

          const productData = await productsRequest.listAllProducts(token);
          // Adicionando verificação para evitar erros
          setClients(data ?? []);
          setProducts(productData ?? []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchClients();
  }, [token]);

  const handleCreateService = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("Token não encontrado.");
      }

      await maintenanceRequest.create(token, {
        description,
        estimated_date: new Date(estimatedDate),
        technical_date: technicalDate,
        client_id: clientId,
        product_id: productId,
        occ_id: null,
      });

      router.push("/serviceProvided");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="absolute top-4 right-4">
        <UserNav />
      </div>
      <div className="h-[100vh]">
        <Sidebar />
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Criar nova Manutenção</h1>
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Descrição: *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full"
              maxLength={150}
            />
          </div>
          <div>
            <label className="block font-medium">Data Estimada: *</label>
            <input
              type="date"
              value={estimatedDate}
              onChange={(e) => setEstimatedDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Visita Técnica: *</label>
            <input
              type="checkbox"
              checked={technicalDate}
              onChange={(e) => setTechnicalDate(e.target.checked)}
              className="ml-2"
            />
          </div>
          <div>
            <label className="block font-medium">Cliente: *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Selecione um Cliente</option>
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))
              ) : (
                <option disabled>Nenhum cliente encontrado</option>
              )}
            </select>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Selecione um Produto</option>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))
              ) : (
                <option disabled>Nenhum produto encontrado</option>
              )}
            </select>
          </div>
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={handleCreateService}
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar Serviço"}
          </button>
        </div>
      </div>
    </div>
  );
}

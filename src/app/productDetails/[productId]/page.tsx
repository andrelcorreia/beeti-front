"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { ProductsRequest } from "@/services/productRequest";

export default function ProductDetails({ params }: any) {
  const router = useRouter();
  const { productId } = params;
  const productRequest = useMemo(() => new ProductsRequest(), []);

  const [client, setClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchClient = async () => {
      try {
        if (!token) throw new Error("Token não encontrado.");

        const data = await productRequest.listAllProducts(token);
        const selectedProduct = data.find((c: any) => c.id === productId);

        if (!selectedProduct) throw new Error("Cliente não encontrado.");

        setClient(selectedProduct);
        setName(selectedProduct.name);
        setDescription(selectedProduct.description);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [productId, token, productRequest]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log("info received", { productId });
    try {
      await productRequest.editProduct(token!, productId, {
        name,
        description,
      });
      setIsEditing(false);

      router.push("/products");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    router.push("/products");
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
            <h1 className="text-xl font-bold mb-5">{client.name}</h1>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{name}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Descrição:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{description}</p>
                )}
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

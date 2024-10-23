"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { ProductsRequest } from "@/services/productRequest";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const productsService = new ProductsRequest();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleCreateProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("Token não encontrado.");
      }

      await productsService.createProduct(token, {
        name,
        description,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/products");
  };

  return (
    <div className="flex">
      <div className="h-[100vh]">
        <Sidebar />
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Criação de Produto</h1>
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Nome:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Descrição:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            className="mt-4 bg-green-500 text-white p-2 rounded"
            onClick={handleCreateProduct}
            disabled={loading}
          >
            {loading ? "Creating..." : "Criar Produto"}
          </button>
          <button
            className="mt-4 bg-gray-500 text-white p-2 rounded"
            onClick={handleBack}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

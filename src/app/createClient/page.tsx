"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import { Clients } from "@/services/clientsRequest";
import InputMask from "react-input-mask";
import { UserNav } from "@/components/UserNav";

export default function CreateClient() {
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientsService = new Clients();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleCreateClient = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("Token não encontrado.");
      }

      await clientsService.createClient(token, {
        name,
        document,
        full_address: fullAddress,
        telephone,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
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
        <h1 className="text-xl font-bold mb-5">Criação de Cliente</h1>
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Nome: *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
              maxLength={150}
            />
          </div>
          <div>
            <label className="block font-medium">Documento (CPF): *</label>
            <InputMask
              mask="999.999.999-99"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Endereço completo: *</label>
            <input
              type="text"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              className="border p-2 rounded w-full"
              maxLength={250}
            />
          </div>
          <div>
            <label className="block font-medium">Telefone: *</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="border p-2 rounded w-full"
              maxLength={11}
            />
          </div>
          <button
            className="mt-4 bg-green-500 text-white p-2 rounded"
            onClick={handleCreateClient}
            disabled={loading}
          >
            {loading ? "Creating..." : "Salvar"}
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

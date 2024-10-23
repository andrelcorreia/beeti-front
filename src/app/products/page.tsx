"use client";
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/SideBar";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { ProductsRequest } from "@/services/productRequest";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsRequest = useMemo(() => new ProductsRequest(), []);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!token) {
          throw new Error("Token não encontrado.");
        }

        const data = await productsRequest.listAllProducts(token, page, limit);
        console.log({ data });
        setProducts(data);
        setTotalProducts(data.length);
      } catch (err: any) {
        setError(err.message);
        if (err.message === "Token não encontrado.") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, router, token, productsRequest]);

  const handleProductClick = (productId: string) => {
    router.push(`/productDetails/${productId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalProducts / limit)) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(0);
  };

  const handleCreateProduct = () => {
    router.push("/createProduct");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-[100vh]">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Produtos</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            {Array.isArray(products) && products.length > 0 ? (
              <ul className="space-y-4">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <p>
                      <strong>Nome:</strong> {product.name}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {product.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}

        {/* Paginação */}
        <Pagination
          totalItems={totalProducts}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          isLastPage={false}
        />

        <div className="mt-4 flex items-center space-x-4">
          <div>
            <label htmlFor="limit" className="mr-2">
              Itens por página:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border p-2 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleCreateProduct}
          >
            Criar Produto
          </button>
        </div>
      </div>
    </div>
  );
}

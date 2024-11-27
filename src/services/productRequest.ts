// services/productRequest.ts

export class ProductsRequest {
  async listAllProducts(token: string, page: number = 0, limit: number = 15) {
    try {
      console.log({ page, limit });
      const response = await fetch(
        `http://localhost:3333/v1/products?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({ response });
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const result = await response.json();
      console.log({ result });
      if (result.result === "success" && Array.isArray(result.data)) {
        return result.data;
      } else {
        throw new Error(
          result.message || "Erro desconhecido na resposta da API"
        );
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  }

  async createProduct(
    token: string,
    productData: {
      name: string;
      description: string;
    }
  ) {
    try {
      const response = await fetch("http://localhost:3333/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar produto");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  }

  async deleteProduct(token: string, id: string) {
    try {
      const response = await fetch(`http://localhost:3333/v1/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar produto");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  }

  async editProduct(
    token: string,
    productId: string,
    productData: { name: string; description: string }
  ) {
    console.log({ token, productId, productData });
    try {
      const response = await fetch(
        `http://localhost:3333/v1/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar produto");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  }
}

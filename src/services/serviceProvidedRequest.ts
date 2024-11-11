export interface ServicesProvided {
  id: string;
  description: string;
  created_at: Date;
  active: boolean;
  estimated_date: Date;
  technical_date: boolean;
  user_id: string;
  client_id: string;
}

export class ServiceProvidedRequest {
  async listAll(token: string, page: number = 0, limit: number = 15) {
    try {
      const response = await fetch(
        `http://localhost:3333/v1/serviceProvided?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const result = await response.json();

      if (
        result.result === "success" &&
        result.data &&
        Array.isArray(result.data.list)
      ) {
        return {
          users: result.data.list,
          total: result.data.total,
        };
      } else {
        throw new Error(
          result.message || "Erro desconhecido na resposta da API"
        );
      }
    } catch (error) {
      console.error("Erro ao buscar servições providenciados:", error);
      throw error;
    }
  }

  async edit(
    token: string,
    id: string,
    serviceData: Omit<ServicesProvided, "created_at">
  ) {
    try {
      const response = await fetch(
        `http://localhost:3333/v1/serviceProvided/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao atualizar o serviço providenciado"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar o serviço providenciado:", error);
      throw error;
    }
  }

  async create(
    token: string,
    serviceData: Omit<ServicesProvided, "id" | "created_at" | "active">
  ) {
    try {
      const response = await fetch(`http://localhost:3333/v1/serviceProvided`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao criar o serviço providenciado"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao criar o serviço providenciado:", error);
      throw error;
    }
  }

  async delete(token: string, id: string) {
    try {
      const response = await fetch(
        `http://localhost:3333/v1/serviceProvided/inactive/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao deletar o serviço providenciado"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao deletar o serviço providenciado:", error);
      throw error;
    }
  }
}

export class Clients {
  async listAllClients(
    token: string,
    page: number = 0,
    limit: number = 15,
    description?: string
  ) {
    try {
      const response = await fetch(
        `http://localhost:3333/v1/clients?limit=${limit}&page=${page}$description=${description}`,
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

      if (result.result === "success" && Array.isArray(result.data)) {
        return result.data;
      } else {
        throw new Error(
          result.message || "Erro desconhecido na resposta da API"
        );
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  }

  async createClient(
    token: string,
    clientData: {
      name: string;
      document: string;
      full_address: string;
      telephone: string;
    }
  ) {
    try {
      const response = await fetch("http://localhost:3333/v1/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar cliente");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  }

  async inactiveClient(token: string, id: string) {
    try {
      const response = await fetch(`http://localhost:3333/v1/clients/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar cliente");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  }

  async editClient(
    token: string,
    clientId: string,
    clientData: { name: string; full_address: string; telephone: string }
  ) {
    console.log({ token, clientId, clientData });
    try {
      const response = await fetch(
        `http://localhost:3333/v1/clients/${clientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clientData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar cliente");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  }
}

import api from "./axios";

export class UsersRequest {
  async listAll(token: string, page: number = 0, limit: number = 15) {
    try {
      const response = await fetch(
        `http://localhost:3333/v1/users?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      console.log("test2");
      const result = await response.json();
      console.log({ result });

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
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  async createUser(
    token: string,
    userData: {
      name: string;
      email: string;
      password: string;
      access_level_id: string;
    }
  ) {
    try {
      console.log({ userData });
      const response = await api.post(
        "/users",
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          access_level_id: userData.access_level_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao criar o usuário:", error);
      throw error;
    }
  }

  async editUser(
    token: string,
    userId: string,
    userData: { name: string; email: string; access_level_id: string }
  ) {
    console.log({ token, userId, userData });
    try {
      const response = await fetch(`http://localhost:3333/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar o usuário");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      throw error;
    }
  }

  async inactive(token: string, userId: string) {
    try {
      const response = await fetch(`http://localhost:3333/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar o usuário");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      throw error;
    }
  }
}

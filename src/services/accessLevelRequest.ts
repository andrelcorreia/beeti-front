import api from "./axios";

export class AccessLevelRequest {
  async listAll(token: string, page: number = 0, limit: number = 15) {
    try {
      const response = await api.get(
        `/access-level?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Erro ao buscar níveis de acesso:", error);
      throw error;
    }
  }

  async listById(token: string, id: string) {
    try {
      const response = await api.get(`/access-level/listById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Erro ao buscar níveis de acesso:", error);
      throw error;
    }
  }

  async listPermissions(
    token: string,
    id: string,
    page: number = 0,
    limit: number = 15
  ) {
    try {
      const response = await api.get(
        `/access-level/permissionsByAccess/${id}?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Erro ao buscar níveis de acesso:", error);
      throw error;
    }
  }

  async listAvailablePermissions(
    token: string,
    id: string,
    page: number = 0,
    limit: number = 15
  ) {
    try {
      const response = await api.get(
        `/access-level/permissionsAvailable/${id}?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Erro ao buscar níveis de acesso:", error);
      throw error;
    }
  }

  async edit(token: string, id: string, description: string) {
    try {
      const response = await api.put(`/access-level/${id}`, {
        description,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Erro ao atualizar níveis de acesso:", error);
      throw error;
    }
  }

  async updatePermissions(token: string, accessLevelId: string, id: string[]) {
    try {
      const response = await api.get(
        `/access-level/permissionsByAccess/${accessLevelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Erro ao buscar níveis de acesso:", error);
      throw error;
    }
  }
}

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
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }
}

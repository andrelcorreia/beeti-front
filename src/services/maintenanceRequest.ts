import api from "./axios";

export interface Maintenance {
  id: string;
  description: string;
  created_at: Date;
  active: boolean;
  estimated_date: Date;
  technical_date: boolean;
  user_id: string;
  client_id: string;
  product_id: string;
  occ_id: string | null;
}

export interface EditMaintenance {
  description: string | undefined;
  estimated_date: Date | undefined;
  technical_date: boolean | undefined;
}

export interface MaintenanceCompleteInfo {
  id: string;
  description: string;
  created_at: Date;
  active: boolean;
  estimated_date: Date;
  technical_date: boolean;
  user_id: string;
  client_id: string;
  client: {
    name: string;
  };
  user: {
    name: string;
  };
}

export class MaintenanceRequest {
  async listAll(
    token: string,
    page: number = 0,
    limit: number = 15,
    description: string
  ) {
    try {
      // Montar a URL dinamicamente
      const url =
        description && description !== ""
          ? `/maintenance?limit=${limit}&page=${page}&description=${description}`
          : `/maintenance?limit=${limit}&page=${page}`;

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) {
        throw new Error(`Erro na requisição: ${response}`);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar servições providenciados:", error);
      throw error;
    }
  }

  async listById(token: string, id: string) {
    try {
      // Montar a URL dinamicamente
      const response = await api.get(`/maintenance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) {
        throw new Error(`Erro na requisição: ${response}`);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar servições providenciados:", error);
      throw error;
    }
  }

  async edit(token: string, id: string, serviceData: EditMaintenance) {
    try {
      const response = await api.put(
        `/maintenance/${id}`,
        {
          ...serviceData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response) {
        throw new Error(`Erro na requisição: ${response}`);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o serviço providenciado:", error);
      throw error;
    }
  }

  async create(
    token: string,
    serviceData: Omit<Maintenance, "id" | "created_at" | "active" | "user_id">
  ) {
    try {
      const response = await api.post(
        `/maintenance`,
        {
          ...serviceData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response) {
        throw new Error(`Erro na requisição: ${response}`);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao criar o serviço providenciado:", error);
      throw error;
    }
  }

  async delete(token: string, id: string) {
    try {
      const response = await api.delete(`/maintenance/inactive/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) {
        throw new Error(`Erro na requisição: ${response}`);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao deletar o serviço providenciado:", error);
      throw error;
    }
  }
}

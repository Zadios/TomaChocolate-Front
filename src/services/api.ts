import axios from 'axios';

// La URL de tu backend de Spring Boot
const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interfaces para los nuevos DTOs
export interface ExpenseRequest {
    description: string;
    amount: number;
    payerId: number;
}

export interface TransferStrategy {
    fromParticipant: string;
    toParticipant: string;
    amount: number;
}

export interface ParticipantBalance {
    name: string;
    totalPaid: number;
    balance: number;
}

export interface MeetingBalanceResponse {
    meetingName: string;
    totalAmount: number;
    averagePerPerson: number;
    participantBalances: ParticipantBalance[];
    transferSuggestions: TransferStrategy[]; // Coincide con tu Record
}

// Definimos la interfaz del Request (igual al MeetingRequest de Java)
export interface MeetingRequest {
    name: string;
    participantCount: number;
};

// Definimos la interfaz de la Respuesta (lo que devuelve tu MeetingController)
export interface Meeting {
    id: string; // UUID en Java es string en TS
    name: string;
    participantCount: number;
};

export const participantService = {
  createParticipant: (meetingId: string, name: string) => {
    // Retornamos la promesa directamente
    // Pasamos 'name' como el body del POST
    return api.post(`/participants/${meetingId}/participant`, name, {
      headers: { 'Content-Type': 'text/plain' } // Importante si Java espera un String plano
    });
  },

  updateName: async (id: number, name: string): Promise<void> => {
    // Usamos PATCH como en tu Controller
    await api.patch(`/participants/${id}`, { name });
  },
  
  deleteParticipant: async (id: number): Promise<void> => {
    await api.delete(`/participants/${id}`);
  }
};

export const meetingService = {
    createMeeting: async (data: MeetingRequest): Promise<Meeting> => {
        const response = await api.post<Meeting>('/meetings', data);
        return response.data;
    },

    getMeeting: async (id: string): Promise<Meeting> => {
        const response = await api.get<Meeting>(`/meetings/${id}`);
        return response.data;
    },

    getBalance: async (id: string): Promise<MeetingBalanceResponse> => {
        const response = await api.get(`/meetings/${id}/balance`);
        return response.data;
    }
};

export const expenseService = {
    createExpense: (meetingId: string, data: ExpenseRequest) => {
        // Tu ruta es /api/expenses/{meetingId}/expenses
        return api.post(`/expenses/${meetingId}/expenses`, data);
    },
    updateExpense: (expenseId: number, data: ExpenseRequest) => {
    return api.put(`/expenses/${expenseId}`, data);
    },

    deleteExpense: (meetingId: string, expenseId: number) => {
    return api.delete(`/expenses/${meetingId}/expenses/${expenseId}`);
    }
};

export default api;
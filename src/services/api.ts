import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface ExpenseRequest {
    description: string;
    amount: number;
    payerId: number;
    consumerIds?: number[];
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
    transferSuggestions: TransferStrategy[];
}

export interface MeetingRequest {
    name: string;
    participantCount: number;
};

export interface Meeting {
    id: string;
    name: string;
    participantCount: number;
};

export const participantService = {
    createParticipant: (meetingId: string, name: string, includeInAllExpenses: boolean = false) =>
        api.post(`/participants/${meetingId}/participant?includeInAllExpenses=${includeInAllExpenses}`, name, {
            headers: { 'Content-Type': 'text/plain' }
        }).then(res => res.data),

  updateName: async (id: number, name: string): Promise<void> => {
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

    getTotalMeetings: async (): Promise<{ total: number }> => {
        const response = await api.get('/meetings/stats/total-meetings');
        return response.data;
    },

    getBalance: async (id: string): Promise<MeetingBalanceResponse> => {
        const response = await api.get(`/meetings/${id}/balance`);
        return response.data;
    }
};

export const expenseService = {
    createExpense: (meetingId: string, data: ExpenseRequest) => {
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
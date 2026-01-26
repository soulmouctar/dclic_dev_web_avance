import api from './api';
import { ContributionPayment, PaginationInfo } from './memberService';

export interface CreateContributionData {
  user_id: number;
  year: number;
  month: number;
  amount: number;
  payment_date: string;
  payment_method: 'CASH' | 'TRANSFER' | 'OTHER';
  reference?: string;
}

export interface ContributionsResponse {
  payments: ContributionPayment[];
  pagination: PaginationInfo;
}

export const contributionService = {
  // Historique des cotisations (Admin: global, Membre: personnel)
  async getContributions(filters?: {
    year?: number;
    month?: number;
    user_id?: number;
    page?: number;
  }): Promise<ContributionsResponse> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.user_id) params.append('user_id', filters.user_id.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    
    const response = await api.get(`/contributions?${params.toString()}`);
    return response.data;
  },

  // Admin: Enregistrer un nouveau paiement
  async createContribution(data: CreateContributionData): Promise<ContributionPayment> {
    const response = await api.post('/contributions', data);
    return response.data.payment;
  }
};

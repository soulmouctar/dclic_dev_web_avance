import api from './api';
import { User } from './authService';

export interface Member extends User {
  created_at: string;
}

export interface ContributionPayment {
  id: number;
  year: number;
  month: number;
  amount: number;
  payment_date: string;
  payment_method: 'CASH' | 'TRANSFER' | 'OTHER';
  reference?: string;
}

export interface MemberDetail {
  member: Member;
  payments: ContributionPayment[];
}

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface MembersResponse {
  members: Member[];
  pagination: PaginationInfo;
}

export interface CurrentStatus {
  current_month: {
    year: number;
    month: number;
    is_paid: boolean;
    payment?: {
      amount: number;
      payment_date: string;
      payment_method: string;
    };
  };
  year_summary: {
    year: number;
    months_paid: number;
    total_months: number;
  };
}

export interface AdminStats {
  total_members: number;
  paid_this_month: number;
  unpaid_this_month: number;
  total_amount_this_month: number;
  current_month: number;
  current_year: number;
}

export const memberService = {
  // Admin: Liste des membres avec recherche et pagination
  async getMembers(search?: string, page: number = 1): Promise<MembersResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    
    const response = await api.get(`/members?${params.toString()}`);
    return response.data;
  },

  // Admin: Détails d'un membre avec historique des paiements
  async getMemberDetail(memberId: number): Promise<MemberDetail> {
    const response = await api.get(`/members/${memberId}`);
    return response.data;
  },

  // Admin: Modifier le statut d'un membre
  async updateMemberStatus(memberId: number, status: 'ACTIVE' | 'INACTIVE'): Promise<Member> {
    const response = await api.put(`/members/${memberId}`, { status });
    return response.data.member;
  },

  // Membre: Statut de cotisation du mois en cours
  async getCurrentStatus(): Promise<CurrentStatus> {
    const response = await api.get('/contributions/current-status');
    return response.data;
  },

  // Admin: Statistiques du dashboard
  async getAdminStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};

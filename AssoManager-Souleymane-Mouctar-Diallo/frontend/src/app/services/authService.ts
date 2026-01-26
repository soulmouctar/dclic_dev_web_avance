import api from './api';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/me');
    return response.data.user;
  },

  setAuthData(token: string, user: User): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getAuthData(): { token: string | null; user: User | null } {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  },

  clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    const { token } = this.getAuthData();
    return !!token;
  },

  isAdmin(): boolean {
    const { user } = this.getAuthData();
    return user?.role === 'ADMIN';
  }
};

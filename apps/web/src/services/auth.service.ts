import { apiClient } from '@/lib/api-client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export const authService = {
  me: () => apiClient.get<AuthUser>('/auth/me'),
  signout: () => apiClient.post<void>('/auth/signout'),
};

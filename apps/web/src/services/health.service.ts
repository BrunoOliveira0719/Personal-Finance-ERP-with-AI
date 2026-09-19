import { apiClient } from '@/lib/api-client';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  timestamp: string;
  database: 'connected' | 'disconnected';
}

export const healthService = {
  check: () => apiClient.get<HealthStatus>('/health'),
};

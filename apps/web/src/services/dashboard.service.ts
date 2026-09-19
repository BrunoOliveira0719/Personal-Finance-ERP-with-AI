import { apiClient } from '@/lib/api-client';

export interface DashboardSummary {
  revenueCents: number;
  expensesCents: number;
  netCents: number;
  netWorthCents: number;
  breakEvenCents: number;
}

export const dashboardService = {
  summary: () => apiClient.get<DashboardSummary>('/dashboard'),
};
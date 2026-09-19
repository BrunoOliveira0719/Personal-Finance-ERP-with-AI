import { useQuery } from '@tanstack/react-query';
import { healthService } from '@/services/health.service';
import { dashboardService } from '@/services/dashboard.service';

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: healthService.check,
  });
  const summary = useQuery({ queryKey: ['dashboard'], queryFn: dashboardService.summary });
  const formatCents = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Revenue, expenses, net worth and break-even from your current financial data.
      </p>

      {summary.data && (
        <div className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Revenue', summary.data.revenueCents],
            ['Expenses', summary.data.expensesCents],
            ['Net result', summary.data.netCents],
            ['Net worth', summary.data.netWorthCents],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-panel p-5">
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-2 text-xl font-semibold text-ink">{formatCents(value as number)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 max-w-sm rounded-lg border border-line bg-panel p-5">
        <p className="text-sm font-medium text-muted">API connection</p>
        {isLoading && <p className="mt-2 text-sm text-ink">Checking…</p>}
        {isError && <p className="mt-2 text-sm text-negative">Could not reach the API.</p>}
        {data && (
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                data.status === 'ok' ? 'bg-positive' : 'bg-negative'
              }`}
            />
            <p className="text-sm text-ink">
              API {data.status} · database {data.database}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
interface Budget {
  id: string;
  categoryId: string;
  periodMonth: string;
  amountCents: string;
}
interface Goal {
  id: string;
  name: string;
  targetAmountCents: string;
  currentAmountCents: string;
  targetDate: string | null;
  status: string;
}
const money = (value: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(value) / 100,
  );
export function PlanningPage({ mode }: { mode: 'budgets' | 'goals' }) {
  const budgets = useQuery({
    queryKey: ['budgets'],
    queryFn: () => apiClient.get<Budget[]>('/budgets'),
    enabled: mode === 'budgets',
  });
  const goals = useQuery({
    queryKey: ['goals'],
    queryFn: () => apiClient.get<Goal[]>('/financial-goals'),
    enabled: mode === 'goals',
  });
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">
        {mode === 'budgets' ? 'Budgets' : 'Financial goals'}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {mode === 'budgets'
          ? 'Monitor planned spending by category and month.'
          : 'Track progress toward the outcomes that matter.'}
      </p>
      <div className="mt-8 rounded-lg border border-line bg-panel p-5">
        {mode === 'budgets' ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="py-3">Period</th>
                <th className="py-3">Category</th>
                <th className="py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {budgets.data?.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="py-3 text-ink">{item.periodMonth}</td>
                  <td className="py-3 text-muted">{item.categoryId}</td>
                  <td className="py-3 text-ink">{money(item.amountCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-5">
            {goals.data?.map((goal) => (
              <div key={goal.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-ink">{goal.name}</span>
                  <span className="text-muted">
                    {money(goal.currentAmountCents)} / {money(goal.targetAmountCents)}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-line">
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{
                      width: `${Math.min(100, (Number(goal.currentAmountCents) / Math.max(1, Number(goal.targetAmountCents))) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {((mode === 'budgets' ? budgets.data : goals.data)?.length ?? 0) === 0 && (
          <p className="text-sm text-muted">No records yet.</p>
        )}
      </div>
    </div>
  );
}

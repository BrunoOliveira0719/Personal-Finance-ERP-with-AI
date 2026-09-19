import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface Budget {
  id: string;
  categoryId: string;
  periodMonth: string;
  amountCents: string;
}

interface Category {
  id: string;
  name: string;
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
  const client = useQueryClient();
  const [periodMonth, setPeriodMonth] = useState(new Date().toISOString().slice(0, 7));
  const [categoryId, setCategoryId] = useState('');
  const [amountCents, setAmountCents] = useState('');
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [progressAmount, setProgressAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get<Category[]>('/categories'),
  });

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

  const createBudget = useMutation({
    mutationFn: () =>
      apiClient.post('/budgets', {
        categoryId,
        periodMonth,
        amountCents: Math.round(Number(amountCents.replace(',', '.')) * 100),
      }),
    onSuccess: () => {
      setAmountCents('');
      void client.invalidateQueries({ queryKey: ['budgets'] });
      void client.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  const createGoal = useMutation({
    mutationFn: () =>
      apiClient.post('/financial-goals', {
        name: goalName,
        targetAmountCents: Math.round(Number(targetAmount.replace(',', '.')) * 100),
        currentAmountCents: Math.round(Number(progressAmount.replace(',', '.')) * 100),
        targetDate: targetDate || null,
      }),
    onSuccess: () => {
      setGoalName('');
      setTargetAmount('');
      setProgressAmount('');
      setTargetDate('');
      void client.invalidateQueries({ queryKey: ['goals'] });
      void client.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  const submitBudget = (event: FormEvent) => {
    event.preventDefault();
    createBudget.mutate();
  };

  const submitGoal = (event: FormEvent) => {
    event.preventDefault();
    createGoal.mutate();
  };

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

      {mode === 'budgets' && (
        <form
          onSubmit={submitBudget}
          className="mt-8 grid gap-3 rounded-lg border border-line bg-panel p-5 md:grid-cols-4"
        >
          <input
            type="month"
            value={periodMonth}
            onChange={(e) => setPeriodMonth(e.target.value)}
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value="">Select category</option>
            {categories.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            value={amountCents}
            onChange={(e) => setAmountCents(e.target.value)}
            inputMode="decimal"
            placeholder="Budget amount"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
          <button
            type="submit"
            disabled={createBudget.isPending || !categoryId}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            {createBudget.isPending ? 'Saving...' : 'Add budget'}
          </button>
        </form>
      )}

      {mode === 'goals' && (
        <form
          onSubmit={submitGoal}
          className="mt-8 grid gap-3 rounded-lg border border-line bg-panel p-5 md:grid-cols-5"
        >
          <input
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="Goal name"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
          <input
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            inputMode="decimal"
            placeholder="Target amount"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
          <input
            value={progressAmount}
            onChange={(e) => setProgressAmount(e.target.value)}
            inputMode="decimal"
            placeholder="Current progress"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
          <button
            type="submit"
            disabled={createGoal.isPending || !goalName}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            {createGoal.isPending ? 'Saving...' : 'Add goal'}
          </button>
        </form>
      )}

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
                      width: `${Math.min(
                        100,
                        (Number(goal.currentAmountCents) /
                          Math.max(1, Number(goal.targetAmountCents))) *
                          100,
                      )}%`,
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

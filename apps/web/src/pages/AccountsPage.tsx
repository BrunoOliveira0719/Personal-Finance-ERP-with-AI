import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface Account {
  id: string;
  name: string;
  type: string;
  institution: string | null;
  initialBalanceCents: string;
  currency: string;
}
const money = (value: string | number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(value) / 100,
  );

export function AccountsPage() {
  const client = useQueryClient();
  const [name, setName] = useState('');
  const [type, setType] = useState('CHECKING');
  const [balance, setBalance] = useState('0');
  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: () => apiClient.get<Account[]>('/accounts'),
  });
  const create = useMutation({
    mutationFn: () =>
      apiClient.post('/accounts', {
        name,
        type,
        initialBalanceCents: Math.round(Number(balance.replace(',', '.')) * 100),
      }),
    onSuccess: () => {
      setName('');
      setBalance('0');
      void client.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate();
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Accounts</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the accounts that make up your financial position.
      </p>
      <form
        onSubmit={submit}
        className="mt-8 grid gap-3 rounded-lg border border-line bg-panel p-5 sm:grid-cols-4"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Account name"
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="CHECKING">Checking</option>
          <option value="SAVINGS">Savings</option>
          <option value="CASH">Cash</option>
          <option value="CREDIT_CARD">Credit card</option>
          <option value="INVESTMENT">Investment</option>
        </select>
        <input
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          inputMode="decimal"
          placeholder="Initial balance"
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
        <button
          disabled={create.isPending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          {create.isPending ? 'Saving...' : 'Add account'}
        </button>
      </form>
      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Opening balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.data?.map((account) => (
              <tr key={account.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-ink">{account.name}</td>
                <td className="px-5 py-3 text-muted">{account.type}</td>
                <td className="px-5 py-3 text-ink">{money(account.initialBalanceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {accounts.isLoading && <p className="p-5 text-sm text-muted">Loading accounts...</p>}
        {accounts.data?.length === 0 && <p className="p-5 text-sm text-muted">No accounts yet.</p>}
      </div>
    </div>
  );
}

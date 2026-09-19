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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('CHECKING');
  const [editBalance, setEditBalance] = useState('0');

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

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name: string; type: string; initialBalanceCents: number };
    }) => apiClient.patch(`/accounts/${id}`, payload),
    onSuccess: () => {
      setEditingId(null);
      void client.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/accounts/${id}`),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate();
  };

  const startEdit = (account: Account) => {
    setEditingId(account.id);
    setEditName(account.name);
    setEditType(account.type);
    setEditBalance((Number(account.initialBalanceCents) / 100).toFixed(2));
  };

  const saveEdit = () => {
    if (!editingId) return;
    update.mutate({
      id: editingId,
      payload: {
        name: editName,
        type: editType,
        initialBalanceCents: Math.round(Number(editBalance.replace(',', '.')) * 100),
      },
    });
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
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.data?.map((account) => {
              const isEditing = editingId === account.id;
              return (
                <tr key={account.id} className="border-b border-line last:border-0 align-top">
                  <td className="px-5 py-3 text-ink">
                    {isEditing ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                      />
                    ) : (
                      account.name
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {isEditing ? (
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                      >
                        <option value="CHECKING">Checking</option>
                        <option value="SAVINGS">Savings</option>
                        <option value="CASH">Cash</option>
                        <option value="CREDIT_CARD">Credit card</option>
                        <option value="INVESTMENT">Investment</option>
                      </select>
                    ) : (
                      account.type
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink">
                    {isEditing ? (
                      <input
                        value={editBalance}
                        onChange={(e) => setEditBalance(e.target.value)}
                        inputMode="decimal"
                        className="w-full rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                      />
                    ) : (
                      money(account.initialBalanceCents)
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-md border border-line px-3 py-1.5 text-xs text-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(account)}
                          className="rounded-md border border-line px-3 py-1.5 text-xs text-ink"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void remove.mutate(account.id)}
                          className="rounded-md border border-red-400 px-3 py-1.5 text-xs text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {accounts.isLoading && <p className="p-5 text-sm text-muted">Loading accounts...</p>}
        {accounts.data?.length === 0 && <p className="p-5 text-sm text-muted">No accounts yet.</p>}
      </div>
    </div>
  );
}

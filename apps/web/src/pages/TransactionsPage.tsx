import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface Account {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  accountId: string;
  type: string;
  amountCents: string;
  description: string | null;
  transactionDate: string;
  status: string;
}

const money = (value: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(value) / 100,
  );

export function TransactionsPage() {
  const client = useQueryClient();
  const [accountId, setAccountId] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAccountId, setEditAccountId] = useState('');
  const [editType, setEditType] = useState('EXPENSE');
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState(new Date().toISOString().slice(0, 10));

  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: () => apiClient.get<Account[]>('/accounts'),
  });

  const transactions = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiClient.get<Transaction[]>('/transactions'),
  });

  const create = useMutation({
    mutationFn: () =>
      apiClient.post('/transactions', {
        accountId,
        type,
        amountCents: Math.round(Number(amount.replace(',', '.')) * 100),
        description: description || undefined,
        transactionDate: date,
      }),
    onSuccess: () => {
      setAmount('');
      setDescription('');
      void client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, string | number | null>;
    }) => apiClient.patch(`/transactions/${id}`, payload),
    onSuccess: () => {
      setEditingId(null);
      void client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/transactions/${id}`),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate();
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditAccountId(transaction.accountId);
    setEditType(transaction.type);
    setEditAmount((Number(transaction.amountCents) / 100).toFixed(2));
    setEditDescription(transaction.description ?? '');
    setEditDate(transaction.transactionDate);
  };

  const saveEdit = () => {
    if (!editingId) return;
    update.mutate({
      id: editingId,
      payload: {
        accountId: editAccountId,
        type: editType,
        amountCents: Math.round(Number(editAmount.replace(',', '.')) * 100),
        description: editDescription || null,
        transactionDate: editDate,
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Transactions</h1>
      <p className="mt-1 text-sm text-muted">
        Record income, expenses and transfers in cents-safe amounts.
      </p>
      <form
        onSubmit={submit}
        className="mt-8 grid gap-3 rounded-lg border border-line bg-panel p-5 sm:grid-cols-3"
      >
        <select
          required
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="">Select account</option>
          {accounts.data?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
          <option value="TRANSFER">Transfer</option>
        </select>
        <input
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="Amount"
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
        <input
          required
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
        <button
          disabled={create.isPending || !accounts.data?.length}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add transaction
        </button>
      </form>
      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.data?.map((t) => {
              const isEditing = editingId === t.id;
              return (
                <tr key={t.id} className="border-b border-line last:border-0 align-top">
                  <td className="px-5 py-3 text-muted">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                      />
                    ) : (
                      t.transactionDate
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {isEditing ? (
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                      >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                        <option value="TRANSFER">Transfer</option>
                      </select>
                    ) : (
                      t.type
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink">
                    {isEditing ? (
                      <input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                      />
                    ) : (
                      (t.description ?? '—')
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink">
                    {isEditing ? (
                      <input
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        inputMode="decimal"
                        className="w-full rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                      />
                    ) : (
                      money(t.amountCents)
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
                          onClick={() => startEdit(t)}
                          className="rounded-md border border-line px-3 py-1.5 text-xs text-ink"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void remove.mutate(t.id)}
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
        {transactions.isLoading && (
          <p className="p-5 text-sm text-muted">Loading transactions...</p>
        )}
        {transactions.data?.length === 0 && (
          <p className="p-5 text-sm text-muted">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}

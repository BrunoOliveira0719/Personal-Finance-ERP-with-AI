import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface Account {
  id: string;
  name: string;
  type: string;
}
interface Transaction {
  id: string;
  accountId: string;
  type: string;
  amountCents: string;
  description: string | null;
  transactionDate: string;
  createdAt: string;
  status: string;
}

const money = (value: string | number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(value) / 100,
  );

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(date);
};

export function HistoryPage() {
  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: () => apiClient.get<Account[]>('/accounts'),
  });

  const transactions = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiClient.get<Transaction[]>('/transactions'),
  });

  const rows = [...(transactions.data ?? [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? b.transactionDate).getTime() -
        new Date(a.createdAt ?? a.transactionDate).getTime(),
    )
    .map((item) => ({
      ...item,
      accountName:
        accounts.data?.find((account) => account.id === item.accountId)?.name ?? 'Conta removida',
    }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">General history</h1>
      <p className="mt-1 text-sm text-muted">
        View all operations across the financial structure with date and time.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-line bg-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-5 py-3">Date and time</th>
              <th className="px-5 py-3">Account</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-muted">
                  {formatDateTime(row.createdAt ?? row.transactionDate)}
                </td>
                <td className="px-5 py-3 text-ink">{row.accountName}</td>
                <td className="px-5 py-3 text-muted">{row.type}</td>
                <td className="px-5 py-3 text-ink">{row.description ?? '—'}</td>
                <td className="px-5 py-3 text-ink">{money(row.amountCents)}</td>
                <td className="px-5 py-3 text-muted">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.isLoading && <p className="p-5 text-sm text-muted">Loading history...</p>}
        {!transactions.isLoading && rows.length === 0 && (
          <p className="p-5 text-sm text-muted">No movements recorded yet.</p>
        )}
      </div>
    </div>
  );
}

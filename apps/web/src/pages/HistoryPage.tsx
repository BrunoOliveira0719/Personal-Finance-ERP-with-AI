import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ActivityLogItem } from '@/types/activity';

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
  const activity = useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => apiClient.get<ActivityLogItem[]>('/activity-logs'),
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">General history</h1>
      <p className="mt-1 text-sm text-muted">
        Complete account of every write, edit and delete across the financial system.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-line bg-panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-3 py-3 sm:px-5">Date and time</th>
              <th className="px-3 py-3 sm:px-5">Module</th>
              <th className="px-3 py-3 sm:px-5">Action</th>
              <th className="px-3 py-3 sm:px-5">Name</th>
              <th className="px-3 py-3 sm:px-5">Details</th>
            </tr>
          </thead>
          <tbody>
            {activity.data?.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0 align-top">
                <td className="px-3 py-3 text-muted sm:px-5">{formatDateTime(row.createdAt)}</td>
                <td className="px-3 py-3 text-ink sm:px-5">{row.module}</td>
                <td className="px-3 py-3 sm:px-5">
                  <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                    {row.action}
                  </span>
                </td>
                <td className="px-3 py-3 text-ink sm:px-5">{row.label}</td>
                <td className="px-3 py-3 text-muted sm:px-5">{row.details ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {activity.isLoading && <p className="p-5 text-sm text-muted">Loading history...</p>}
        {!activity.isLoading && activity.data?.length === 0 && (
          <p className="p-5 text-sm text-muted">No activity recorded yet.</p>
        )}
      </div>
    </div>
  );
}

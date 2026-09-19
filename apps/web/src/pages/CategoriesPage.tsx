import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
interface Category {
  id: string;
  name: string;
  type: string;
  isSystem: boolean;
}
interface CostCenter {
  id: string;
  name: string;
}
export function CategoriesPage() {
  const client = useQueryClient();
  const [category, setCategory] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [center, setCenter] = useState('');
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get<Category[]>('/categories'),
  });
  const centers = useQuery({
    queryKey: ['cost-centers'],
    queryFn: () => apiClient.get<CostCenter[]>('/cost-centers'),
  });
  const addCategory = useMutation({
    mutationFn: () => apiClient.post('/categories', { name: category, type }),
    onSuccess: () => {
      setCategory('');
      void client.invalidateQueries({ queryKey: ['categories'] });
    },
  });
  const addCenter = useMutation({
    mutationFn: () => apiClient.post('/cost-centers', { name: center }),
    onSuccess: () => {
      setCenter('');
      void client.invalidateQueries({ queryKey: ['cost-centers'] });
    },
  });
  const submitCategory = (e: FormEvent) => {
    e.preventDefault();
    addCategory.mutate();
  };
  const submitCenter = (e: FormEvent) => {
    e.preventDefault();
    addCenter.mutate();
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Categories & cost centers</h1>
      <p className="mt-1 text-sm text-muted">
        Organize income, expenses and the areas they belong to.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <form
            onSubmit={submitCategory}
            className="flex gap-3 rounded-lg border border-line bg-panel p-5"
          >
            <input
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category name"
              className="min-w-0 flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
            >
              <option>EXPENSE</option>
              <option>INCOME</option>
              <option>INVESTMENT</option>
            </select>
            <button className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white">
              Add
            </button>
          </form>
          <div className="mt-4 rounded-lg border border-line bg-panel p-5">
            <h2 className="font-medium text-ink">Categories</h2>
            <ul className="mt-3 divide-y divide-line">
              {categories.data?.map((item) => (
                <li key={item.id} className="flex justify-between py-3 text-sm">
                  <span className="text-ink">{item.name}</span>
                  <span className="text-muted">
                    {item.type}
                    {item.isSystem ? ' · system' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section>
          <form
            onSubmit={submitCenter}
            className="flex gap-3 rounded-lg border border-line bg-panel p-5"
          >
            <input
              required
              value={center}
              onChange={(e) => setCenter(e.target.value)}
              placeholder="Cost center name"
              className="min-w-0 flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
            />
            <button className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white">
              Add
            </button>
          </form>
          <div className="mt-4 rounded-lg border border-line bg-panel p-5">
            <h2 className="font-medium text-ink">Cost centers</h2>
            <ul className="mt-3 divide-y divide-line">
              {centers.data?.map((item) => (
                <li key={item.id} className="py-3 text-sm text-ink">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

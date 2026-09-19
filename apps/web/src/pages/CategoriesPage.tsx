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
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryDraft, setCategoryDraft] = useState('');
  const [categoryTypeDraft, setCategoryTypeDraft] = useState('EXPENSE');
  const [editingCenterId, setEditingCenterId] = useState<string | null>(null);
  const [centerDraft, setCenterDraft] = useState('');

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

  const updateCategory = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string; type: string } }) =>
      apiClient.patch(`/categories/${id}`, payload),
    onSuccess: () => {
      setEditingCategoryId(null);
      void client.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/categories/${id}`),
    onSuccess: () => {
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

  const updateCenter = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiClient.patch(`/cost-centers/${id}`, { name }),
    onSuccess: () => {
      setEditingCenterId(null);
      void client.invalidateQueries({ queryKey: ['cost-centers'] });
    },
  });

  const deleteCenter = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/cost-centers/${id}`),
    onSuccess: () => {
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

  const startEditCategory = (item: Category) => {
    setEditingCategoryId(item.id);
    setCategoryDraft(item.name);
    setCategoryTypeDraft(item.type);
  };

  const startEditCenter = (item: CostCenter) => {
    setEditingCenterId(item.id);
    setCenterDraft(item.name);
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
                <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    {editingCategoryId === item.id ? (
                      <div className="flex gap-2">
                        <input
                          value={categoryDraft}
                          onChange={(e) => setCategoryDraft(e.target.value)}
                          className="w-full rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                        />
                        <select
                          value={categoryTypeDraft}
                          onChange={(e) => setCategoryTypeDraft(e.target.value)}
                          className="rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                        >
                          <option>EXPENSE</option>
                          <option>INCOME</option>
                          <option>INVESTMENT</option>
                        </select>
                      </div>
                    ) : (
                      <span className="text-ink">{item.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingCategoryId === item.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            updateCategory.mutate({
                              id: item.id,
                              payload: { name: categoryDraft, type: categoryTypeDraft },
                            })
                          }
                          className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategoryId(null)}
                          className="rounded-md border border-line px-2 py-1 text-xs text-muted"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEditCategory(item)}
                          className="rounded-md border border-line px-2 py-1 text-xs text-ink"
                        >
                          Edit
                        </button>
                        {!item.isSystem && (
                          <button
                            type="button"
                            onClick={() => void deleteCategory.mutate(item.id)}
                            className="rounded-md border border-red-400 px-2 py-1 text-xs text-red-500"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {editingCategoryId !== item.id && (
                    <span className="text-muted">
                      {item.type}
                      {item.isSystem ? ' · system' : ''}
                    </span>
                  )}
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
                <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="flex-1">
                    {editingCenterId === item.id ? (
                      <input
                        value={centerDraft}
                        onChange={(e) => setCenterDraft(e.target.value)}
                        className="w-full rounded-md border border-line bg-surface px-2 py-1 text-sm text-ink"
                      />
                    ) : (
                      <span className="text-ink">{item.name}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingCenterId === item.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => updateCenter.mutate({ id: item.id, name: centerDraft })}
                          className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCenterId(null)}
                          className="rounded-md border border-line px-2 py-1 text-xs text-muted"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEditCenter(item)}
                          className="rounded-md border border-line px-2 py-1 text-xs text-ink"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteCenter.mutate(item.id)}
                          className="rounded-md border border-red-400 px-2 py-1 text-xs text-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

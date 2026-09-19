import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface StrategicPlan {
  id: string;
  name: string;
  vision: string | null;
  horizonStart: string;
  horizonEnd: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}

interface StrategicObjective {
  id: string;
  planId: string;
  title: string;
  description: string | null;
  perspective: string;
  targetValueCents: string | null;
  targetDate: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

interface TacticalAction {
  id: string;
  objectiveId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  estimatedAmountCents: string | null;
  status: 'PLANNED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
}

const inputClass = 'rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink';
const money = (value: string | null) =>
  value == null
    ? 'No target'
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        Number(value) / 100,
      );

export function StrategicPlanningPage() {
  const client = useQueryClient();
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedObjectiveId, setSelectedObjectiveId] = useState('');
  const [planName, setPlanName] = useState('');
  const [vision, setVision] = useState('');
  const [horizonStart, setHorizonStart] = useState(new Date().toISOString().slice(0, 10));
  const [horizonEnd, setHorizonEnd] = useState('2030-12-31');
  const [objectiveTitle, setObjectiveTitle] = useState('');
  const [perspective, setPerspective] = useState('FINANCIAL');
  const [objectiveDescription, setObjectiveDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [actionTitle, setActionTitle] = useState('');
  const [actionDueDate, setActionDueDate] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');

  const plans = useQuery({
    queryKey: ['strategic-plans'],
    queryFn: () => apiClient.get<StrategicPlan[]>('/strategic-plans'),
  });
  const objectives = useQuery({
    queryKey: ['strategic-objectives', selectedPlanId],
    queryFn: () => apiClient.get<StrategicObjective[]>(`/strategic-objectives?planId=${selectedPlanId}`),
    enabled: Boolean(selectedPlanId),
  });
  const actions = useQuery({
    queryKey: ['tactical-actions', selectedObjectiveId],
    queryFn: () => apiClient.get<TacticalAction[]>(`/tactical-actions?objectiveId=${selectedObjectiveId}`),
    enabled: Boolean(selectedObjectiveId),
  });

  const invalidatePlanning = () => {
    void client.invalidateQueries({ queryKey: ['strategic-plans'] });
    void client.invalidateQueries({ queryKey: ['strategic-objectives'] });
    void client.invalidateQueries({ queryKey: ['tactical-actions'] });
    void client.invalidateQueries({ queryKey: ['activity-logs'] });
  };

  const createPlan = useMutation({
    mutationFn: () =>
      apiClient.post<StrategicPlan>('/strategic-plans', {
        name: planName,
        vision: vision || null,
        horizonStart,
        horizonEnd,
      }),
    onSuccess: (plan) => {
      setPlanName('');
      setVision('');
      setSelectedPlanId(plan.id);
      invalidatePlanning();
    },
  });

  const createObjective = useMutation({
    mutationFn: () =>
      apiClient.post<StrategicObjective>('/strategic-objectives', {
        planId: selectedPlanId,
        title: objectiveTitle,
        description: objectiveDescription || null,
        perspective,
        targetValueCents: targetValue
          ? Math.round(Number(targetValue.replace(',', '.')) * 100)
          : null,
      }),
    onSuccess: (objective) => {
      setObjectiveTitle('');
      setObjectiveDescription('');
      setTargetValue('');
      setSelectedObjectiveId(objective.id);
      invalidatePlanning();
    },
  });

  const createAction = useMutation({
    mutationFn: () =>
      apiClient.post<TacticalAction>('/tactical-actions', {
        objectiveId: selectedObjectiveId,
        title: actionTitle,
        dueDate: actionDueDate || null,
        estimatedAmountCents: estimatedAmount
          ? Math.round(Number(estimatedAmount.replace(',', '.')) * 100)
          : null,
      }),
    onSuccess: () => {
      setActionTitle('');
      setActionDueDate('');
      setEstimatedAmount('');
      invalidatePlanning();
    },
  });

  const updatePlanStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StrategicPlan['status'] }) =>
      apiClient.patch(`/strategic-plans/${id}`, { status }),
    onSuccess: invalidatePlanning,
  });
  const updateObjectiveStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StrategicObjective['status'] }) =>
      apiClient.patch(`/strategic-objectives/${id}`, { status }),
    onSuccess: invalidatePlanning,
  });
  const updateActionStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TacticalAction['status'] }) =>
      apiClient.patch(`/tactical-actions/${id}`, { status }),
    onSuccess: invalidatePlanning,
  });
  const remove = useMutation({
    mutationFn: ({ resource, id }: { resource: string; id: string }) =>
      apiClient.delete(`/${resource}/${id}`),
    onSuccess: invalidatePlanning,
  });

  const submit = (event: FormEvent, callback: () => void) => {
    event.preventDefault();
    callback();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Strategic planning</h1>
        <p className="mt-1 text-sm text-muted">
          Connect long-term financial direction to measurable objectives and practical next actions.
        </p>
      </div>

      <section className="rounded-lg border border-line bg-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink">Strategic plans</h2>
            <p className="mt-1 text-sm text-muted">Define the horizon and vision for your personal company.</p>
          </div>
          <select value={selectedPlanId} onChange={(event) => setSelectedPlanId(event.target.value)} className={inputClass}>
            <option value="">Select a plan</option>
            {plans.data?.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
          </select>
        </div>
        <form onSubmit={(event) => submit(event, () => createPlan.mutate())} className="mt-4 grid gap-3 md:grid-cols-5">
          <input required value={planName} onChange={(event) => setPlanName(event.target.value)} placeholder="Plan name" className={inputClass} />
          <input value={vision} onChange={(event) => setVision(event.target.value)} placeholder="Vision" className={`${inputClass} md:col-span-2`} />
          <input required type="date" value={horizonStart} onChange={(event) => setHorizonStart(event.target.value)} className={inputClass} />
          <input required type="date" value={horizonEnd} onChange={(event) => setHorizonEnd(event.target.value)} className={inputClass} />
          <button disabled={createPlan.isPending} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white md:col-span-5">Add strategic plan</button>
        </form>
        <div className="mt-4 space-y-2">
          {plans.data?.map((plan) => (
            <div key={plan.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-sm">
              <button type="button" onClick={() => setSelectedPlanId(plan.id)} className="text-left font-medium text-ink">{plan.name}<span className="ml-2 text-xs text-muted">{plan.horizonStart} to {plan.horizonEnd}</span></button>
              <div className="flex items-center gap-2">
                <select value={plan.status} onChange={(event) => updatePlanStatus.mutate({ id: plan.id, status: event.target.value as StrategicPlan['status'] })} className={inputClass}>
                  <option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="ARCHIVED">Archived</option>
                </select>
                <button type="button" onClick={() => remove.mutate({ resource: 'strategic-plans', id: plan.id })} className="rounded-md border border-red-400 px-2 py-1 text-xs text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedPlanId && (
        <section className="rounded-lg border border-line bg-panel p-5">
          <h2 className="font-semibold text-ink">Strategic objectives</h2>
          <form onSubmit={(event) => submit(event, () => createObjective.mutate())} className="mt-4 grid gap-3 md:grid-cols-4">
            <input required value={objectiveTitle} onChange={(event) => setObjectiveTitle(event.target.value)} placeholder="Objective" className={inputClass} />
            <select value={perspective} onChange={(event) => setPerspective(event.target.value)} className={inputClass}>
              <option value="FINANCIAL">Financial</option><option value="SECURITY">Security</option><option value="GROWTH">Growth</option><option value="QUALITY_OF_LIFE">Quality of life</option>
            </select>
            <input value={targetValue} onChange={(event) => setTargetValue(event.target.value)} inputMode="decimal" placeholder="Target amount" className={inputClass} />
            <input value={objectiveDescription} onChange={(event) => setObjectiveDescription(event.target.value)} placeholder="Description" className={inputClass} />
            <button disabled={createObjective.isPending} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white md:col-span-4">Add objective</button>
          </form>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {objectives.data?.map((objective) => (
              <div key={objective.id} className={`rounded-md border p-4 ${selectedObjectiveId === objective.id ? 'border-accent' : 'border-line'}`}>
                <button type="button" onClick={() => setSelectedObjectiveId(objective.id)} className="w-full text-left"><p className="font-medium text-ink">{objective.title}</p><p className="mt-1 text-xs text-muted">{objective.perspective} · {money(objective.targetValueCents)}</p></button>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select value={objective.status} onChange={(event) => updateObjectiveStatus.mutate({ id: objective.id, status: event.target.value as StrategicObjective['status'] })} className={inputClass}><option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select>
                  <button type="button" onClick={() => remove.mutate({ resource: 'strategic-objectives', id: objective.id })} className="rounded-md border border-red-400 px-2 py-1 text-xs text-red-500">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedObjectiveId && (
        <section className="rounded-lg border border-line bg-panel p-5">
          <h2 className="font-semibold text-ink">Tactical actions</h2>
          <form onSubmit={(event) => submit(event, () => createAction.mutate())} className="mt-4 grid gap-3 md:grid-cols-4">
            <input required value={actionTitle} onChange={(event) => setActionTitle(event.target.value)} placeholder="Action" className={inputClass} />
            <input type="date" value={actionDueDate} onChange={(event) => setActionDueDate(event.target.value)} className={inputClass} />
            <input value={estimatedAmount} onChange={(event) => setEstimatedAmount(event.target.value)} inputMode="decimal" placeholder="Estimated amount" className={inputClass} />
            <button disabled={createAction.isPending} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">Add action</button>
          </form>
          <div className="mt-5 space-y-3">
            {actions.data?.map((action) => (
              <div key={action.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                <div><p className="font-medium text-ink">{action.title}</p><p className="text-xs text-muted">{action.dueDate ?? 'No due date'} · {money(action.estimatedAmountCents)}</p></div>
                <div className="flex items-center gap-2"><select value={action.status} onChange={(event) => updateActionStatus.mutate({ id: action.id, status: event.target.value as TacticalAction['status'] })} className={inputClass}><option value="PLANNED">Planned</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option><option value="CANCELLED">Cancelled</option></select><button type="button" onClick={() => remove.mutate({ resource: 'tactical-actions', id: action.id })} className="rounded-md border border-red-400 px-2 py-1 text-xs text-red-500">Delete</button></div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

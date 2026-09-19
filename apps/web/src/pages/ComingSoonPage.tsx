interface ComingSoonPageProps {
  title: string;
  phase: string;
}

export function ComingSoonPage({ title, phase }: ComingSoonPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">This section will be built in {phase}.</p>
    </div>
  );
}

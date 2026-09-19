import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, isLoading, isUnauthenticated, isError, signIn } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-sm text-muted">
        Checking session...
      </div>
    );
  }

  if (isUnauthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-6 text-ink">
        <section className="w-full max-w-md rounded-xl border border-line bg-panel p-8 shadow-2xl shadow-black/20">
          <p className="text-sm font-medium text-muted">Personal Finance ERP</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your finances, in focus.</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in with Google to access your financial workspace.
          </p>
          <button
            type="button"
            onClick={signIn}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
          >
            Continue with Google
          </button>
        </section>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-sm text-negative">
        Unable to verify your session.
      </div>
    );
  }

  return <>{children}</>;
}

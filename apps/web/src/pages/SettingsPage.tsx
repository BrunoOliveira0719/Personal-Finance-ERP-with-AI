import { useAuth } from '@/hooks/use-auth';
export function SettingsPage() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your session and profile.</p>
      <section className="mt-8 max-w-xl rounded-lg border border-line bg-panel p-6">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-14 w-14 rounded-full" />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-full bg-accent/20 text-xl font-semibold text-accent">
              {user?.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-medium text-ink">{user?.name}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-8 rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-white/5"
        >
          Sign out
        </button>
      </section>
    </div>
  );
}

import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/categories', label: 'Categories' },
  { to: '/history', label: 'History' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/investments', label: 'Investments' },
  { to: '/goals', label: 'Goals' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
];

export function AppShell() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-line bg-panel px-4 py-6">
        <div className="mb-8 px-2">
          <p className="text-sm font-medium text-muted">Personal</p>
          <p className="text-lg font-semibold text-ink">Finance ERP</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-accent'
                    : 'text-muted hover:bg-white/5 hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-line pt-5">
          <div className="flex items-center gap-3 px-2">
            {user.avatarUrl ? (
              <img className="h-8 w-8 rounded-full" src={user.avatarUrl} alt="" />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-4 w-full rounded-md px-3 py-2 text-left text-sm text-muted transition hover:bg-white/5 hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { AuthGate } from '@/components/auth/AuthGate';
import { AccountsPage } from '@/pages/AccountsPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { PlanningPage } from '@/pages/PlanningPage';

export default function App() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="transactions"
            element={<TransactionsPage />}
          />
          <Route path="accounts" element={<AccountsPage />} />
          <Route
            path="categories"
            element={<CategoriesPage />}
          />
          <Route path="budgets" element={<PlanningPage mode="budgets" />} />
          <Route
            path="investments"
            element={<ComingSoonPage title="Investments" phase="Phase 8" />}
          />
          <Route
            path="goals"
            element={<PlanningPage mode="goals" />}
          />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<ComingSoonPage title="Settings" phase="Phase 2" />} />
        </Route>
      </Routes>
    </AuthGate>
  );
}

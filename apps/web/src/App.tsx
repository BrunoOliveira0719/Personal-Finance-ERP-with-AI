import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="transactions"
          element={<ComingSoonPage title="Transactions" phase="Phase 3" />}
        />
        <Route path="accounts" element={<ComingSoonPage title="Accounts" phase="Phase 3" />} />
        <Route
          path="categories"
          element={<ComingSoonPage title="Categories" phase="Phase 4" />}
        />
        <Route path="budgets" element={<ComingSoonPage title="Budgets" phase="Phase 7" />} />
        <Route
          path="investments"
          element={<ComingSoonPage title="Investments" phase="Phase 8" />}
        />
        <Route path="goals" element={<ComingSoonPage title="Financial Goals" phase="Phase 7" />} />
        <Route path="reports" element={<ComingSoonPage title="Reports" phase="Phase 5" />} />
        <Route path="settings" element={<ComingSoonPage title="Settings" phase="Phase 2" />} />
      </Route>
    </Routes>
  );
}

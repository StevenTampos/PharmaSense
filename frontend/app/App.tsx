import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import LoginPage from "@/pages/LoginPage";
import { ROUTES } from "@/lib/routes";

/**
 * Declares the application's routes.
 *
 * @returns The route tree.
 */
function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route
        path={ROUTES.adminDashboard}
        element={
          <ProtectedRoute requiredRole="administrator">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}

export default App;

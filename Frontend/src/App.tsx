import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import OverviewDashboard from "./components/dashboard-component/OverviewDashboard";
import CustomerSupportDashboard from "./components/dashboard-component/CustomerSupportDashboard";
import CreditDashboard from "./components/dashboard-component/CreditDashboard";
import { authAPI } from "../service/api/autAPI";
import { UsersManagementDashboard } from "./components/dashboard-component/UsersManagementDashboard";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          if (user.type === 'staff') {
            setUserType(user.type);
            setIsAuthenticated(true);
          } else {
            authAPI.logout();
            setIsAuthenticated(false);
          }
        } catch (error) {
          authAPI.logout();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'staff') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const userData = localStorage.getItem('userData');

  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.type === 'staff') {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      authAPI.logout();
    }
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<OverviewDashboard />} />
            <Route path="customer-support-department" element={<CustomerSupportDashboard />} />
            <Route path="credit-department" element={<CreditDashboard />} />
            <Route path="users-management" element={<UsersManagementDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

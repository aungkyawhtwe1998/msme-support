import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import { useAuth } from "./hooks/useAuth";
import Assistance from "./components/Assistance";
import Home from "./components/Home";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
          <Route
            index
            element={<Home />}
          />
          <Route
            path="Assistance"
            element={<Assistance />}
          />

          <Route
            path="transactions"
            element={<Transactions />}
          />
        </Route>
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;

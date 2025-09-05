import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import UpdateNotePage from "./pages/UpdateNotePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignUpPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ResetPage from "./pages/ResetPage.jsx";
import RequestReset from "./pages/RequestReset.jsx";
import { AuthProvider, AuthContext } from "./context/authContext.jsx";
import { useContext } from "react";

// Normal protected route
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

// Admin protected route
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />; // not logged in
  if (user.role !== "admin")
    return (
      <div className="text-center mt-10 text-red-500 font-bold">
        Access Denied: Admins only
      </div>
    );
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <div className="relative min-h-screen w-full">
        {/* Theme background */}
        <div
          className="absolute inset-0 -z-10 h-full w-full"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000 60%, #00FF9D40 100%)",
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<RequestReset />} />
          <Route path="/reset-password" element={<ResetPage />} />

          {/* Protected user routes */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update/:id"
            element={
              <ProtectedRoute>
                <UpdateNotePage />
              </ProtectedRoute>
            }
          />

          {/* Protected admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Profile from './pages/Profile';
import BreathingExercises from './pages/BreathingExercises';
import CopingStrategies from './pages/CopingStrategies';
import Progress from './pages/Progress';
import Onboarding from './pages/Onboarding';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Layout wrapper for authenticated pages
const AuthLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// Layout wrapper for public pages
const PublicLayout = () => {
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route index element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Onboarding Route - No Navbar */}
            <Route
              path="onboarding"
              element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              }
            />

            {/* Protected Routes with Navbar */}
            <Route element={<AuthLayout />}>
              <Route
                path="dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="breathing"
                element={
                  <PrivateRoute>
                    <BreathingExercises />
                  </PrivateRoute>
                }
              />
              <Route
                path="coping"
                element={
                  <PrivateRoute>
                    <CopingStrategies />
                  </PrivateRoute>
                }
              />
              <Route
                path="progress"
                element={
                  <PrivateRoute>
                    <Progress />
                  </PrivateRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Route>

            {/* Redirect /app/dashboard to /dashboard */}
            <Route path="app/*" element={<Navigate to="/dashboard" replace />} />

            {/* Catch all route - redirect to dashboard if authenticated, otherwise to landing */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Navigate to="/dashboard" replace />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

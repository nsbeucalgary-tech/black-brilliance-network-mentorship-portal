import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/Landing";
import ExamplePage from "./_db_controller/example/page";
import SettingsPage from "./pages/SettingsPage/Settings";
import DashboardPage from "./pages/DashboardPage/Dashboard";
import CalendarPage from "./pages/CalendarPage/Calendar";
import MatchingPage from "./pages/MatchingPage/Matching";
import UserProfilePage from "./pages/UserProfilePage/UserProfile";
import MentorProfilePage from "./pages/MentorProfilePage/MentorProfile";
import LoggedInLayout from "./components/LoggedInLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import OnboardingPage from "./components/Onboarding";
import { Toaster } from "sonner";

function App() {
  return (
    
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/signup" element={<LandingPage />} />
          <Route path="/example" element={<ExamplePage />} />
          {/* Onboarding — protected but outside the sidebar layout */}
          <Route path="/onboarding" element={<ProtectedRoute> <OnboardingPage /> </ProtectedRoute>} />
          {/* Protected routes with sidebar */}
          <Route element={<ProtectedRoute> <LoggedInLayout /> </ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/matching" element={<MatchingPage />} />
            <Route path="/user-profile" element={<UserProfilePage />} />
            <Route path="/mentor-profile/:uid" element={<MentorProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

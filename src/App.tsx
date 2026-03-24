import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/Landing";
import HomePage from "./pages/HomePage/Home";
import CalendarPage from "./pages/CalendarPage/Calendar";
import MatchingPage from "./pages/MatchingPage/Matching";
import NewsletterPage from "./pages/NewsletterPage/Newsletter";
import DashboardPage from "./pages/DashboardPage/Dashboard";
import ExamplePage from "./_db_controller/example/page";
import LoginPage from "./pages/LoginPage/Login";
import SignupPage from "./pages/SignupPage/Signup";
import MentorMatchingTest from "./pages/TestPage/MentorMatchingTest";

import UserProfilePage from "./pages/UserProfilePage/UserProfile";
import MentorProfilePage from "./pages/MentorProfilePage/MentorProfile";

import LoggedInLayout from "./components/LoggedInLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { PublicOnlyRoute } from "./components/PublicRoute";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />
          <Route path="/example" element={<ExamplePage />} />
          <Route path="/test-matching" element={<MentorMatchingTest />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <LoggedInLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/matching" element={<MatchingPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/user-profile" element={<UserProfilePage />} />
            <Route path="/mentor-profile" element={<MentorProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

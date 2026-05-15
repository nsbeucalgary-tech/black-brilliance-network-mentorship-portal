import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/Landing";
import ExamplePage from "./pages/ExamplePage/Example";
import LoginPage from "./pages/LoginPage/Login";
import SignupPage from "./pages/SignupPage/Signup";
import SettingsPage from "./pages/SettingsPage/Settings";
import DashboardPage from "./pages/DashboardPage/Dashboard";
import HomePage from "./pages/HomePage/Home";
import CalendarPage from "./pages/CalendarPage/Calendar";
import MatchingPage from "./pages/MatchingPage/Matching";
import NewsletterPage from "./pages/NewsletterPage/Newsletter";
import UserProfilePage from "./pages/UserProfilePage/UserProfile";
import MentorProfilePage from "./pages/MentorProfilePage/MentorProfile";

import LoggedInLayout from "./components/LoggedInLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { PublicOnlyRoute } from "./components/PublicRoute";
import { AuthProvider } from "./auth/AuthContext";
import OnboardingPage from "./components/Onboarding";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/signup" element={<LandingPage />} />

                    <Route path="/example" element={<ExamplePage />} />

                    {/* Onboarding — protected but outside the sidebar layout */}
                    <Route
                        path="/onboarding"
                        element={
                            <ProtectedRoute>
                                <OnboardingPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected routes with sidebar */}
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
                        <Route
                            path="/newsletter"
                            element={<NewsletterPage />}
                        />
                        <Route
                            path="/user-profile"
                            element={<UserProfilePage />}
                        />
                        <Route
                            path="/mentor-profile"
                            element={<MentorProfilePage />}
                        />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

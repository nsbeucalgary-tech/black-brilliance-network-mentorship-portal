import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/Landing";
import HomePage from "./pages/HomePage/Home";
import CalendarPage from "./pages/CalendarPage/Calendar";
import MatchingPage from "./pages/MatchingPage/Matching";
import NewsletterPage from "./pages/NewsletterPage/Newsletter";
import LoggedInLayout from "./components/LoggedInLayout";
import DashboardPage from "./pages/DashboardPage/Dashboard";
import ExamplePage from "./_db_controller/example/page";
import LoginPage from "./pages/LoginPage/Login";
import SignupPage from "./pages/SignupPage/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { PublicOnlyRoute } from "./components/PublicRoute";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
          <Route path="/example" element={<ExamplePage />} />
          <Route element={<ProtectedRoute><LoggedInLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/matching" element={<MatchingPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

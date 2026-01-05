import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/Landing";
import HomePage from "./pages/HomePage/Home";
import CalendarPage from "./pages/CalendarPage/Calendar";
import MatchingPage from "./pages/MatchingPage/Matching";
import NewsletterPage from "./pages/NewsletterPage/Newsletter";
import LoggedInLayout from "./components/LoggedInLayout";
import DashboardPage from "./pages/DashboardPage/Dashboard";
import ExamplePage from "./_db_controller/example/page";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/example" element={<ExamplePage />} />
                <Route element={<LoggedInLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/matching" element={<MatchingPage />} />
                    <Route path="/newsletter" element={<NewsletterPage />} />
                </Route>            
            </Routes>
        </Router>
    );
}

export default App;

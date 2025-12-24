import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/Landing";
import UserProfilePage from "./pages/UserProfilePage/UserProfile";
import MentorProfilePage from "./pages/MentorProfilePage/MentorProfile";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/user-profile" element={<UserProfilePage />} />
                <Route path="/mentor-profile" element={<MentorProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;

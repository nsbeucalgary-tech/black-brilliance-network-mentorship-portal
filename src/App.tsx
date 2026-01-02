import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamplePage from "./_db_controller/example/page";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ExamplePage />} />
            </Routes>
        </Router>
    );
}

export default App;

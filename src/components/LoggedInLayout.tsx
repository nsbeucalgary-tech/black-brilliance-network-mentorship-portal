import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import TopBar from "./TopBar";

export default function LoggedInLayout() {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Navbar />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <TopBar />
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import TopBar from "./TopBar";

export default function LoggedInLayout() {
    return (
        <div className="flex flex-row w-full">
            <Navbar />
            <div className="flex flex-col">
                <TopBar />
                <Outlet />
            </div>
        </div>
    );
}

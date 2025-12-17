import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function LoggedInLayout() {
    return (
        <>
            <div className="flex flex-row w-full">
                <Navbar />
                <Outlet />
            </div>
        </>
    )
}
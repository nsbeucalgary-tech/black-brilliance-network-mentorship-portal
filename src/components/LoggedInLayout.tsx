import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function LoggedInLayout() {
  const location = useLocation();

  // Any route that starts with /matching will be treated as the "fullscreen" page
  // This hides the Navbar and lets the Outlet take full width, so the matching page matches the figma design
  const isMatchingPage = location.pathname.startsWith("/matching");

  return (
    <div className="flex w-full">
      {/* Hide the Navbar on Matching so the page can be fullscreen */}
      {!isMatchingPage && <Navbar />}

      {/* If Navbar is hidden, let Outlet take full width. Otherwise, it sits beside Navbar. */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

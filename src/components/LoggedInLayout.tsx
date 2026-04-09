import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function LoggedInLayout() {
  return (
      <div className="flex h-screen w-full overflow-hidden">
          <Navbar />

          <div className="flex-1 min-w-0 overflow-y-auto">
              <Outlet />
          </div>
      </div>
  );
}

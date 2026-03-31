import { Outlet } from "react-router-dom";

export default function LoggedInLayout() {
  return (
    <div className="flex w-full">

          {/* If Navbar is hidden, let Outlet take full width. Otherwise, it sits beside Navbar. */}
          <div className="flex-1 min-w-0 overflow-y-auto">
              <Outlet />
          </div>
      </div>
  );
}

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import TopBar from "./TopBar";
import ConversationButton from "./Conversation/ConversationButton";
import { useAuth } from "../auth/useAuthContext";
import { toast } from "sonner";

const EMAIL_TOAST_ID = "email-verification-toast";

export default function LoggedInLayout() {
    const location = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        if (!user.emailVerified) {
            toast.warning(
                <div className="flex items-center gap-4">
                    <span className="text-base font-semibold">
                        Email not verified
                    </span>

                    <button
                        onClick={() => navigate("/settings")}
                        className="text-base text-white bg-BBNDarkGreen px-2 py-1 rounded-md hover:bg-BBNDarkGreen/80 transition-colors duration-300"
                    >
                        Verify Email
                    </button>
                </div>,
                {
                    id: EMAIL_TOAST_ID,
                    duration: Infinity,
                }
            );
        } else {
            toast.dismiss(EMAIL_TOAST_ID);
        }
    }, [user?.emailVerified, navigate]);

    // Any route that starts with /matching will be treated as the "fullscreen" page
    // This hides the Navbar and lets the Outlet take full width, so the matching page matches the figma design
    const isMatchingPage = location.pathname.startsWith("/matching");

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Hide the Navbar on Matching so the page can be fullscreen */}
            {!isMatchingPage && <Navbar />}

            {/* If Navbar is hidden, let Outlet take full width. Otherwise, it sits beside Navbar. */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <TopBar />
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <Outlet />
                    <ConversationButton />
                </div>
            </div>
        </div>
    );
}

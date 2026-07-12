import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import TopBar from "./TopBar";
import { useAuth } from "../auth/useAuthContext";
import ConversationButton from "./Conversation/ConversationButton";
import { toast } from "sonner";

const EMAIL_TOAST_ID = "email-verification-toast";

export default function LoggedInLayout() {
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

    return (
        <div className="flex min-h-screen w-full bg-white">
            <Navbar />
            <div className="flex min-w-0 flex-1 flex-col">
                <TopBar />
                <div className="flex-1">
                    <ConversationButton />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

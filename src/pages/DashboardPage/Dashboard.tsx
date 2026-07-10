import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuthContext";

export default function DashboardPage() {
    const { dbUser } = useAuth();
    const navigate = useNavigate();

    // Profile is considered incomplete if any of these key fields are missing
    const isProfileIncomplete =
        dbUser && (!dbUser.bio || !dbUser.title || !dbUser.location);

    return (
        <div className="min-h-full bg-white">
            {/* Incomplete profile reminder banner */}
            {isProfileIncomplete && (
                <div className="flex items-center justify-between gap-4 bg-[#e8f3dd] border-b border-[#c5dbb0] px-6 py-3">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">✏️</span>
                        <p className="text-sm font-medium text-[#2d3a1f]">
                            Your profile is incomplete — add your bio, title,
                            and location so mentors and mentees can find you.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => navigate("/onboarding")}
                            className="rounded-full bg-[#2d3a1f] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#3d4a2b] transition-colors"
                        >
                            Complete profile
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/user-profile")}
                            className="text-xs font-medium text-[#4a5c35] hover:underline"
                        >
                            View profile
                        </button>
                    </div>
                </div>
            )}

            {/* Dashboard content */}
            <div className="px-8 py-10">
                <h1 className="text-2xl font-bold text-[#2d3a1f]">
                    Welcome back
                    {dbUser?.first_name ? `, ${dbUser.first_name}` : ""}! 👋
                </h1>
                <p className="mt-1 text-sm text-[#7a9b5c]">
                    {dbUser?.role
                        ? `You're signed in as a ${dbUser.role}.`
                        : "Getting your profile ready..."}
                </p>
            </div>
        </div>
    );
}

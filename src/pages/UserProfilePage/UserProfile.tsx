import { useNavigate } from "react-router-dom";
import { db } from "../../_db_controller/init";
import { useAuth } from "../../auth/useAuthContext";
import Profile from "../../components/Profile/Profile";
import { UserController } from "../../services/UserController";
import type { UpdateUserPayload } from "../../types/User";

const userController = new UserController(db);

export default function UserProfilePage() {
    const { dbUser, refreshDbUser } = useAuth();
    const navigate = useNavigate();

    if (!dbUser) {
        return (
            <div className="flex min-h-full items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4 text-[#7a9b5c]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4e5c3] border-t-[#2d3a1f]" />
                    <p className="text-sm font-medium">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    async function handleSave(payload: UpdateUserPayload) {
        if (!dbUser) return;
        await userController.updateUser(dbUser.uid, payload);
        await refreshDbUser();
    }

    return (
        <Profile
            profile={dbUser}
            mode="self"
            onSave={handleSave}
            onCompleteProfile={() => navigate("/onboarding")}
        />
    );
}

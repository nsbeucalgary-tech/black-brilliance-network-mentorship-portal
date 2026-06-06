import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../../_db_controller/init";
import Profile from "../../components/Profile/Profile";
import { UserController } from "../../services/UserController";
import type { User } from "../../types/User";
import { UserRole } from "../../types/User";

const userController = new UserController(db);

type LocationState = {
    preview?: {
        id: string;
        name: string;
        title?: string;
        company?: string;
    };
};

function previewToUser(preview: NonNullable<LocationState["preview"]>): User {
    const [firstName = "Mentor", ...rest] = preview.name.trim().split(/\s+/);
    const lastName = rest.join(" ");
    return {
        uid: preview.id,
        first_name: firstName,
        last_name: lastName,
        email: `${preview.id}@placeholder.local`,
        role: UserRole.MENTOR,
        created_at: new Date(),
        title: preview.title,
        bio: "This profile preview is from matching cards. Full profile details will appear when this user has a saved profile in the database.",
        experiences: preview.company
            ? [{ company: preview.company, role: preview.title ?? "Mentor", period: "Current" }]
            : [],
    };
}

export default function MentorProfilePage() {
    const { uid } = useParams<{ uid?: string }>();
    const location = useLocation();
    const state = location.state as LocationState | null;

    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(Boolean(uid));

    useEffect(() => {
        let mounted = true;

        async function loadProfile() {
            if (!uid) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const found = await userController.getUserById(uid);
                if (!mounted) return;
                setProfile(found);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadProfile();
        return () => {
            mounted = false;
        };
    }, [uid]);

    const fallbackFromState = useMemo(
        () => (state?.preview ? previewToUser(state.preview) : null),
        [state],
    );

    if (loading) {
        return (
            <div className="flex min-h-full items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4 text-[#7a9b5c]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4e5c3] border-t-[#2d3a1f]" />
                    <p className="text-sm font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    const displayProfile = profile ?? fallbackFromState;

    if (!displayProfile) {
        return (
            <div className="flex min-h-full items-center justify-center bg-white px-4">
                <p className="text-center text-sm text-[#4b5145]">
                    We could not find this profile yet.
                </p>
            </div>
        );
    }

    return <Profile profile={displayProfile} mode="mentor" />;
}

import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuthContext";
import { getInitials } from "../utils";
import { AiOutlineMail } from "react-icons/ai";
import { PiBellLight } from "react-icons/pi";


function nameForInitials(
    dbFullName: string | undefined,
    displayName: string | null | undefined,
    email: string | null | undefined,
): string {
    const fromDb = dbFullName?.trim();
    if (fromDb) return fromDb;
    const fromAuth = displayName?.trim();
    if (fromAuth) return fromAuth;
    const local = email?.split("@")[0]?.trim();
    if (local) return local;
    return "User";
}

const circleBtn =
    "inline-flex h-15 w-15 shrink-0 items-center justify-center rounded-full border border-BBNDarkGreen/25 bg-white/40 text-2xl font-semibold text-BBNDarkGreen hover:outline hover:outline-2 hover:outline-black transition-all ease-in-out duration-300";

export default function TopBar() {
    const { user, dbUser } = useAuth();
    const name = nameForInitials(dbUser?.full_name, user?.displayName, user?.email);
    const initials = getInitials(name);

    return (
        <header
            className="flex w-full shrink-0 items-center bg-transparent px-4 py-3"
            role="banner"
        >
            <div className="ml-auto flex items-center gap-3">
                <Link
                    to="/dashboard" /* TODO: Chnage to proper link when implemented */
                    aria-label="Notifications"
                    title="Your Notifications"
                >
                    <PiBellLight size={45} aria-hidden />
                </Link>
                <Link
                    to="/dashboard" /* TODO: Chnage to proper link when implemented */
                    aria-label="Messages"
                    title="Your Messages"
                >
                    <AiOutlineMail size={45} aria-hidden />
                </Link>
                <Link
                    to="/user-profile"
                    className={`${circleBtn} border-BBNDarkGreen bg-BBNDarkGreen text-black`}
                    aria-label="Your profile"
                    title={name}
                >
                    {initials}
                </Link>

            </div>
        </header>
    );
}

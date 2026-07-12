import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/useAuthContext";
import { getInitials } from "../utils";
import { Mail, BellRing, Play, UserRound, CircleQuestionMark } from "lucide-react";

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
    "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-BBNDarkGreen/50 text-xl font-semibold text-BBNDarkGreen group-hover:outline group-hover:outline-2 group-hover:outline-black transition-hover ease-in-out duration-500";

export default function TopBar() {
    const { user, dbUser } = useAuth();
    const fullName = [dbUser?.first_name, dbUser?.last_name]
        .filter(Boolean)
        .join(" ");

    const name = nameForInitials(fullName, user?.displayName, user?.email);
    const initials = getInitials(name);
    const email = user?.email ?? "";

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    return (
        <header
            className="flex w-full sticky top-0 z-50 shrink-0 items-center bg-white border-b border-gray-300 px-4 py-3"
            role="banner"
        >
            <div className="mt-auto ml-auto flex items-center gap-3">
                <Link
                    to="/dashboard" /* TODO: Chnage to proper link when implemented */
                    aria-label="Notifications"
                    title="Your Notifications"
                >
                    <BellRing size={35} aria-hidden />
                </Link>
                <Link
                    to="/dashboard" /* TODO: Chnage to proper link when implemented */
                    aria-label="Messages"
                    title="Your Messages"
                >
                    <Mail size={35} aria-hidden />
                </Link>
                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Your profile"
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                        title={name}
                        className="group flex items-center text-black cursor-pointer"
                    >
                        <span className={circleBtn}>{initials}</span>
                        <Play
                            className={`ml-2 group-hover:text-BBNDarkGreen group-hover:scale-125 transition-all ease-in-out duration-300 ${menuOpen ? "rotate-270" : "rotate-90"}`}
                            size={15}
                            aria-hidden
                        />
                    </button>

                    {menuOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 top-full mt-2 w-48 sm:w-64 rounded-lg border border-gray-200 bg-white shadow-lg z-50"
                        >
                            <div className="border-b border-gray-200 px-4 py-3">
                                <p className="font-semibold text-black truncate">{name}</p>
                                {email && (
                                    <p className="text-sm text-gray-600 truncate">{email}</p>
                                )}
                            </div>
                            <div className="py-1">
                                <Link
                                    to="/user-profile"
                                    role="menuitem"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-BBNDarkGreen/20"
                                >
                                    <UserRound size={18} aria-hidden />
                                    <span>Your Profile</span>
                                </Link>
                                <Link
                                    to="/help"
                                    role="menuitem"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-BBNDarkGreen/20"
                                >
                                    <CircleQuestionMark size={18} aria-hidden />
                                    <span>Help</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
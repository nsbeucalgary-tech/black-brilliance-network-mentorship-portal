import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    logInWithEmailAndPassword,
    signInWithProvider,
} from "../../auth/AuthFunctions";
import { googleProvider, db } from "../../_db_controller/init";
import { UserController } from "../../services/UserController";
import { UserRole } from "../../types/User";
import type { AuthProvider } from "firebase/auth";
import { PublicOnlyRoute } from "../../components/PublicRoute";
import GoogleLogo from "../../components/GoogleLogo";
import PasswordInput from "../../components/PasswordInput";
const userController = new UserController(db);

/**
 * After a successful sign-in we fetch the Firestore profile and decide where
 * to send the user:
 *   - role === "user"  → onboarding was never completed → /onboarding
 *   - role is set      → profile is complete            → /dashboard
 * A small toast banner also appears on the dashboard if optional fields
 * (bio, title, etc.) are still empty, handled in Dashboard separately.
 */
async function getPostLoginRoute(uid: string): Promise<string> {
    try {
        const profile = await userController.getUserById(uid);
        if (!profile || profile.role === UserRole.USER) {
            return "/onboarding";
        }
        return "/dashboard";
    } catch {
        return "/dashboard";
    }
}

type AuthProps = {
    onBack?: () => void;
};

function LoginComponent({ onBack }: AuthProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInError, setSignInError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!email) return alert("Please enter an email.");
        if (!password) return alert("Please enter a password.");

        setLoading(true);
        try {
            const error = await logInWithEmailAndPassword(
                email,
                password,
                remember,
            );

            if (error) {
                setSignInError(error);
            } else {
                setSignInError("");
                // Import auth to get the current user uid after login
                const { auth } = await import("../../_db_controller/init");
                const uid = auth.currentUser?.uid;
                const route = uid ? await getPostLoginRoute(uid) : "/dashboard";
                navigate(route);
            }
        } catch (err) {
            console.error(err);
            setSignInError("Error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleProviderSignIn = async (
        provider: AuthProvider,
        providerName: string,
    ) => {
        setLoading(true);
        try {
            const error = await signInWithProvider(
                provider,
                providerName,
                remember,
            );
            if (error) {
                setSignInError(error);
            } else {
                setSignInError("");
                const { auth } = await import("../../_db_controller/init");
                const uid = auth.currentUser?.uid;
                const route = uid ? await getPostLoginRoute(uid) : "/dashboard";
                navigate(route);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="sm:p-36 lg:p-12 xl:p-24 text-BBNDarkGreen">
            <div className="flex items-center justify-between pb-4">
                <h1 className="text-3xl font-semibold text-BBNDarkGreen">Login</h1>
                {onBack && (
                    <button className="
                    flex items-center justify-center
                    h-10 w-10 sm:h-11 sm:w-11
                    rounded-full
                    bg-BBNLightGreen shadow-sm
                    text-gray-700 text-xl
                    transition-all duration-200
                    hover:bg-[#c5dbb0] hover:-translate-x-1
                    active:scale-95 cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-[#c5dbb0]"
                        onClick={onBack} aria-label="Go back">
                        ←
                    </button>
                )}
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
                <button
                    aria-label="Sign in with Google"
                    className="flex cursor-pointer w-fit rounded-full bg-BBNLightGreen hover:bg-[#c5dbb0] p-5"
                    onClick={() => handleProviderSignIn(googleProvider, "Google")}
                    disabled={loading}
                >
                    <GoogleLogo />
                </button>
            </div>
            <div className="flex items-center justify-center gap-4 text-center text-gray-400 my-2">
                <div className="w-full h-[2px] bg-gray-400 mx-auto"></div>
                <p className="whitespace-nowrap">or via email</p>
                <div className="w-full h-[2px] bg-gray-400 mx-auto"></div>
            </div>
            {signInError && (
                <div className="text-red-500 mb-2">{signInError}</div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label htmlFor="email" className="text-sm font-semibold">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" tyrondavis@gmail.com"
                    className="w-full h-11 rounded-2xl border-0 px-4 bg-BBNLightGreen placeholder:text-gray-400"
                />

                <PasswordInput labelText="Password" placeholder="Enter your password" value={password} setValue={setPassword} />

                <div className="flex items-center justify-between mt-2 text-BBNDarkGreen">
                    <label htmlFor="remember" className="flex items-center gap-2 text-base cursor-pointer">
                        <input
                            id="remember"
                            type="checkbox"
                            className="w-4 h-4"
                            checked={remember}
                            onChange={(e) =>
                                setRemember(e.target.checked)
                            }
                        />
                        Remember me
                    </label>
                    <button
                        type="submit"
                        className="submit-button cursor-pointer disabled:opacity-50 bg-BBNDarkGreen hover:bg-BBNDarkAvocadoGreen text-white rounded-full px-8 py-2"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
            </form>
        </section>
    );



}

export default function Login({ onBack }: AuthProps) {
    return (
        <PublicOnlyRoute>
            <LoginComponent onBack={onBack} />
        </PublicOnlyRoute>
    );
}
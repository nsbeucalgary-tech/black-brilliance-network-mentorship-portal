import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithProvider,
    signUpWithEmailAndPassword,
    validateUserPassword,
} from "../../auth/AuthFunctions";
import type { AuthProvider } from "firebase/auth";
import { googleProvider } from "../../_db_controller/init";

export default function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [signUpError, setSignUpError] = useState<string>("");
    const [passwordValidationError, setPasswordValidationError] = useState<
        string[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!firstName) return alert("Please enter your first name.");
        if (!lastName) return alert("Please enter your last name.");
        if (!email) return alert("Please enter an email.");
        if (!password) return alert("Please enter a password.");
        if (password !== confirm) return alert("Passwords do not match.");

        setLoading(true);

        try {
            const errors = await validateUserPassword(password);
            if (errors.length > 0) {
                setPasswordValidationError(errors);
                return;
            }

            setPasswordValidationError([]);

            const error = await signUpWithEmailAndPassword(
                firstName,
                lastName,
                email,
                password,
                remember,
            );

            if (error) {
                setSignUpError(error);
            } else {
                setSignUpError("");
                navigate("/onboarding");
            }
        } catch (err) {
            console.error(err);
            setSignUpError("Error occurred. Please try again.");
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
                setSignUpError(error);
            } else {
                setSignUpError("");
                navigate("/dashboard");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing">
            {/* NAVBAR */}
            <header className="nav">
                <div className="nav-left">
                    <div className="logo-mark">
                        <div className="logo-dot" />
                        <div className="logo-dot" />
                    </div>
                    <div className="logo-text">
                        <span className="logo-text-black">Black </span>
                        <span className="logo-text-green">Brilliance</span>
                    </div>
                </div>

                <nav className="nav-links">
                    <a href="#about" className="active">
                        About
                    </a>
                    <a href="#gallery">Gallery</a>
                    <a href="#blog">Blog</a>
                    <button
                        className="register-button"
                        onClick={() => navigate("/signup")}
                    >
                        Register
                    </button>
                </nav>
            </header>

            {/* SIGNUP FORM SECTION */}
            <section className="auth-section">
                <div className="auth-container">
                    <h1 className="text-[28px] font-semibold mb-2">Sign Up</h1>

                    <div className="flex items-center gap-3 mb-3">
                        <button
                            aria-label="Sign up with Google"
                            className="flex-1 h-14 rounded-full flex items-center justify-center gap-3 cursor-pointer bg-[#e9f7ee]"
                            onClick={() =>
                                handleProviderSignIn(googleProvider, "Google")
                            }
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 533.5 544.3"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                            >
                                <path
                                    fill="#4285f4"
                                    d="M533.5 278.4c0-18.6-1.5-36.5-4.3-53.9H272v102.3h147.3c-6.3 34-25.1 62.8-53.7 82.1v68.2h86.8c50.6-46.6 79.1-115.4 79.1-198.7z"
                                />
                                <path
                                    fill="#34a853"
                                    d="M272 544.3c72.6 0 133.5-24 178-65.4l-86.8-68.2c-24.2 16.3-55 25.9-91.2 25.9-70.1 0-129.5-47.3-150.7-111.1H33.9v69.8C78.5 483.9 168.6 544.3 272 544.3z"
                                />
                                <path
                                    fill="#fbbc04"
                                    d="M121.3 325.5c-10.6-31.6-10.6-65.6 0-97.2V158.5H33.9c-36.6 72.9-36.6 159.9 0 232.8l87.4-65.8z"
                                />
                                <path
                                    fill="#ea4335"
                                    d="M272 107.7c38.6-.6 76.3 13.8 104.5 39.8l78.1-78.1C404.9 24.9 344 0 272 0 168.6 0 78.5 60.4 33.9 158.5l87.4 69.8C142.5 155 201.9 107.7 272 107.7z"
                                />
                            </svg>
                            <span className="font-semibold">Google</span>
                        </button>
                    </div>

                    <div className="text-center text-[#7b8b78] my-2">
                        or via email
                    </div>

                    {signUpError && (
                        <div className="text-red-500">{signUpError}</div>
                    )}

                    {passwordValidationError.length > 0 && (
                        <div className="text-red-500">
                            <ul>
                                {passwordValidationError.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="firstName"
                                    className="text-sm font-medium text-[#4b4b4b]"
                                >
                                    First name
                                </label>

                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    placeholder="Jane"
                                    className="h-11 rounded-xl border border-transparent bg-[#eaf7e7] px-4 text-sm text-[#1f211f] outline-none transition-all placeholder:text-[#8a8a8a] focus:border-[#7a9b5c] focus:bg-white focus:ring-2 focus:ring-[#cfe7c8]"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="lastName"
                                    className="text-sm font-medium text-[#4b4b4b]"
                                >
                                    Last name
                                </label>

                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    placeholder="Doe"
                                    className="h-11 rounded-xl border border-transparent bg-[#eaf7e7] px-4 text-sm text-[#1f211f] outline-none transition-all placeholder:text-[#8a8a8a] focus:border-[#7a9b5c] focus:bg-white focus:ring-2 focus:ring-[#cfe7c8]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-[#4b4b4b]"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="janedoe@gmail.com"
                                className="h-11 rounded-xl border border-transparent bg-[#eaf7e7] px-4 text-sm text-[#1f211f] outline-none transition-all placeholder:text-[#8a8a8a] focus:border-[#7a9b5c] focus:bg-white focus:ring-2 focus:ring-[#cfe7c8]"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-[#4b4b4b]"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className="h-11 rounded-xl border border-transparent bg-[#eaf7e7] px-4 text-sm text-[#1f211f] outline-none transition-all placeholder:text-[#8a8a8a] focus:border-[#7a9b5c] focus:bg-white focus:ring-2 focus:ring-[#cfe7c8]"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-[#4b4b4b]"
                            >
                                Confirm password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Confirm password"
                                className="h-11 rounded-xl border border-transparent bg-[#eaf7e7] px-4 text-sm text-[#1f211f] outline-none transition-all placeholder:text-[#8a8a8a] focus:border-[#7a9b5c] focus:bg-white focus:ring-2 focus:ring-[#cfe7c8]"
                            />
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-4">
                            <label className="flex items-center gap-2 text-sm text-[#4b4b4b] cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) =>
                                        setRemember(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-[#b7d3ae] text-[#2d3a1f] focus:ring-[#7a9b5c]"
                                />
                                Remember me
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-[#2d3a1f] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3d4a2b] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Account"}
                            </button>
                        </div>
                    </form>
                </div>
                <footer className="mt-8 text-[#889a87] text-sm">
                    © Copyright Black Brilliance Network 2025
                </footer>
            </section>
        </div>
    );
}

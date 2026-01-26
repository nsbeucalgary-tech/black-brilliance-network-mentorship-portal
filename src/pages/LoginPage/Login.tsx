import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LandingPage/Landing.css";
import { logInWithEmailAndPassword, signInWithProvider } from "../../auth/AuthFunctions";
import { googleProvider } from "../../_db_controller/init";
import type { AuthProvider } from "firebase/auth";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [signInError, setSignInError] = useState<string>("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // simple client-side validation
    if (!email) return alert("Please enter an email.");
    if (!password) return alert("Please enter a password.");

    setLoading(true);

    try {
      const error = await logInWithEmailAndPassword(email, password);
      if (error) {
        setSignInError(error);
      } else {
        setSignInError("");
        navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
      setSignInError("Error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (
    provider: AuthProvider,
    providerName: string
  ) => {
    setLoading(true);
    try {
      const error = await signInWithProvider(provider, providerName);
      if (error) {
        setSignInError(error);
      } else {
        setSignInError("");
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

      {/* LOGIN FORM SECTION */}
      <section className="auth-section">
        <div className="auth-container">
          <h1 className="text-[28px] font-semibold mb-2">Login</h1>

          <div className="flex items-center gap-3 mb-3">
            <button
              aria-label="Sign in with Google"
              className="flex-1 h-14 rounded-full flex items-center justify-center gap-3 cursor-pointer bg-[#e9f7ee]"
              onClick={() => handleProviderSignIn(googleProvider, "Google")}
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

            <button
              aria-label="Sign in with Microsoft"
              className="flex-1 h-14 rounded-full flex items-center justify-center gap-3 cursor-pointer bg-[#eaf7ee]"
              onClick={() => alert("Microsoft OAuth placeholder")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path fill="#f35325" d="M3 3h8v8H3z" />
                <path fill="#81bc06" d="M13 3h8v8h-8z" />
                <path fill="#05a6f0" d="M3 13h8v8H3z" />
                <path fill="#ffba08" d="M13 13h8v8h-8z" />
              </svg>
            </button>
          </div>

          <div className="text-center text-[#7b8b78] my-2">or via email</div>

          {signInError && <div className="text-red-500">
            {signInError}
          </div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs text-[#6b6b6b]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" janedoe@gmail.com"
              className="w-full h-11 rounded-xl border-0 px-4 bg-[#eaf7e7]"
            />

            <label className="text-xs text-[#6b6b6b]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" ************"
              className="w-full h-11 rounded-xl border-0 px-4 bg-[#eaf7e7]"
            />

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <button type="submit" className="submit-button disabled:opacity-50" disabled={loading}>
                Sign In
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

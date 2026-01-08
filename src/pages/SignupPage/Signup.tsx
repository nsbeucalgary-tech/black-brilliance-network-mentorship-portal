import React, { useState } from "react";

type SignupProps = {
  onSubmit?: (
    name: string,
    email: string,
    password: string,
    remember: boolean
  ) => void;
};

export default function Signup({ onSubmit }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    if (!email) {
      alert("Please enter an email.");
      return;
    }
    if (!password) {
      alert("Please enter a password.");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    onSubmit?.(name, email, password, remember);
    console.log("Sign up:", { name, email, remember });
  };

  return (
    <div className="flex min-h-screen bg-white text-[#1b2b20]">
      <div className="flex-1 py-16 px-12 flex flex-col justify-center gap-6">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#23311f]" />
            <div className="text-[#2f7b2f] font-bold">Black</div>
            <div className="text-[#9fd3a0] font-bold">Brilliance</div>
          </div>
          <nav className="flex items-center gap-5">
            <a href="#" className="text-[#333] no-underline">
              About
            </a>
            <a href="#" className="text-[#333] no-underline">
              Gallery
            </a>
            <a href="#" className="text-[#333] no-underline">
              Blog
            </a>
            <a
              href="#"
              className="bg-[#2f4b2f] text-white py-2 px-3 rounded-full no-underline"
            >
              Register
            </a>
          </nav>
        </header>

        <main className="max-w-[420px] w-full">
          <h1 className="text-[28px] font-semibold mb-2">Sign Up</h1>

          <div className="flex items-center gap-3 mb-3">
            <button
              aria-label="Sign up with Google"
              className="flex-1 h-14 rounded-full flex items-center justify-center gap-3 cursor-pointer bg-[#e9f7ee]"
              onClick={() => alert("Google OAuth placeholder")}
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
              aria-label="Sign up with Microsoft"
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs text-[#6b6b6b]">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full h-11 rounded-xl border-0 px-4 bg-[#eaf7e7]"
            />

            <label className="text-xs text-[#6b6b6b]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="janedoe@gmail.com"
              className="w-full h-11 rounded-xl border-0 px-4 bg-[#eaf7e7]"
            />

            <label className="text-xs text-[#6b6b6b]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full h-11 rounded-xl border-0 px-4 bg-[#eaf7e7]"
            />

            <label className="text-xs text-[#6b6b6b]">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className="w-full h-11 rounded-xl border-0 px-4 bg-[#eaf7e7]"
            />

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-[#2f4b2f] text-white"
              >
                Create Account
              </button>
            </div>
          </form>
        </main>

        <footer className="mt-8 text-[#889a87] text-sm">
          © Copyright Black Brilliance Network 2025
        </footer>
      </div>

      <div className="flex-1 hidden lg:block bg-[url('/assets/auth-illustration.png')] bg-[#f6faf4] bg-center bg-contain bg-no-repeat" />
    </div>
  );
}

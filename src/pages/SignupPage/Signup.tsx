import React, { useState } from "react";

type SignupProps = {
  onSubmit?: (name: string, email: string, password: string, remember: boolean) => void;
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "'Inter', system-ui, Arial, sans-serif",
  background: "#fff",
  color: "#1b2b20",
};

const leftStyle: React.CSSProperties = {
  flex: 1,
  padding: "64px 48px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 24,
};

const rightStyle: React.CSSProperties = {
  flex: 1,
  background: "url('/assets/auth-illustration.png') center/contain no-repeat",
  backgroundColor: "#f6faf4",
  display: "none",
};

const cardStyle: React.CSSProperties = {
  maxWidth: 420,
  width: "100%",
};

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 600,
  marginBottom: 8,
};

const socialRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginBottom: 12,
};

const socialBtnStyle: React.CSSProperties = {
  flex: 1,
  height: 56,
  borderRadius: 999,
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 12,
  border: "none",
  padding: "0 16px",
  background: "#eaf7e7",
  boxSizing: "border-box",
};

const actionBtnStyle: React.CSSProperties = {
  height: 40,
  padding: "0 20px",
  borderRadius: 12,
  border: "none",
  background: "#2f4b2f",
  color: "#fff",
  cursor: "pointer",
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
    <div style={containerStyle}>
      <div style={leftStyle}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#23311f" }} />
            <div style={{ color: "#2f7b2f", fontWeight: 700 }}>Black</div>
            <div style={{ color: "#9fd3a0", fontWeight: 700 }}>Brilliance</div>
          </div>
          <nav style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <a href="#" style={{ color: "#333", textDecoration: "none" }}>About</a>
            <a href="#" style={{ color: "#333", textDecoration: "none" }}>Gallery</a>
            <a href="#" style={{ color: "#333", textDecoration: "none" }}>Blog</a>
            <a href="#" style={{ background: "#2f4b2f", color: "#fff", padding: "8px 14px", borderRadius: 18, textDecoration: "none" }}>Register</a>
          </nav>
        </header>

        <main style={cardStyle}>
          <h1 style={titleStyle}>Sign Up</h1>

          <div style={socialRowStyle}>
            <button
              aria-label="Sign up with Google"
              style={{ ...socialBtnStyle, background: "#e9f7ee" }}
              onClick={() => alert("Google OAuth placeholder")}
            >
              <svg width="22" height="22" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path fill="#4285f4" d="M533.5 278.4c0-18.6-1.5-36.5-4.3-53.9H272v102.3h147.3c-6.3 34-25.1 62.8-53.7 82.1v68.2h86.8c50.6-46.6 79.1-115.4 79.1-198.7z"/>
                <path fill="#34a853" d="M272 544.3c72.6 0 133.5-24 178-65.4l-86.8-68.2c-24.2 16.3-55 25.9-91.2 25.9-70.1 0-129.5-47.3-150.7-111.1H33.9v69.8C78.5 483.9 168.6 544.3 272 544.3z"/>
                <path fill="#fbbc04" d="M121.3 325.5c-10.6-31.6-10.6-65.6 0-97.2V158.5H33.9c-36.6 72.9-36.6 159.9 0 232.8l87.4-65.8z"/>
                <path fill="#ea4335" d="M272 107.7c38.6-.6 76.3 13.8 104.5 39.8l78.1-78.1C404.9 24.9 344 0 272 0 168.6 0 78.5 60.4 33.9 158.5l87.4 69.8C142.5 155 201.9 107.7 272 107.7z"/>
              </svg>
              <span style={{ fontWeight: 600 }}>Google</span>
            </button>

            <button
              aria-label="Sign up with Microsoft"
              style={{ ...socialBtnStyle, background: "#eaf7ee" }}
              onClick={() => alert("Microsoft OAuth placeholder")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path fill="#f35325" d="M3 3h8v8H3z"/>
                <path fill="#81bc06" d="M13 3h8v8h-8z"/>
                <path fill="#05a6f0" d="M3 13h8v8H3z"/>
                <path fill="#ffba08" d="M13 13h8v8h-8z"/>
              </svg>
            </button>
          </div>

          <div style={{ textAlign: "center", color: "#7b8b78", margin: "8px 0" }}>or via email</div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ fontSize: 12, color: "#6b6b6b" }}>Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              style={inputStyle}
            />

            <label style={{ fontSize: 12, color: "#6b6b6b" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="janedoe@gmail.com"
              style={inputStyle}
            />

            <label style={{ fontSize: 12, color: "#6b6b6b" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              style={inputStyle}
            />

            <label style={{ fontSize: 12, color: "#6b6b6b" }}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              style={inputStyle}
            />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>

              <button type="submit" style={actionBtnStyle}>Create Account</button>
            </div>
          </form>
        </main>

        <footer style={{ marginTop: 32, color: "#889a87", fontSize: 13 }}>
          © Copyright Black Brilliance Network 2025
        </footer>
      </div>

      <div style={{ ...rightStyle, display: window.innerWidth > 900 ? "block" : "none" }} />
    </div>
  );
}

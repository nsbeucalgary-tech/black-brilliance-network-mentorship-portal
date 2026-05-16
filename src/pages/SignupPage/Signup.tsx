import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithProvider,
  signUpWithEmailAndPassword,
  validateUserPassword,
} from "../../auth/AuthFunctions";
import type { AuthProvider } from "firebase/auth";
import { googleProvider } from "../../_db_controller/init";
import { PublicOnlyRoute } from "../../components/PublicRoute";
import { GoogleLogoIcon } from "../../components/Logos";
import PasswordInput from "../../components/PasswordInput";

type SignupProps = {
  onBack?: () => void;
};

function SignupComponent({ onBack }: SignupProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [signUpError, setSignUpError] = useState<string>("");
  const [passwordValidationError, setPasswordValidationError] = useState<string[]>([]);
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
        remember
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
    providerName: string
  ) => {
    setLoading(true);
    try {
      const error = await signInWithProvider(provider, providerName, remember);
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
    <section className="py-8 sm:px-36 lg:px-12 xl:px-24 text-BBNDarkGreen">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-3xl font-semibold text-BBNDarkGreen">Sign Up</h1>
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
          aria-label="Sign up with Google"
          className="flex w-fit rounded-full bg-BBNLightGreen hover:bg-[#c5dbb0] cursor-pointer p-5"
          onClick={() => handleProviderSignIn(googleProvider, "Google")}
        >
          <GoogleLogoIcon />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 text-center text-gray-400 my-2">
        <div className="w-full h-[2px] bg-gray-400 mx-auto"></div>
        <p className="whitespace-nowrap">or via email</p>
        <div className="w-full h-[2px] bg-gray-400 mx-auto"></div>
      </div>

      {signUpError && <div className="text-red-500">
        {signUpError}
      </div>}

      {(passwordValidationError.length > 0) && <div className="text-red-500">
        <ul>
          {passwordValidationError.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-semibold">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-sm ">First Name</label>
            <input
              autoComplete="firstName"
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Tyrone"
              className="w-full h-11 rounded-xl border-0 px-4 bg-BBNLightGreen placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm ">Last Name</label>
            <input
              autoComplete="lastName"
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Davis"
              className="w-full h-11 rounded-xl border-0 px-4 bg-BBNLightGreen placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm ">Email</label>
          <input
            autoComplete="email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" tyrondavis@gmail.com"
            className="w-full h-11 rounded-xl border-0 px-4 bg-BBNLightGreen placeholder:text-gray-400"
          />
        </div>
        <PasswordInput labelText="Password" placeholder="Create a password" id="password" value={password} setValue={setPassword} />
        <PasswordInput labelText="Confirm Password" placeholder="Confirm password" id="confirmPassword" value={confirm} setValue={setConfirm} />

        <div className="flex items-center justify-between mt-2 text-BBNDarkGreen">
          <label htmlFor="remember" className="flex items-center gap-2 text-base cursor-pointer">
            <input
              id="remember"
              autoComplete="off"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <button type="submit"
            className="submit-button cursor-pointer disabled:opacity-50 bg-BBNDarkGreen hover:bg-BBNDarkAvocadoGreen text-white rounded-full px-8 py-2"
            disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default function Signup({ onBack }: SignupProps) {
  return (
    <PublicOnlyRoute>
      <SignupComponent onBack={onBack} />
    </PublicOnlyRoute>
  );
}

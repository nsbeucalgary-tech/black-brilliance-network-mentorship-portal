import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    validatePassword,
    signInWithPopup,
    setPersistence,
    browserSessionPersistence,
    browserLocalPersistence,
    updateProfile,
} from "firebase/auth";
import type { AuthProvider } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../_db_controller/init";
import { UserController } from "../services/UserController";

const userController = new UserController(db);

export async function signUpWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
    remember: boolean,
): Promise<string | null> {
    try {
        await setPersistence(
            auth,
            remember ? browserLocalPersistence : browserSessionPersistence,
        );

        // 1. Create the Firebase Auth account
        console.log("[Auth] Creating Firebase Auth account...");
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        console.log("[Auth] Auth account created. UID:", credential.user.uid);

        // 2. Set the display name on the Auth profile
        await updateProfile(credential.user, { displayName: name });
        console.log("[Auth] Display name set.");

        // 3. Create the Firestore user document using the Auth UID as the doc ID
        console.log("[Auth] Writing Firestore user doc...");
        await userController.createUser({
            uid: credential.user.uid,
            full_name: name,
            email: email,
        });
        console.log("[Auth] Firestore user doc written successfully.");

        return null;
    } catch (e) {
        // Log the FULL error so we can see exactly what went wrong
        console.error("[Auth] signUpWithEmailAndPassword failed:", e);

        if (e instanceof FirebaseError) {
            switch (e.code) {
                case "auth/email-already-in-use":
                    return "This email is already registered.";
                case "auth/invalid-email":
                    return "Please enter a valid email address.";
                case "auth/weak-password":
                    return "Password must be at least 6 characters.";
                case "auth/network-request-failed":
                    return "Network error. Please try again.";
                case "auth/too-many-requests":
                    return "Too many attempts. Try again later.";
                default:
                    return "Something went wrong. Please try again.";
            }
        }
        return "Something went wrong. Please try again.";
    }
}

export async function logInWithEmailAndPassword(
    email: string,
    password: string,
    remember: boolean,
): Promise<string | null> {
    try {
        await setPersistence(
            auth,
            remember ? browserLocalPersistence : browserSessionPersistence,
        );
        await signInWithEmailAndPassword(auth, email, password);
        return null;
    } catch (e) {
        console.error("[Auth] logInWithEmailAndPassword failed:", e);
        if (e instanceof FirebaseError) {
            switch (e.code) {
                case "auth/user-not-found":
                    return "No account found with this email.";
                case "auth/wrong-password":
                    return "Incorrect password.";
                case "auth/invalid-email":
                    return "Please enter a valid email address.";
                case "auth/user-disabled":
                    return "This account has been disabled.";
                case "auth/network-request-failed":
                    return "Network error. Please try again.";
                case "auth/too-many-requests":
                    return "Too many attempts. Try again later.";
                default:
                    return "Invalid email or password.";
            }
        }
        return "Something went wrong. Please try again.";
    }
}

export async function signInWithProvider(
    provider: AuthProvider,
    providerName: string,
    remember: boolean,
): Promise<string | null> {
    try {
        await setPersistence(
            auth,
            remember ? browserLocalPersistence : browserSessionPersistence,
        );

        const credential = await signInWithPopup(auth, provider);
        const { user } = credential;

        const alreadyExists = await userController.userExists(user.uid);
        if (!alreadyExists) {
            console.log("[Auth] New OAuth user — creating Firestore doc...");
            await userController.createUser({
                uid: user.uid,
                full_name: user.displayName ?? "New User",
                email: user.email ?? "",
            });
            console.log("[Auth] Firestore doc created for OAuth user.");
        }

        return null;
    } catch (e) {
        console.error("[Auth] signInWithProvider failed:", e);
        if (e instanceof FirebaseError) {
            switch (e.code) {
                case "auth/popup-closed-by-user":
                    return "Sign-in was cancelled.";
                case "auth/popup-blocked":
                    return "Popup was blocked. Please allow popups and try again.";
                case "auth/network-request-failed":
                    return "Network error. Please try again.";
                case "auth/account-exists-with-different-credential":
                    return "An account already exists with this email using a different sign-in method.";
                default:
                    return `${providerName} sign-in failed. Please try again.`;
            }
        }
        return `${providerName} sign-in failed. Please try again.`;
    }
}

export async function validateUserPassword(
    password: string,
): Promise<string[]> {
    const status = await validatePassword(auth, password);
    if (status.isValid) return [];

    const rules: Array<[boolean | undefined, string]> = [
        [status.containsLowercaseLetter, "Missing a lowercase letter."],
        [status.containsUppercaseLetter, "Missing an uppercase letter."],
        [status.containsNumericCharacter, "Missing a number."],
        [
            status.containsNonAlphanumericCharacter,
            "Missing a special character (e.g. ^, $, *, !).",
        ],
        [status.meetsMinPasswordLength, "Password is too short."],
        [status.meetsMaxPasswordLength, "Password is too long."],
    ];

    return rules
        .filter(([passes]) => passes === false)
        .map(([, message]) => message);
}

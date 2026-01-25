import { createUserWithEmailAndPassword, signInWithEmailAndPassword, validatePassword } from "firebase/auth";
import { FirebaseError } from "firebase/app"
import { auth } from "../_db_controller/init"

export async function signUpWithEmailAndPassword(
  name: string,
  email: string,
  password: string,
): Promise<string | null> {
  try {
    const createdUser = await createUserWithEmailAndPassword(auth, email, password);
    console.log(createdUser.user);
    // <        -----> Create a User with the name
    return null;
  } catch (e) {
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
): Promise<string | null> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return null;
  } catch (e) {
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


export async function validateUserPassword(password: string): Promise<string[]> {
  const status = await validatePassword(auth, password);

  if (status.isValid) {
    return [];
  }

  const rules: Array<[boolean | undefined, string]> = [
    [status.containsLowercaseLetter, 'Missing a lowercase letter.'],
    [status.containsUppercaseLetter, 'Missing an uppercase letter.'],
    [status.containsNumericCharacter, 'Missing a number.'],
    [status.containsNonAlphanumericCharacter, 'Missing a special character (e.g. ^, $, *, !).'],
    [status.meetsMinPasswordLength, 'Password is too short.'],
    [status.meetsMaxPasswordLength, 'Password is too long.'],
  ];

  return rules
    .filter(([passes]) => passes === false)
    .map(([, message]) => message);
}



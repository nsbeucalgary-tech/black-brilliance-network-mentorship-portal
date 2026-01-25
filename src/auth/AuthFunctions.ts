import { createUserWithEmailAndPassword, signInWithEmailAndPassword, validatePassword } from "firebase/auth";
import { FirebaseError } from "firebase/app"
import { auth } from "../_db_controller/init"

export async function signUpWithEmailAndPassword(
  name: string,
  email: string,
  password: string,
  navigate: (path: string) => void,
): Promise<string | null> {
  try {
    const createdUser = await createUserWithEmailAndPassword(auth, email, password);
    console.log(createdUser.user);
    // <        -----> Create a User with the name
    navigate('/dashboard');
    return null;
  } catch (e) {
    let returnedError = "";
    if (e instanceof FirebaseError) {
      switch (e.code) {
        case "auth/email-already-in-use":
          returnedError = "This email is already registered.";
          break;
        case "auth/invalid-email":
          returnedError = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          returnedError = "Password must be at least 6 characters.";
          break;
        case "auth/network-request-failed":
          returnedError = "Network error. Please try again.";
          break;
        case "auth/too-many-requests":
          returnedError = "Too many attempts. Try again later.";
          break;
        default:
          returnedError = "Something went wrong. Please try again.";
      }
    } else {
      returnedError = "Something went wrong. Please try again.";
    }
    return returnedError;
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
    .filter(([passes]) => !passes)
    .map(([, message]) => message);
}



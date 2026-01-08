/**
 * User entity type definition
 * Represents a user in the Black Brilliance Network Mentorship Portal
 */
export interface User {
  /** Unique identifier for the user (primary key) */
  user_id: string;

  /** User's full name */
  full_name: string;

  /** User's email address */
  email: string;

  /** Hashed password (never store plain text passwords) */
  password_hash: string;

  /** User's organizational affiliation */
  affiliation: string;

  /** User's role in the system */
  role: UserRole;

  /** Admin status of the user */
  admin_status: boolean;

  /** Timestamp when the user account was created */
  created_at: Date;
}

/**
 * Enum for user roles
 */
export const UserRole = {
  MENTOR: "mentor",
  MENTEE: "mentee",
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];


/**
 * Firestore user document data type
 * (Dates are stored as timestamps in Firestore)
 */
export interface UserFirestoreData {
  user_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  affiliation: string;
  role: UserRole;
  admin_status: boolean;
  created_at: Date | FirebaseFirestoreTypes.Timestamp;
}

/**
 * Firebase Firestore Timestamp type
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace FirebaseFirestoreTypes {
  interface Timestamp {
    toDate(): Date;
    toMillis(): number;
  }
}

/**
 * User creation payload (omits user_id and created_at)
 */
export type CreateUserPayload = Omit<User, "user_id" | "created_at">;

/**
 * User update payload (all fields optional except user_id)
 */
export type UpdateUserPayload = Partial<Omit<User, "user_id" | "created_at">> & {
  user_id: string;
};

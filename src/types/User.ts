/**
 * User entity type definition
 * Represents a user in the Black Brilliance Network Mentorship Portal
 */
export interface User {
  /** User's full name */
  full_name: string;

  /** User's email address */
  email: string;

  /** User's role in the system */
  role: UserRole;

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
  full_name: string;
  email: string;
  role: UserRole;
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
 * User creation payload (makes role optional, defaults to USER)
 */
export type CreateUserPayload = Omit<User, "created_at"> & {
  role?: UserRole;
};

/**
 * User update payload (all fields optional except user_id)
 */
export type UpdateUserPayload = Partial<Omit<User, "created_at">> & {
  user_id: string;
};

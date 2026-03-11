import type { Timestamp } from "firebase/firestore";

/**
 * User entity type definition
 * Represents a user in the Black Brilliance Network Mentorship Portal
 */
export interface User {
    /** Firebase Auth UID — also the Firestore document ID */
    uid: string;

    /** User's full name */
    full_name: string;

    /** User's email address */
    email: string;

    /** User's role in the system */
    role: UserRole;

    /** Timestamp when the user account was created */
    created_at: Date;

    // ── Profile fields (all optional — filled in after signup) ──────────────

    /** Pronouns e.g. "She/Her" */
    pronouns?: string;

    /** Short bio / about text */
    bio?: string;

    /** City, Province e.g. "Calgary, Alberta" */
    location?: string;

    /** Current job title e.g. "Software Engineer at Google" */
    title?: string;

    /** Profile avatar URL (uploaded or OAuth photo) */
    avatar_url?: string;

    /** Personal or portfolio website */
    website_url?: string;

    /** LinkedIn profile URL */
    linkedin_url?: string;

    /** List of interest tags */
    interests?: string[];

    /** Work experience entries */
    experiences?: UserExperience[];
}

/** A single work experience entry */
export interface UserExperience {
    company: string;
    role: string;
    /** e.g. "Jan 2020 – Present" */
    period: string;
    /** Hex colour for the timeline dot */
    color?: string;
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

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Firestore document shape — Dates stored as Timestamps.
 * uid is intentionally excluded because it lives as the document ID,
 * not as a field inside the document.
 */
export interface UserFirestoreData extends Omit<User, "uid" | "created_at"> {
    created_at: Date | Timestamp;
}

/**
 * Payload for creating a new user (uid comes from Firebase Auth)
 */
export type CreateUserPayload = {
    uid: string;
    full_name: string;
    email: string;
    role?: UserRole;
};

/**
 * Payload for updating a user profile
 */
export type UpdateUserPayload = Partial<Omit<User, "uid" | "created_at">>;

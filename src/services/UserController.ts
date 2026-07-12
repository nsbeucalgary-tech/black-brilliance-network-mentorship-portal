import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    arrayUnion,
    arrayRemove,
    Timestamp,
    type Firestore,
    type Unsubscribe,
    onSnapshot,
} from "firebase/firestore";
import type {
    User,
    UserFirestoreData,
    CreateUserPayload,
    UpdateUserPayload,
} from "../types/User";
import { UserRole } from "../types/User";

/**
 * User Database Controller
 * Handles all user-related Firestore operations.
 *
 * Document IDs in the "users" collection are always the Firebase Auth UID,
 * so Auth and Firestore stay in sync automatically.
 */
export class UserController {
    private db: Firestore;
    private collectionName = "users";

    constructor(db: Firestore) {
        this.db = db;
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private firestoreDataToUser(uid: string, data: UserFirestoreData): User {
        return {
            ...data,
            uid,
            created_at:
                data.created_at instanceof Timestamp
                    ? data.created_at.toDate()
                    : (data.created_at as Date),
        };
    }

    private userToFirestoreData(user: User): UserFirestoreData {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { uid, ...rest } = user; // uid lives as the doc ID, not a field
        return {
            ...rest,
            created_at:
                user.created_at instanceof Date
                    ? Timestamp.fromDate(user.created_at)
                    : user.created_at,
        };
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /**
     * Create a Firestore document for a newly registered user.
     * Uses the Firebase Auth UID as the document ID so the two records
     * are always linked by the same key.
     *
     * Call this immediately after `createUserWithEmailAndPassword` or
     * `signInWithPopup` (for first-time OAuth users).
     */
    async createUser(payload: CreateUserPayload): Promise<User> {
        const now = new Date();

        const user: User = {
            uid: payload.uid,
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            role: payload.role ?? UserRole.USER,
            created_at: now,
        };

        await setDoc(
            doc(this.db, this.collectionName, payload.uid),
            this.userToFirestoreData(user),
        );

        return user;
    }

    /**
     * Fetch a user by their Firebase Auth UID.
     * Returns null if no Firestore document exists yet.
     */
    async getUserById(uid: string): Promise<User | null> {
        const snap = await getDoc(doc(this.db, this.collectionName, uid));
        if (!snap.exists()) return null;
        return this.firestoreDataToUser(
            snap.id,
            snap.data() as UserFirestoreData,
        );
    }

    /**
     * Fetch a user by email address.
     * Useful when you only have an email (e.g. OAuth sign-in check).
     */
    async getUserByEmail(email: string): Promise<User | null> {
        const q = query(
            collection(this.db, this.collectionName),
            where("email", "==", email),
        );
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0];
        return this.firestoreDataToUser(d.id, d.data() as UserFirestoreData);
    }

    /** Fetch every user document. */
    async getAllUsers(): Promise<User[]> {
        const snap = await getDocs(collection(this.db, this.collectionName));
        return snap.docs.map((d) =>
            this.firestoreDataToUser(d.id, d.data() as UserFirestoreData),
        );
    }

    /** Fetch all users with a specific role. */
    async getUsersByRole(role: UserRole): Promise<User[]> {
        const q = query(
            collection(this.db, this.collectionName),
            where("role", "==", role),
        );
        const snap = await getDocs(q);
        return snap.docs.map((d) =>
            this.firestoreDataToUser(d.id, d.data() as UserFirestoreData),
        );
    }

    /**
     * Update profile fields for a user.
     * Only the fields included in `payload` are written — everything else
     * is left untouched (Firestore merge/updateDoc semantics).
     */
    async updateUser(uid: string, payload: UpdateUserPayload): Promise<User> {
        const ref = doc(this.db, this.collectionName, uid);

        // Build a plain object so Firestore doesn't receive undefined values
        const updates: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(payload)) {
            if (value !== undefined) updates[key] = value;
        }

        await updateDoc(ref, updates);

        const updated = await this.getUserById(uid);
        if (!updated) throw new Error(`User ${uid} not found after update`);
        return updated;
    }

    /** Add a user UID to this user's favourite_ids list. */
    async addFavourite(uid: string, targetUid: string): Promise<void> {
        await updateDoc(doc(this.db, this.collectionName, uid), {
            favourite_ids: arrayUnion(targetUid),
        });
    }

    /** Remove a user UID from this user's favourite_ids list. */
    async removeFavourite(uid: string, targetUid: string): Promise<void> {
        await updateDoc(doc(this.db, this.collectionName, uid), {
            favourite_ids: arrayRemove(targetUid),
        });
    }

    /** Delete a user's Firestore document (does NOT delete their Auth account). */
    async deleteUser(uid: string): Promise<void> {
        await deleteDoc(doc(this.db, this.collectionName, uid));
    }

    /** Returns true if a Firestore document exists for this UID. */
    async userExists(uid: string): Promise<boolean> {
        return (await this.getUserById(uid)) !== null;
    }

    /** Returns true if an email address is already registered in Firestore. */
    async emailExists(email: string): Promise<boolean> {
        return (await this.getUserByEmail(email)) !== null;
    }

    /**
     * Realtime listener for a user profile document. 
     * 
     * Automatically updates whenever:
     * - the user's profileinformation changes
     * - the user's role changes
     * - any tracked Firestore user fields are updated
     * 
     * IMPORTANT:
     * Call the returned unsubscribe function when the component unmounts.
     * 
     * @param uid - The Firestore Authentication UID for the user.
     * @param callback - Function triggered whenever users update.
     * @returns Firestore unsubscribe function.
     */
    subscribeToUser(
        uid: string,
        callback: (user: User | null) => void,
    ): Unsubscribe {
        const ref = doc(this.db, this.collectionName, uid);

        return onSnapshot(ref, (snapshot) => {
            if (!snapshot.exists()) {
                callback(null);
                return;
            }

            callback(
                this.firestoreDataToUser(
                    snapshot.id,
                    snapshot.data() as UserFirestoreData,
                ),
            );
        });
    }
}

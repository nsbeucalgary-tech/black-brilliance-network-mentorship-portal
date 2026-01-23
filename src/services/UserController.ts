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
  Firestore,
  Timestamp,
} from "firebase/firestore";
import type {
    User,
    UserFirestoreData,
    CreateUserPayload,
    UpdateUserPayload,
} from "../types/User";

/**
 * User Database Controller
 * Handles all user-related Firestore operations
 */
export class UserController {
  private db: Firestore;
  private collectionName = "users";

  constructor(db: Firestore) {
    this.db = db;
  }

  /**
   * Convert Firestore user data to User type
   * Ensures proper date conversion from Firestore timestamps
   */
  private firestoreDataToUser(data: UserFirestoreData): User {
    return {
      ...data,
      created_at:
        data.created_at instanceof Timestamp
          ? data.created_at.toDate()
          : (data.created_at as Date),
    };
  }

  /**
   * Convert User object to Firestore-compatible data
   */
  private userToFirestoreData(user: User): UserFirestoreData {
    return {
      ...user,
      created_at:
        user.created_at instanceof Date
          ? Timestamp.fromDate(user.created_at)
          : user.created_at,
    };
  }

  /**
   * Create a new user in Firestore
   * @param payload User creation data
   * @returns The created User with generated user_id
   */
  async createUser(payload: CreateUserPayload): Promise<User> {
    const user_id = doc(collection(this.db, this.collectionName)).id;
    const now = new Date();

    const user: User = {
      user_id,
      ...payload,
      created_at: now,
    };

    const firestoreData = this.userToFirestoreData(user);

    await setDoc(
      doc(this.db, this.collectionName, user_id),
      firestoreData
    );

    return user;
  }

  /**
   * Get a user by ID
   * @param user_id The user's ID
   * @returns The User object or null if not found
   */
  async getUserById(user_id: string): Promise<User | null> {
    const docSnap = await getDoc(
      doc(this.db, this.collectionName, user_id)
    );

    if (!docSnap.exists()) {
      return null;
    }

    return this.firestoreDataToUser(docSnap.data() as UserFirestoreData);
  }

  /**
   * Get a user by email
   * @param email The user's email
   * @returns The User object or null if not found
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const q = query(
      collection(this.db, this.collectionName),
      where("email", "==", email)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    return this.firestoreDataToUser(docSnap.data() as UserFirestoreData);
  }

  /**
   * Get all users
   * @returns Array of all User objects
   */
  async getAllUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(
      collection(this.db, this.collectionName)
    );

    return querySnapshot.docs.map((doc) =>
      this.firestoreDataToUser(doc.data() as UserFirestoreData)
    );
  }

  /**
   * Get users by role
   * @param role The role to filter by
   * @returns Array of User objects with the specified role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    const q = query(
      collection(this.db, this.collectionName),
      where("role", "==", role)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) =>
      this.firestoreDataToUser(doc.data() as UserFirestoreData)
    );
  }

  /**
   * Update a user
   * @param user_id The user's ID
   * @param payload The fields to update
   * @returns The updated User object
   */
  async updateUser(
    user_id: string,
    payload: Partial<Omit<UpdateUserPayload, "user_id">>
  ): Promise<User> {
    const firestoreData: Record<string, unknown> = {};

    // Copy all fields from payload
    Object.entries(payload).forEach(([key, value]) => {
      firestoreData[key] = value;
    });

    await updateDoc(doc(this.db, this.collectionName, user_id), firestoreData);

    const updatedUser = await this.getUserById(user_id);
    if (!updatedUser) {
      throw new Error(`User with ID ${user_id} not found after update`);
    }

    return updatedUser;
  }

  /**
   * Delete a user
   * @param user_id The user's ID
   */
  async deleteUser(user_id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.collectionName, user_id));
  }

  /**
   * Check if a user exists by ID
   * @param user_id The user's ID
   * @returns true if user exists, false otherwise
   */
  async userExists(user_id: string): Promise<boolean> {
    const user = await this.getUserById(user_id);
    return user !== null;
  }

  /**
   * Check if an email is already registered
   * @param email The email to check
   * @returns true if email exists, false otherwise
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return user !== null;
  }
}

import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth, db } from "../_db_controller/init";
import { UserController } from "../services/UserController";
import type { User as DBUser } from "../types/User";

const userController = new UserController(db);

interface AuthContextType {
    /** Firebase Auth user (or null if logged out) */
    user: FirebaseUser | null;
    /** Firestore profile for the logged-in user (null if not loaded yet or logged out) */
    dbUser: DBUser | null;
    /** Refresh the dbUser from Firestore (call after profile updates) */
    refreshDbUser: () => Promise<void>;
    /** True while the initial auth + profile load is in progress */
    loading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [dbUser, setDbUser] = useState<DBUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDbUser = async (uid: string) => {
        try {
            const profile = await userController.getUserById(uid);
            setDbUser(profile);
        } catch (e) {
            console.error(
                "[AuthContext] Failed to fetch Firestore profile:",
                e,
            );
            setDbUser(null);
        }
    };

    const refreshDbUser = async () => {
        if (user) await fetchDbUser(user.uid);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchDbUser(currentUser.uid);
            } else {
                setDbUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOut(auth);
        setDbUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, dbUser, refreshDbUser, loading, logout }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

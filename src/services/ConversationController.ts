import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where,
    type Firestore,
} from "firebase/firestore";
import type {
    Conversation,
    ConversationForm,
} from "../types/conversation.types";

export class ConversationController {
    private db: Firestore;
    private collectionName = "conversations";

    constructor(db: Firestore) {
        this.db = db;
    }

    /**
     * Converts Firestore document data into a complete Conversation object.
     *
     * Firestore document IDs are stored separately from the document data, so this method combines the document ID with the conversation fields.
     *
     * @param id - The Firestore document ID for the conversation.
     * @param data -  The conversation data stored in Firestore.
     * @returns A fully constucted Conversation object.
     */
    private firestoreDataToConversation(
        id: string,
        data: ConversationForm,
    ): Conversation {
        return {
            conversationId: id,
            ...data,
        };
    }

    /**
     * Creates a conversation id from two user IDs.
     *
     * Combines two Firestore Authentication user IDs into a single conversation identifier used for storing conversations.
     *
     * @param userAId - The Firestore Authentication UID for the first user.
     * @param userBId - The Firestore Authentication UID for the second user.
     * @returns A concatenated string containing both user IDs.
     */
    private generateConversationId(userAId: string, userBId: string): string {
        return [userAId, userBId].sort().join("_");
    }

    /**
     * Creates a conversation from the given user IDs
     *
     * Checks the given users to see if they exist within the database and if so return their conversation else create a new document within the database. This is done through setDoc and the field merge: true.
     *
     * @param userAId - The Firestore Authentication UID for the first user.
     * @param userBId - The Firestore Authentication UID for the second user.
     * @returns A constructed Conversation object.
     */
    async createConversation(
        userAId: string,
        userBId: string,
    ): Promise<Conversation> {
        if (userAId === userBId) {
            throw new Error("Cannot create conversation with yourself");
        }

        const conversationId = this.generateConversationId(userAId, userBId);
        const conversationRef = doc(
            this.db,
            this.collectionName,
            conversationId,
        );

        const conversationData = {
            participantIds: [userAId, userBId],
            created_at: serverTimestamp(),
        };

        await setDoc(conversationRef, conversationData, { merge: true });

        return {
            conversationId,
            participantIds: [userAId, userBId],
            created_at: undefined as unknown as Timestamp,
        };
    }

    /**
     * Get the conversation based on the id.
     *
     * Get the conversation based on the id and return the conversation object if found and if not then return null.
     *
     * @param conversationId - The generated conversationId for the conversation.
     * @returns A fully constructed Conversation object or null.
     */
    async getConversationById(
        conversationId: string,
    ): Promise<Conversation | null> {
        const conversationRef = doc(
            this.db,
            this.collectionName,
            conversationId,
        );

        const snapshot = await getDoc(conversationRef);

        if (!snapshot.exists()) {
            return null;
        }

        return this.firestoreDataToConversation(
            snapshot.id,
            snapshot.data() as Conversation,
        );
    }

    /**
     * Retrieves all conversations associated with a user
     *
     * Queires Firestore for conversations where the given userId exists in the conversation field participantIds.
     *
     * @param userId - The Firestore Authentication UID for the user.
     * @returns A promise that resolves to a list of conversations for the user
     */
    async getUserConversation(userId: string): Promise<Conversation[]> {
        const conversationRef = collection(this.db, this.collectionName);

        const querySearch = query(
            conversationRef,
            where("participantIds", "array-contains", userId),
            orderBy("last_message_at", "desc"),
        );

        const snapshot = await getDocs(querySearch);

        return snapshot.docs.map((doc) =>
            this.firestoreDataToConversation(
                doc.id,
                doc.data() as ConversationForm,
            ),
        );
    }

    /**
     * Updates the most recent message information for a conversation.
     *
     * Stores the latest message content and updates the last activity timestamp in Firestore.
     *
     * @param conversationId - The generated conversationId for the conversation.
     * @param message - The latest message sent in the conversation.
     */
    async updateLastMessage(
        conversationId: string,
        message: string,
    ): Promise<void> {
        const conversationRef = doc(
            this.db,
            this.collectionName,
            conversationId,
        );

        await updateDoc(conversationRef, {
            last_message: message,
            last_message_at: serverTimestamp() as Timestamp,
        });
    }
}

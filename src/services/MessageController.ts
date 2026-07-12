import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
    type Firestore,
    type Unsubscribe,
} from "firebase/firestore";

import type { Message, MessageForm } from "../types/message.types";

export class MessageController {
    private db: Firestore;
    private parentCollectionName = "conversations";
    private collectionName = "messages";

    constructor(db: Firestore) {
        this.db = db;
    }

    /**
     * Converts Firestore document data into a complete Message object.
     *
     * Firestore document IDs are stored separately from the document data, so this method combines the document ID with the message fields.
     *
     * @param id - The Firestore document ID for the message.
     * @param data - The message data stored in Firestore.
     * @returns A fully constructed Message object.
     */
    private firestoreDataToMessage(id: string, data: MessageForm): Message {
        return {
            messageId: id,
            ...data,
            created_at: data.created_at as Timestamp,
        };
    }

    /**
     * Sends a message within a conversation.
     *
     * Creates a new message document inside: conversations/{conversationId}/messages
     *
     * Also updates the parent conversation with the latest message metadata.
     *
     * @param conversationId - The generated conversationId.
     * @param senderId - The Firestore Authentication UID of the sender.
     * @param text - The message content being sent.
     * @returns A fully constructed Message object.
     */
    async sendMessage(
        conversationId: string,
        senderId: string,
        text: string,
    ): Promise<Message> {
        if (!text.trim()) {
            throw new Error("Message text cannot be empty");
        }

        if (text.length > 2000) {
            throw new Error("Message exceeds 2000 character limit");
        }

        const messagesRef = collection(
            this.db,
            this.parentCollectionName,
            conversationId,
            this.collectionName,
        );

        const conversationRef = doc(
            this.db,
            this.parentCollectionName,
            conversationId,
        );

        const messageData = {
            senderId,
            text: text.trim(),
            created_at: serverTimestamp(),
        };

        const docRef = await addDoc(messagesRef, messageData);

        // Update conversation preview metadata
        await updateDoc(conversationRef, {
            last_message: text.trim(),

            last_message_at: serverTimestamp(),
        });

        return {
            messageId: docRef.id,
            senderId,
            text: text.trim(),
            created_at: serverTimestamp() as Timestamp,
        };
    }

    /**
     * Retrieves all messages for a conversation.
     *
     * Queries Firestore for all messages within the conversation, ordered by creation time ascending.
     *
     * @param conversationId - The generated conversation ID.
     * @returns A promise resolving to a list of messages.
     */
    async getConversationMessages(conversationId: string): Promise<Message[]> {
        const messagesRef = collection(
            this.db,
            this.parentCollectionName,
            conversationId,
            this.collectionName,
        );

        const querySearch = query(messagesRef, orderBy("created_at", "asc"));

        const snapshot = await getDocs(querySearch);

        return snapshot.docs.map((doc) =>
            this.firestoreDataToMessage(doc.id, doc.data() as MessageForm),
        );
    }

    /**
     * Realtime listener for conversation messages.
     *
     * Automatically updates whenever:
     * - a new message is sent
     * - a message changes
     * - a message is deleted
     *
     * IMPORTANT:
     * Call the returned unsubscribe function when the component unmounts.
     *
     * @param conversationId - The generated conversation ID.
     * @param callback - Function triggered whenever messages update.
     * @returns Firestore unsubscribe function.
     */
    subscribeToMessages(
        conversationId: string,
        callback: (messages: Message[]) => void,
    ): Unsubscribe {
        const messagesRef = collection(
            this.db,
            this.parentCollectionName,
            conversationId,
            this.collectionName,
        );

        const querySearch = query(messagesRef, orderBy("created_at", "asc"));

        return onSnapshot(querySearch, (snapshot) => {
            const messages = snapshot.docs.map((doc) =>
                this.firestoreDataToMessage(doc.id, doc.data() as MessageForm),
            );

            callback(messages);
        });
    }

    /**
     * Retrieves all messages sent by a user.
     *
     * Queries Firestore for messages where senderId matches the provided user ID.
     *
     * @param conversationId - The generated conversationId.
     * @param senderId - The Firestore Authentication UID of the sender.
     * @returns A promise resolving to a list of messages.
     */
    async getUserMessages(
        conversationId: string,
        senderId: string,
    ): Promise<Message[]> {
        const messagesRef = collection(
            this.db,
            this.parentCollectionName,
            conversationId,
            this.collectionName,
        );

        const querySearch = query(
            messagesRef,

            where("senderId", "==", senderId),

            orderBy("created_at", "asc"),
        );

        const snapshot = await getDocs(querySearch);

        return snapshot.docs.map((doc) =>
            this.firestoreDataToMessage(doc.id, doc.data() as MessageForm),
        );
    }
}

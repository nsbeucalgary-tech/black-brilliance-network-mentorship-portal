import type { Timestamp } from "firebase/firestore";

export type Message = {
    messageId: string;
    senderId: string;
    text: string;
    created_at: Timestamp;
};

export type MessageForm = Omit<Message, "messageId">

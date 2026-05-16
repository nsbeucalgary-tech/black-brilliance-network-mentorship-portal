import type { Timestamp } from "firebase/firestore";

export type Conversation = {
    conversationId: string;
    participantIds: [string, string];
    matchId?: string;
    last_message?: string;
    last_message_at?: Timestamp;
    created_at: Timestamp;
}

export type ConversationForm = Omit<Conversation, "conversationId">;
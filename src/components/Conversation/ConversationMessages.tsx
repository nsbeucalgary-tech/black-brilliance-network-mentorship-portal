import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../../auth/useAuthContext";
import { MessageController } from "../../services/MessageController";
import { UserController } from "../../services/UserController";
import { db } from "../../_db_controller/init";
import type { Message } from "../../types/message.types";
import type { User } from "../../types/User";
import { getInitials } from "../../utils";

const messageController = new MessageController(db);
const userController = new UserController(db);

/**
 * Formats a timestamp into a localized short string.
 *
 * Used for displaying message timestamp in the caht.
 * @param ts - Firestore timestamp
 * @returns A time string like "9:00 AM"
 */
function formatTime(ts: Timestamp | undefined): string {
    if (!ts) return "";
    return ts
        .toDate()
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Formats a timestamp into a date label
 *
 * Used in chat message for grouping labels on the same day
 *
 * @param ts - Firestore timestamp
 * @returns A date label for the message section
 */
function formatDateLabel(ts: Timestamp | undefined): string {
    if (!ts) return "";
    const date = ts.toDate();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * Determines whether a date separator label should be shown before a message
 *
 * @param messages - An ordered array of chat messages
 * @param index - Index of the current message being evaluated.
 * @returns True if a date label should be rendered before the message.
 */
function shouldShowDateLabel(messages: Message[], index: number): boolean {
    if (index === 0) return true;
    const prev = messages[index - 1].created_at;
    const curr = messages[index].created_at;
    if (!prev || !curr) return false;
    return prev.toDate().toDateString() !== curr.toDate().toDateString();
}

export default function ConversationMessages() {
    const { dbUser, selectedConvoId, setSelectedConvoId, selectedConvoUserId } =
        useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const currentUserId = dbUser?.uid;

    const [otherUser, setOtherUser] = useState<User | null>(null);

    useEffect(() => {
        if (!selectedConvoUserId) return;

        userController
            .getUserById(selectedConvoUserId)
            .then(setOtherUser)
            .catch(console.error);
    }, [selectedConvoUserId]);

    // Subscribe to messages
    useEffect(() => {
        if (!selectedConvoId) return;
        const unsub = messageController.subscribeToMessages(
            selectedConvoId,
            (msgs) => setMessages(msgs),
        );
        return () => unsub();
    }, [selectedConvoId]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!selectedConvoId || !text.trim() || !currentUserId) return;
        try {
            await messageController.sendMessage(
                selectedConvoId,
                currentUserId,
                text,
            );
            setText("");
            inputRef.current?.focus();
        } catch (err) {
            console.error("Failed to send:", err);
        }
    };

    const displayName = otherUser
        ? `${otherUser.first_name} ${otherUser.last_name}`.trim()
        : "Conversation";
    const initials = otherUser ? getInitials(displayName) : "··";

    return (
        <div className="flex flex-col flex-1 overflow-hidden bg-BBNAmnesiacWhite">
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-BBNDarkAvocadoGreen border-b border-BBNDarkAvocadoGreen/50 flex-shrink-0">
                <button
                    onClick={() => setSelectedConvoId("")}
                    aria-label="Back"
                    className="flex items-center justify-center w-7 h-7 rounded-full text-BBNLightGreen hover:bg-white/10 active:scale-90 transition-all"
                >
                    <ArrowLeft size={16} strokeWidth={2.2} />
                </button>

                <div className="w-8 h-8 rounded-full bg-BBNBrightGreen text-BBNDarkGreen text-[11px] font-bold flex items-center justify-center flex-shrink-0 tracking-wide">
                    {initials}
                </div>

                <span className="text-sm font-semibold text-BBNLightGreen flex-1 truncate">
                    {displayName}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-0.5">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-BBNDarkGreen/50 text-xs">
                        <span className="text-3xl opacity-30">
                            INSERT LOGO HERE
                        </span>
                        <span>No messages yet</span>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMine = msg.senderId === currentUserId;
                        return (
                            <div key={msg.messageId}>
                                {shouldShowDateLabel(messages, i) && (
                                    <div className="flex items-center gap-2 my-3">
                                        <div className="flex-1 h-px bg-BBNDarkAvocadoGreen/50" />
                                        <span className="text-[10px] font-semibold tracking-widest uppercase text-BBNDarkGreen/50">
                                            {formatDateLabel(msg.created_at)}
                                        </span>
                                        <div className="flex-1 h-px bg-BBNDarkAvocadoGreen/50" />
                                    </div>
                                )}

                                <div
                                    className={`flex my-0.5 ${isMine ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`
                                        max-w-[75%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed
                                        shadow-sm break-words
                                        ${
                                            isMine
                                                ? "bg-BBNDarkGreen text-BBNLightGreen rounded-br-[4px]"
                                                : "bg-white text-black border border-BBNDarkAvocadoGreen/50 rounded-bl-[4px]"
                                        }
                                    `}
                                    >
                                        <p className="mb-1">{msg.text}</p>
                                        <p
                                            className={`text-[9.5px] opacity-50 font-medium ${isMine ? "text-right" : "text-left"}`}
                                        >
                                            {formatTime(msg.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 border-t border-BBNDarkAvocadoGreen/50 bg-white flex-shrink-0">
                <input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Type a message…"
                    className="flex-1 bg-BBNLightGreen border border-BBNDarkAvocadoGreen/50 rounded-full px-4 py-2 text-[13px] text-black placeholder-BBNDarkGreen/50 outline-none focus:border-BBNBrightGreen transition-colors"
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    aria-label="Send"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-BBNDarkGreen text-BBNBrightGreen shadow-md hover:bg-BBNDarkAvocadoGreen active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <Send size={14} strokeWidth={2.2} />
                </button>
            </div>
        </div>
    );
}

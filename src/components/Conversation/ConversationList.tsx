import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuthContext";
import { UserController } from "../../services/UserController";
import { db } from "../../_db_controller/init";
import type { Conversation } from "../../types/conversation.types";
import type { User } from "../../types/User";
import type { Timestamp } from "firebase/firestore";

type Props = {
    conversations: Conversation[];
    currentUserId: string;
};

type ResolvedConvo = {
    conversation: Conversation;
    otherUser: User | null;
};

const userController = new UserController(db);

/**
 * Formts a timestamp into a preview string
 *
 * Used for chat previews
 *
 * @param ts - Firestore timestamp
 * @returns  A calendar time string for displaying
 */
function formatPreviewTime(ts: Timestamp | undefined): string {
    if (!ts) return "";
    const date = ts.toDate();
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ConversationList({ conversations, currentUserId }: Props) {
    const { setSelectedConvoId, setSelectedConvoUserId } = useAuth();
    const [resolved, setResolved] = useState<ResolvedConvo[]>([]);

    useEffect(() => {
        if (!conversations.length) return;

        const resolve = async () => {
            const results = await Promise.all(
                conversations.map(async (c) => {
                    const otherId = c.participantIds.find(
                        (id) => id !== currentUserId,
                    );
                    const otherUser = otherId
                        ? await userController.getUserById(otherId)
                        : null;
                    return { conversation: c, otherUser };
                }),
            );
            results.sort((a, b) => {
                const aTs = a.conversation.last_message_at?.toMillis() ?? 0;
                const bTs = b.conversation.last_message_at?.toMillis() ?? 0;
                return bTs - aTs;
            });
            setResolved(results);
        };

        resolve().catch(console.error);
    }, [conversations, currentUserId]);

    if (resolved.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-BBNDarkGreen text-sm">
                <span className="text-4xl opacity-30">INSERT LOGO HERE</span>
                <span>No conversations yet</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full overflow-y-auto">
            {resolved.map(({ conversation: c, otherUser }) => {
                const initials = otherUser
                    ? `${otherUser.first_name[0]}${otherUser.last_name[0]}`.toUpperCase()
                    : "??";
                const displayName = otherUser
                    ? `${otherUser.first_name} ${otherUser.last_name}`
                    : "Unknown user";
                const otherUserId = otherUser ? otherUser.uid : "";

                return (
                    <button
                        key={c.conversationId}
                        onClick={() => {
                            setSelectedConvoId(c.conversationId);
                            setSelectedConvoUserId(otherUserId);
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left border-b border-BBNDarkAvocadoGreen/50 hover:bg-BBNLightGreen transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-BBNDarkGreen text-BBNBrightGreen text-xs font-semibold flex items-center justify-center flex-shrink-0 tracking-wide">
                            {initials}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-BBNDarkAvocadoGreen truncate">
                                {displayName}
                            </p>
                            <p className="text-xs text-BBNDarkGreen truncate">
                                {c.last_message ?? "No messages yet"}
                            </p>
                        </div>

                        <span className="text-[11px] text-BBNDarkAvocadoGreen flex-shrink-0 self-start pt-0.5">
                            {formatPreviewTime(c.last_message_at)}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

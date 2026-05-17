import { MessageCircle, X } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuthContext";
import { ConversationController } from "../../services/ConversationController";
import { db } from "../../_db_controller/init";
import { ConversationList } from "./ConversationList";
import ConversationMessages from "./ConversationMessages";
import type { Conversation } from "../../types/conversation.types";

export default function ConversationButton() {
    const {
        openConvoList,
        setOpenConvoList,
        dbUser,
        selectedConvoId,
        setSelectedConvoId,
    } = useAuth();

    const [conversations, setConversations] = useState<Conversation[]>([]);

    const conversationController = useMemo(
        () => new ConversationController(db),
        [],
    );

    useEffect(() => {
        if (!dbUser?.uid) return;
        conversationController
            .getUserConversation(dbUser.uid)
            .then(setConversations)
            .catch(console.error);
    }, [conversationController, dbUser]);

    const handleClose = () => {
        setOpenConvoList(false);
        setSelectedConvoId("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end">
            {openConvoList ? (
                <div
                    className="
                    flex flex-col overflow-hidden
                    w-[440px] h-[560px] rounded-2xl
                    bg-BBNAmnesiacWhite shadow-2xl
                    max-sm:fixed max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:rounded-t-2xl"
                >
                    <div className="flex items-center justify-between px-4 py-3 bg-BBNDarkGreen flex-shrink-0">
                        <span className="text-[15px] text-BBNBrightGreen tracking-wide">
                            {"Messages"}
                        </span>
                        <button
                            onClick={handleClose}
                            aria-label="Close"
                            className="flex items-center justify-center w-7 h-7 rounded-full bg-BBNDarkAvocadoGreen text-BBNLightGreen hover:bg-BBNLightGreen hover:text-BBNDarkAvocadoGreen"
                        >
                            <X size={14} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {selectedConvoId === "" && dbUser ? (
                            <ConversationList
                                conversations={conversations}
                                currentUserId={dbUser.uid}
                            />
                        ) : (
                            <ConversationMessages />
                        )}
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setOpenConvoList(true)}
                    aria-label="Open messages"
                    className="flex items-center justify-center
                        w-14 h-14 rounded-full
                        bg-BBNDarkGreen text-BBNBrightGreen
                        shadow-xl hover:scale-105"
                >
                    <MessageCircle size={24} strokeWidth={1.8} />
                </button>
            )}
        </div>
    );
}

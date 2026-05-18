import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConversationController } from "../../services/ConversationController";
import { db } from "../../_db_controller/init";
import { useAuth } from "../../auth/useAuthContext";

export type Match = {
    id: string;
    name: string;
    title: string;
    company: string;
    matchPercent: number;
    avatarUrl: string;
    isFavourite?: boolean;
};

type Props = {
    match: Match;
};

const conversationController = new ConversationController(db);

export default function MatchCard({ match }: Props) {
    const [fav, setFav] = useState(Boolean(match.isFavourite));
    const navigate = useNavigate();
    const [starting, setStarting] = useState(false);

    const { dbUser, setOpenConvoList, setSelectedConvoId } = useAuth();

    const handleMessageClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!dbUser?.uid || starting) return;

        try {
            setStarting(true);
            const convo = await conversationController.createConversation(
                    dbUser.uid,
                    match.id,
                );

            setSelectedConvoId(convo.conversationId);
            setOpenConvoList(true);
        } catch (err) {
            console.error("Failed to open conversation:", err);
        } finally {
            setStarting(false);
        }
    };

    return (
        <span
            onClick={() => navigate(`/mentor-profile`)}
            className="relative w-full rounded-2xl border border-[#d4e5c3] bg-white p-6 text-center hover:border-[#7a9b5c] hover:shadow-[0_6px_20px_rgba(45,58,31,0.1)] transition-all duration-200 group"
        >
            {/* Favourite heart */}
            <button
                type="button"
                aria-label="Toggle favourite"
                onClick={(e) => {
                    e.stopPropagation();
                    setFav((v) => !v);
                }}
                className="absolute right-4 top-4 text-lg transition-transform hover:scale-110"
            >
                <span className={fav ? "text-[#7a9b5c]" : "text-[#c5dbb0]"}>
                    ♥
                </span>
            </button>

            <button
                type="button"
                aria-label="Message this person"
                onClick={handleMessageClick}
                disabled={starting}
                className="absolute right-4 top-12 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <MessageCircle
                    size={20}
                    strokeWidth={1.8}
                    className={`transition-colors ${starting ? "text-[#c5dbb0]" : "text-[#283618] hover:text-[#7a9b5c]"}`}
                />
            </button>

            {/* Avatar */}
            <div className="inline-flex items-center mx-auto mt-2 h-24 w-24 overflow-hidden rounded-full border-2 border-[#d4e5c3] bg-[#e8f3dd] group-hover:border-[#7a9b5c] transition-colors">
                <img
                    src={match.avatarUrl}
                    alt={match.name}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="mt-4">
                <p className="text-sm font-semibold text-[#2d3a1f]">
                    {match.name}
                </p>
                <p className="mt-1.5 text-[11px] leading-4 text-[#7a9b5c]">
                    {match.title} at {match.company}
                </p>
            </div>

            {/* Match percent badge */}
            <div className="mt-5 flex justify-center">
                <span className="rounded-full bg-[#e8f3dd] border border-[#c5dbb0] px-4 py-1 text-[11px] font-semibold text-[#3d4a2b]">
                    {match.matchPercent}% Match
                </span>
            </div>
        </span>
    );
}

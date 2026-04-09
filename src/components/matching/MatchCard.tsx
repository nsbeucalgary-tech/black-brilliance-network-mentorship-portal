import { useState } from "react";

export type Match = {
    id: string;
    name: string;
    title: string;
    company?: string;
    location?: string;
    matchPercent: number;
    avatarUrl?: string;
    initials?: string;
    isFavourite?: boolean;
    statusLabel?: string;
    primaryActionLabel?: string;
    primaryActionDisabled?: boolean;
    primaryActionLoading?: boolean;
    onPrimaryAction?: () => void;
    secondaryActionLabel?: string;
    secondaryActionDisabled?: boolean;
    onSecondaryAction?: () => void;
    onToggleFavourite?: () => void;
    onViewProfile?: () => void;
};

type Props = {
    match: Match;
};

export default function MatchCard({ match }: Props) {
    const [fav, setFav] = useState(Boolean(match.isFavourite));
    const summaryLine = [match.title, match.company].filter(Boolean).join(
        match.company ? " at " : "",
    );
    const isFavourite = match.onToggleFavourite ? Boolean(match.isFavourite) : fav;

    return (
        <article
            className={[
                "relative flex h-full min-h-[430px] w-full flex-col items-center rounded-2xl border border-[#d4e5c3] bg-white p-8 text-center transition-all duration-200 group hover:border-[#7a9b5c] hover:shadow-[0_6px_20px_rgba(45,58,31,0.1)]",
                match.onViewProfile ? "cursor-pointer" : "",
            ].join(" ")}
            onClick={match.onViewProfile}
            onKeyDown={(event) => {
                if (!match.onViewProfile) return;
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    match.onViewProfile();
                }
            }}
            role={match.onViewProfile ? "button" : undefined}
            tabIndex={match.onViewProfile ? 0 : undefined}
        >
            {/* Favourite heart */}
            <button
                type="button"
                aria-label="Toggle favourite"
                onClick={(e) => {
                    e.stopPropagation();
                    if (match.onToggleFavourite) {
                        match.onToggleFavourite();
                        return;
                    }
                    setFav((v) => !v);
                }}
                className="absolute right-4 top-4 text-lg transition-transform hover:scale-110"
            >
                <span className={isFavourite ? "text-[#7a9b5c]" : "text-[#c5dbb0]"}>
                    ♥
                </span>
            </button>

            {/* Avatar */}
            <div className="mx-auto mt-2 inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[#d4e5c3] bg-[#e8f3dd] transition-colors group-hover:border-[#7a9b5c]">
                {match.avatarUrl ? (
                    <img
                        src={match.avatarUrl}
                        alt={match.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-2xl font-bold text-[#2d3a1f]">
                        {match.initials ?? "?"}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="mt-5 flex min-h-[84px] w-full max-w-[220px] flex-col items-center justify-start">
                <p className="text-[15px] font-semibold text-[#2d3a1f]">
                    {match.name}
                </p>
                {summaryLine && (
                    <p className="mt-2 text-[11px] leading-4 text-[#7a9b5c]">
                        {summaryLine}
                    </p>
                )}
                {match.location && (
                    <p className="mt-1 text-[11px] leading-4 text-[#9aad8a]">
                        {match.location}
                    </p>
                )}
            </div>

            {/* Match percent badge */}
            <div className="mt-6 flex justify-center">
                <span className="rounded-full bg-[#e8f3dd] border border-[#c5dbb0] px-4 py-1 text-[11px] font-semibold text-[#3d4a2b]">
                    {match.matchPercent}% Match
                </span>
            </div>

            {match.statusLabel && (
                <p className="mt-4 min-h-[20px] text-xs font-medium text-[#7a9b5c]">
                    {match.statusLabel}
                </p>
            )}

            {(match.primaryActionLabel || match.secondaryActionLabel) && (
                <div className="mt-auto flex w-full flex-col gap-2 pt-6">
                    {match.primaryActionLabel && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                match.onPrimaryAction?.();
                            }}
                            disabled={
                                match.primaryActionDisabled ||
                                match.primaryActionLoading
                            }
                            className="w-full rounded-xl bg-[#2d3a1f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3d4a2b] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {match.primaryActionLoading
                                ? "Working..."
                                : match.primaryActionLabel}
                        </button>
                    )}

                    {match.secondaryActionLabel && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                match.onSecondaryAction?.();
                            }}
                            disabled={match.secondaryActionDisabled}
                            className="w-full rounded-xl border border-[#c5dbb0] bg-white px-4 py-2.5 text-sm font-semibold text-[#3d4a2b] transition-colors hover:bg-[#e8f3dd] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {match.secondaryActionLabel}
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}

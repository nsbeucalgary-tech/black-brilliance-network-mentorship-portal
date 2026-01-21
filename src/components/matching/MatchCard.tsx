import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

/** Profile card button; navigates to /profile/:id. */
export default function MatchCard({ match }: Props) {
  const [fav, setFav] = useState(Boolean(match.isFavourite));
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/profile/${match.id}`)}
      className="relative w-full rounded-lg border border-neutral-200 bg-white p-6 text-center hover:border-neutral-300 transition"
    >
      <button
        type="button"
        aria-label="Toggle favourite"
        onClick={(e) => {
          e.stopPropagation();
          setFav((v) => !v);
        }}
        className="absolute right-4 top-4 text-lg"
      >
        <span className={fav ? "text-BBNDarkGreen" : "text-neutral-300"}>♥</span>
      </button>

      <div className="mx-auto mt-2 h-24 w-24 overflow-hidden rounded-full bg-neutral-200">
        <img src={match.avatarUrl} alt={match.name} className="h-full w-full object-cover" />
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-neutral-900">{match.name}</p>
        <p className="mt-2 text-[11px] leading-4 text-neutral-400">
          {match.title} at {match.company}
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <span className="rounded-full bg-[#eaf2df] px-4 py-1 text-[11px] font-medium text-[#3a4a2a]">
          {match.matchPercent}% Match
        </span>
      </div>
    </button>
  );
}

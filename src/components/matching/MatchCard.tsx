import { useState } from "react";

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
  const [showTestPopup, setShowTestPopup] = useState(false);

  return (
    <>
        <button
        type="button"
        onClick={() => setShowTestPopup(true)}
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
            <span className={fav ? "text-red-400" : "text-neutral-300"}>♥</span>
        </button>

        <div className="inline-flex items-center !m-5 mx-auto mt-2 h-24 w-24 overflow-hidden rounded-full bg-neutral-200">
            <img src={match.avatarUrl} alt={match.name} className="h-full w-full object-cover" />
        </div>

        <div className="mt-5">
            <p className="text-sm font-semibold text-neutral-900">{match.name}</p>
            <p className="mt-2 text-[11px] leading-4 text-neutral-400">
            {match.title} at {match.company}
            </p>
        </div>

        <div className="mt-6 flex justify-center">
            <span className="!mb-2 rounded-full bg-[#eaf2df] px-4 text-[11px] font-medium text-[#3a4a2a]">
            {match.matchPercent}% Match
            </span>
        </div>
        </button>
            
            
        {showTestPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-center">
                    <div className="!mt-3 flex flex-col items-center text-center">
                        <img
                            src={match.avatarUrl}
                            alt={match.name}
                            className="h-24 w-24 rounded-full object-cover border-2 border-[#d4e5c3]"
                        />

                        <h2 className="mt-4 text-xl font-semibold text-[#2d3a1f]">
                            {match.name}
                        </h2>

                        <p className="mt-1 text-sm text-[#7a9b5c]">
                            {match.title}
                        </p>

                        <p className="text-sm text-gray-600">
                            {match.company}
                        </p>

                        <p className="!mt-3 !text-md text-gray-700 font-style: italic">
                            About the Mentor
                        </p>
                        <p className="!mx-4 !my-2 text-sm text-gray-400">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                            do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowTestPopup(false)}
                        className="!mt-3 !mb-3 !px-2 rounded-lg bg-[#7a9b5c] px-4 py-2 text-white !text-sm hover:opacity-90"
                    >
                        Done
                    </button>
                </div>
            </div>
        )}
    </>
  );
}

import MatchCard, { type Match } from "./MatchCard";

type Props = {
  matches: Match[];
  onToggleFavourite: (id: string) => void;
};

/** 4-column grid on desktop with spacing similar to the reference. */
export default function MatchesGrid({ matches, onToggleFavourite }: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {matches.map((m) => (
        <MatchCard
          key={m.id}
          match={m}
          isFavourite={Boolean(m.isFavourite)}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}

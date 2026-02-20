type Props = {
  label: string;
  onClick?: () => void;
};

/** Pill chip button (UI only). */
export default function FilterChip({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-full max-w-42 sm:w-42 sm:max-w-none h-4 inline-flex gap-2 rounded-full bg-BBNDarkGreen !px-4 py-6 text-xs font-semibold text-white hover:opacity-90"
    >
      <span className="truncate">{label}</span>
      <span className="text-white/80">▾</span>
    </button>
  );
}

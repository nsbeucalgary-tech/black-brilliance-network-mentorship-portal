type Props = {
    label: string;
    onClick?: () => void;
};

export default function FilterChip({ label, onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2d3a1f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3d4a2b] transition-colors whitespace-nowrap"
        >
            <span className="truncate max-w-[120px]">{label}</span>
            <span className="text-[#aad576] text-[10px]">▾</span>
        </button>
    );
}

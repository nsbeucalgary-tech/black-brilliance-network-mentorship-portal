import { FiBell } from 'react-icons/fi';

type BellButtonProps = {
    onClick?: () => void;
};

export default function BellButton({ onClick }: BellButtonProps) {
    return (
        <button
            type="button"
            aria-label="Notifications placeholder"
            onClick={onClick}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9decf] bg-white text-BBNDarkGreen shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
            <FiBell size={20} />
        </button>
    );
}
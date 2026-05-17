import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
type Props = {
    label: string;
    onClick?: () => void;
};

export default function FilterChip({ label, onClick }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
        onClick?.();
    };
    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-BBNDarkGreen px-3 py-1 text-[11px] font-semibold text-white hover:bg-BBNDarkAvocadoGreen transition-colors whitespace-nowrap sm:gap-1.5 sm:text-xs"
        >
            <span>{label}</span>
            <span className="text-BBNBrightGreen text-[9px] sm:text-[10px]" aria-hidden>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
        </button>
    );
}

import { FiMail } from 'react-icons/fi';

type MailButtonProps = {
    onClick?: () => void;
};

export default function MailButton({ onClick }: MailButtonProps) {
    return (
        <button
            type="button"
            aria-label="Mail placeholder"
            onClick={onClick}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9decf] bg-white text-BBNDarkGreen shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
            <FiMail size={20} />
        </button>
    );
}
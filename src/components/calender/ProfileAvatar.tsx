import { FiUser } from 'react-icons/fi';

type ProfileAvatarProps = {
    onClick?: () => void;
    imageUrl?: string;
};

export default function ProfileAvatar({
                                          onClick,
                                          imageUrl
                                      }: ProfileAvatarProps) {
    return (
        <button
            type="button"
            aria-label="Profile placeholder"
            onClick={onClick}
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#d9decf] bg-white text-BBNDarkGreen shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                />
            ) : (
                <FiUser size={20} />
            )}
        </button>
    );
}
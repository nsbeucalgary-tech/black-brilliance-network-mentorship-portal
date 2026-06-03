type ProfileIncompleteBannerProps = {
    onCompleteProfile?: () => void;
};

export default function ProfileIncompleteBanner({
    onCompleteProfile,
}: ProfileIncompleteBannerProps) {
    return (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-BBNBrightGreen bg-BBNLightGreen px-4 py-3 xl:mb-8 xl:px-5 xl:py-4">
            <p className="text-sm font-medium text-BBNDarkGreen xl:text-base">
                Your profile is incomplete. Add title, location, and bio.
            </p>
            {onCompleteProfile && (
                <button
                    type="button"
                    onClick={onCompleteProfile}
                    className="rounded-full bg-BBNDarkGreen px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-BBNDarkAvocadoGreen xl:px-5 xl:py-2 xl:text-sm"
                >
                    Complete profile
                </button>
            )}
        </div>
    );
}

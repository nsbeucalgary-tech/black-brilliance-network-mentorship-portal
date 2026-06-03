import { MapPin, Pencil, Save, X } from "lucide-react";

type ProfileHeaderProps = {
    initials: string;
    name: string;
    pronouns?: string;
    title?: string;
    location?: string;
    canEdit: boolean;
    isEditing: boolean;
    isSaving: boolean;
    onStartEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
};

export default function ProfileHeader({
    initials,
    name,
    pronouns,
    title,
    location,
    canEdit,
    isEditing,
    isSaving,
    onStartEdit,
    onSave,
    onCancel,
}: ProfileHeaderProps) {
    return (
        <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row xl:mb-10 xl:gap-8">
            <div className="flex items-start gap-4 xl:gap-5">
                <div className="grid h-15 w-15 sm:h-20 sm:w-20 place-items-center rounded-full bg-BBNDarkGreen text-xl font-semibold text-white xl:h-24 xl:w-24 xl:text-2xl">
                    {initials}
                </div>
                <div className="space-y-1 xl:space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-extrabold sm:text-3xl xl:text-4xl">
                            {name || "Unnamed User"}
                        </h1>
                        {pronouns && (
                            <span className="rounded-xl border border-BBNBrightGreen bg-BBNLightGreen px-2 py-1 text-xs font-semibold text-BBNDarkGreen xl:px-3 xl:py-1.5 xl:text-sm">
                                {pronouns}
                            </span>
                        )}
                    </div>
                    {title && (
                        <p className="text-sm font-semibold text-BBNDarkAvocadoGreen sm:text-base xl:text-lg">
                            {title}
                        </p>
                    )}
                    {location && (
                        <p className="flex items-center gap-1 text-sm text-BBNDarkAvocadoGreen xl:gap-1.5 xl:text-base">
                            <MapPin size={16} aria-hidden />
                            {location}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {canEdit && !isEditing && (
                    <>
                    <button
                        type="button"
                        onClick={onStartEdit}
                        className="group inline-flex items-center gap-2 rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 text-sm font-semibold text-BBNDarkGreen hover:bg-BBNLightGreen xl:px-4 xl:py-2.5 xl:text-base"
                    >
                        <Pencil size={16} aria-hidden className="group-hover:scale-125 transition-transform duration-200"/>
                        Edit profile
                    </button>
                    </>
                )}
                {isEditing && (
                    <>
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={isSaving}
                            className="group inline-flex items-center gap-2 rounded-lg bg-BBNDarkGreen px-3 py-2 text-sm font-semibold text-white hover:bg-BBNDarkAvocadoGreen disabled:opacity-60 xl:px-4 xl:py-2.5 xl:text-base"
                        >
                            <Save size={16} aria-hidden  className="group-hover:scale-125 transition-transform duration-200"/>
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="group inline-flex items-center gap-2 rounded-lg border border-BBNBrightGreen bg-white px-3 py-2 text-sm font-semibold text-BBNDarkAvocadoGreen hover:bg-BBNLightGreen xl:px-4 xl:py-2.5 xl:text-base"
                        >
                            <X size={16} aria-hidden  className="group-hover:scale-125 transition-transform duration-200"/>
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

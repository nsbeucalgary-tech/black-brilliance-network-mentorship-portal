import { useEffect, useMemo, useState } from "react";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import type { UpdateUserPayload, User } from "../../types/User";
import { getInitials } from "../../utils";
import ProfileContent from "./ProfileContent";
import ProfileEditForm from "./ProfileEditForm";
import ProfileHeader from "./ProfileHeader";
import ProfileIncompleteBanner from "./ProfileIncompleteBanner";
import ProfileSidebar from "./ProfileSidebar";
import type { EditableFields, ProfileMode } from "./types";
import {
    profileName,
    stringifyExperiencePeriod,
    toEditableFields,
    toProfileLinks,
    withHttps,
} from "./profileUtils";

type ProfileProps = {
    profile: User;
    mode: ProfileMode;
    onSave?: (payload: UpdateUserPayload) => Promise<void>;
    onCompleteProfile?: () => void;
};

export default function Profile({
    profile,
    mode,
    onSave,
    onCompleteProfile,
}: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [fields, setFields] = useState<EditableFields>(() => toEditableFields(profile));

    useEffect(() => {
        setFields(toEditableFields(profile));
    }, [profile]);

    const name = profileName(profile);
    const initials = getInitials(name || profile.email || "User");
    const canEdit = mode === "self";
    const links = useMemo(() => toProfileLinks(profile), [profile]);
    const experiences = useMemo(() => profile.experiences ?? [], [profile]);
    const isIncomplete = !profile.bio || !profile.title || !profile.location;

    async function handleSave() {
        if (!onSave) return;
        /* LinkedIn and website are optional fields */
        const hasMissingTopLevelField =
            !fields.pronouns.trim() ||
            !fields.title.trim() ||
            !fields.location.trim() ||
            !fields.bio.trim() ||
            fields.interests.length === 0;

        const hasIncompleteExperience = fields.experiences.some((exp) => {
            const hasAnyExperienceContent = Boolean(
                exp.company.trim() ||
                    exp.role.trim() ||
                    exp.start_date.trim() ||
                    exp.end_date.trim(),
            );

            if (!hasAnyExperienceContent) return false;

            const hasInvalidDateOrder =
                !exp.is_present &&
                exp.start_date.trim() &&
                exp.end_date.trim() &&
                exp.start_date > exp.end_date;

            return (
                !exp.company.trim() ||
                !exp.role.trim() ||
                !exp.start_date.trim() ||
                (!exp.is_present && !exp.end_date.trim()) ||
                hasInvalidDateOrder
            );
        });

        if (hasMissingTopLevelField || hasIncompleteExperience) {
            toast.error("Please ensure all fields are filled before saving.");
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                pronouns: fields.pronouns.trim() || undefined,
                title: fields.title.trim() || undefined,
                location: fields.location.trim() || undefined,
                bio: fields.bio.trim() || undefined,
                website_url: fields.website_url.trim()
                    ? withHttps(fields.website_url.trim())
                    : undefined,
                linkedin_url: fields.linkedin_url.trim()
                    ? withHttps(fields.linkedin_url.trim())
                    : undefined,
                interests: fields.interests,
                experiences: fields.experiences
                    .map((exp) => ({
                        company: exp.company.trim(),
                        role: exp.role.trim(),
                        period: stringifyExperiencePeriod(
                            exp.start_date,
                            exp.end_date,
                            exp.is_present,
                        ),
                    }))
                    .filter(
                        (exp) =>
                            exp.company.length > 0 ||
                            exp.role.length > 0 ||
                            exp.period.length > 0,
                    ),
            });
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    }

    function resetFields() {
        setFields(toEditableFields(profile));
        setIsEditing(false);
    }

    return (
        <div className="bg-white px-4 py-6 text-BBNDarkGreen sm:px-6 lg:px-10 xl:px-14 xl:py-8">
            {canEdit && isIncomplete && !isEditing && (
                <ProfileIncompleteBanner onCompleteProfile={onCompleteProfile} />
            )}

            <ProfileHeader
                initials={initials}
                name={name}
                pronouns={profile.pronouns}
                title={profile.title}
                location={profile.location}
                canEdit={canEdit}
                isEditing={isEditing}
                isSaving={isSaving}
                onStartEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={resetFields}
            />

            {isEditing ? (
                <ProfileEditForm fields={fields} setFields={setFields} />
            ) : (
                <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
                    <ProfileSidebar links={links} interests={profile.interests ?? []} />
                    <ProfileContent bio={profile.bio} experiences={experiences} />
                </div>
            )}
        </div>
    );
}

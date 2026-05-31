import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../_db_controller/init";
import { useAuth } from "../../auth/useAuthContext";
import { UserController } from "../../services/UserController";
import { UserRole, type UserExperience } from "../../types/User";
import type { Role } from "./Types";

const userController = new UserController(db);

export function useOnboardingForm() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2>(1);
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 2 fields
    const [pronouns, setPronouns] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [title, setTitle] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    // Experience fields
    const [experiences, setExperiences] = useState<UserExperience[]>([]);
    const [expCompany, setExpCompany] = useState("");
    const [expRole, setExpRole] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isCurrent, setIsCurrent] = useState(false);

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : prev.length < 8
                  ? [...prev, interest]
                  : prev,
        );
    };

    const addExperience = () => {
        if (!expCompany || !expRole || !startDate) return;

        const period = `${startDate} - ${isCurrent ? "Present" : endDate}`;

        setExperiences((prev) => [
            ...prev,
            { company: expCompany, role: expRole, period },
        ]);

        setExpCompany("");
        setExpRole("");
        setStartDate("");
        setEndDate("");
        setIsCurrent(false);
    };

    const removeExperience = (index: number) => {
        setExperiences((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRoleSelect = (selected: Role) => {
        setRole(selected);
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!user || !role) return;
        setLoading(true);
        setError("");

        try {
            await userController.updateUser(user.uid, {
                role: role === "mentor" ? UserRole.MENTOR : UserRole.MENTEE,
                pronouns: pronouns || undefined,
                location: location || undefined,
                bio: bio || undefined,
                title: title || undefined,
                website_url: websiteUrl || undefined,
                linkedin_url: linkedinUrl || undefined,
                interests:
                    selectedInterests.length > 0
                        ? selectedInterests
                        : undefined,
                experiences: experiences.length > 0 ? experiences : undefined,
            });
            navigate("/dashboard");
        } catch (e) {
            console.error("[Onboarding] Failed to save profile:", e);
            setError("Failed to save your profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        // Step state
        step,
        setStep,
        role,
        handleRoleSelect,

        // Profile fields
        pronouns,
        setPronouns,
        location,
        setLocation,
        bio,
        setBio,
        title,
        setTitle,
        websiteUrl,
        setWebsiteUrl,
        linkedinUrl,
        setLinkedinUrl,
        selectedInterests,
        toggleInterest,

        // Experience fields
        experiences,
        expCompany,
        setExpCompany,
        expRole,
        setExpRole,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        isCurrent,
        setIsCurrent,
        addExperience,
        removeExperience,

        // Submission
        loading,
        error,
        handleSubmit,
    };
}

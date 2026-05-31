import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { useOnboardingForm } from "./useOnboardingForm";

export default function OnboardingPage() {
    const form = useOnboardingForm();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="border-b border-[#e8f3dd] px-8 py-4 flex items-center gap-3">
                <div className="flex h-8 w-8 gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#2d3a1f]" />
                    <div className="mt-2 h-2 w-2 rounded-full bg-[#2d3a1f]" />
                </div>
                <div className="text-base font-medium leading-tight">
                    <span className="block text-[#2d3a1f]">Black</span>
                    <span className="block text-[#7a9b5c]">Brilliance</span>
                </div>
            </header>

            {/* Progress bar */}
            <div className="h-1 bg-[#e8f3dd]">
                <div
                    className="h-full bg-[#2d3a1f] transition-all duration-500"
                    style={{ width: form.step === 1 ? "50%" : "100%" }}
                />
            </div>

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                {form.step === 1 ? (
                    <StepOne onSelect={form.handleRoleSelect} />
                ) : (
                    <StepTwo
                        role={form.role!}
                        pronouns={form.pronouns}
                        setPronouns={form.setPronouns}
                        location={form.location}
                        setLocation={form.setLocation}
                        bio={form.bio}
                        setBio={form.setBio}
                        title={form.title}
                        setTitle={form.setTitle}
                        websiteUrl={form.websiteUrl}
                        setWebsiteUrl={form.setWebsiteUrl}
                        linkedinUrl={form.linkedinUrl}
                        setLinkedinUrl={form.setLinkedinUrl}
                        selectedInterests={form.selectedInterests}
                        toggleInterest={form.toggleInterest}
                        experiences={form.experiences}
                        expCompany={form.expCompany}
                        setExpCompany={form.setExpCompany}
                        expRole={form.expRole}
                        setExpRole={form.setExpRole}
                        startDate={form.startDate}
                        setStartDate={form.setStartDate}
                        endDate={form.endDate}
                        setEndDate={form.setEndDate}
                        isCurrent={form.isCurrent}
                        setIsCurrent={form.setIsCurrent}
                        addExperience={form.addExperience}
                        removeExperience={form.removeExperience}
                        onBack={() => form.setStep(1)}
                        onSubmit={form.handleSubmit}
                        loading={form.loading}
                        error={form.error}
                    />
                )}
            </main>
        </div>
    );
}

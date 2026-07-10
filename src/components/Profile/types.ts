import type { Dispatch, SetStateAction } from "react";

export type ProfileMode = "self" | "mentor" | "other";

export type EditableFields = {
    pronouns: string;
    title: string;
    location: string;
    bio: string;
    website_url: string;
    linkedin_url: string;
    interests: string[];
    experiences: EditableExperience[];
};

export type ExperiencePeriod = {
    start_date: string;
    end_date: string;
    is_present: boolean;
};

export type EditableExperience = ExperiencePeriod & {
    company: string;
    role: string;
};

export type EditableFieldsSetter = Dispatch<SetStateAction<EditableFields>>;

type profileLinkType = "website" | "linkedin";

export type ProfileLink = {
    type: profileLinkType;
    label: string;
    href: string;
};
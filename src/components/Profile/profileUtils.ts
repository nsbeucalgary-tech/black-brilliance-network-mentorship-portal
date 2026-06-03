import type { User } from "../../types/User";
import type { EditableFields, ProfileLink } from "./types";

const MONTH_INPUT_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export function withHttps(url: string): string {
    if (!url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
}

export function profileName(profile: User): string {
    return [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
}

export function isValidMonthInput(value: string): boolean {
    return MONTH_INPUT_REGEX.test(value);
}

export function stringifyExperiencePeriod(
    startDate: string,
    endDate: string,
    isPresent: boolean,
): string {
    const normalizedStart = startDate.trim();
    const normalizedEnd = endDate.trim();

    if (!normalizedStart) return "";
    if (isPresent) return `${normalizedStart} - Present`;
    if (!normalizedEnd) return normalizedStart;
    return `${normalizedStart} - ${normalizedEnd}`;
}

export function parseExperiencePeriod(period: string): {
    start_date: string;
    end_date: string;
    is_present: boolean;
} {
    const normalized = period.trim();
    if (!normalized) {
        return { start_date: "", end_date: "", is_present: false };
    }

    const [rawStart = "", rawEnd = ""] = normalized.split(" - ", 2);
    const start = rawStart.trim();
    const end = rawEnd.trim();

    if (end.toLowerCase() === "present") {
        return {
            start_date: isValidMonthInput(start) ? start : "",
            end_date: "Present",
            is_present: true,
        };
    }

    return {
        start_date: isValidMonthInput(start) ? start : "",
        end_date: isValidMonthInput(end) ? end : "",
        is_present: false,
    };
}

export function toEditableFields(profile: User): EditableFields {
    return {
        pronouns: profile.pronouns ?? "",
        title: profile.title ?? "",
        location: profile.location ?? "",
        bio: profile.bio ?? "",
        website_url: profile.website_url ?? "",
        linkedin_url: profile.linkedin_url ?? "",
        interests: profile.interests ?? [],
        experiences: (profile.experiences ?? []).map((exp) => {
            const parsedPeriod = parseExperiencePeriod(exp.period ?? "");
            return {
                company: exp.company ?? "",
                role: exp.role ?? "",
                start_date: parsedPeriod.start_date,
                end_date: parsedPeriod.end_date,
                is_present: parsedPeriod.is_present,
            };
        }),
    };
}

export function toProfileLinks(profile: User): ProfileLink[] {
    return [
        profile.website_url
            ? { label: profile.website_url.replace(/^https?:\/\//, ""), href: profile.website_url, type: "website" }
            : null,
        profile.linkedin_url
            ? { label: profile.linkedin_url.replace(/^https?:\/\//, ""), href: profile.linkedin_url, type: "linkedin" }
            : null,
    ].filter(Boolean) as ProfileLink[];
}

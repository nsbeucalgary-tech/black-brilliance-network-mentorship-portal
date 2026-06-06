import type { User } from "../../types/User";
import type { UserExperience } from "../../types/User";
import type { EditableFields, ProfileLink } from "./types";
import type { EditableExperience, ExperiencePeriod } from "./types";

const MONTH_INPUT_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export function withHttps(url: string): string {
    if (!url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
}

export function profileName(profile: User): string {
    return [profile.first_name, profile.last_name].filter(Boolean).join(" ");
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

export function parseExperiencePeriod(period: string): ExperiencePeriod {
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

function monthToSortValue(month: string): number {
    if (!isValidMonthInput(month)) return Number.NEGATIVE_INFINITY;
    const [year, monthPart] = month.split("-").map(Number);
    return year * 12 + monthPart;
}

function compareByRecency(
    a: ExperiencePeriod,
    b: ExperiencePeriod,
): number {
    if (a.is_present !== b.is_present) {
        return a.is_present ? -1 : 1;
    }

    const startDiff =
        monthToSortValue(b.start_date) -
        monthToSortValue(a.start_date);

    if (startDiff !== 0) return startDiff;

    return (
        monthToSortValue(b.end_date) -
        monthToSortValue(a.end_date)
    );
}

export function sortEditableExperiences(
    experiences: EditableExperience[],
): EditableExperience[] {
    return [...experiences].sort(compareByRecency);
}

export function sortProfileExperiences(
    experiences: UserExperience[],
): UserExperience[] {
    return experiences
        .map((exp) => ({
            exp,
            parsed: parseExperiencePeriod(exp.period ?? ""),
        }))
        .sort((a, b) => compareByRecency(a.parsed, b.parsed))
        .map(({ exp }) => exp);
}

function toEditableExperience(exp: UserExperience): EditableExperience {
    const parsed = parseExperiencePeriod(exp.period ?? "");

    return {
        company: exp.company ?? "",
        role: exp.role ?? "",
        ...parsed,
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
        experiences: sortProfileExperiences(
            profile.experiences ?? [],
        ).map(toEditableExperience),
    };
}

export function toProfileLinks(profile: User): ProfileLink[] {
    const links: ProfileLink[] = [];

    if (profile.website_url) {
        links.push({
            label: profile.website_url.replace(/^https?:\/\//, ""),
            href: profile.website_url,
            type: "website",
        });
    }

    if (profile.linkedin_url) {
        links.push({
            label: profile.linkedin_url.replace(/^https?:\/\//, ""),
            href: profile.linkedin_url,
            type: "linkedin",
        });
    }

    return links;
}
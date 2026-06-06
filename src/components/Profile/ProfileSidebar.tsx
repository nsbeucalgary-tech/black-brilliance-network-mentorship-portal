import { Link as LinkIcon, Gem } from "lucide-react";
import type { ProfileLink, ProfileMode } from "./types";
import { withHttps } from "./profileUtils";

type ProfileSidebarProps = {
    links: ProfileLink[];
    interests: string[];
    role: ProfileMode;
};

export default function ProfileSidebar({ links, interests, role }: ProfileSidebarProps) {
    return (
        <aside className="space-y-6 xl:space-y-8">
            <section className="space-y-3 xl:space-y-4">
                <h2 className="text-base font-bold xl:text-xl">Links</h2>
                <div className="space-y-2">
                    {links.length === 0 && (
                        <p className="text-sm text-BBNDarkAvocadoGreen xl:text-base">No links added yet.</p>
                    )}
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={withHttps(link.href)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 break-all text-sm font-semibold text-BBNDarkGreen hover:underline xl:text-base"
                        >
                            <LinkIcon size={16} aria-hidden />
                            {link.type === "website" ? "Website" : "LinkedIn"}
                        </a>
                    ))}
                </div>
            </section>

            {interests.length > 0 && (
                <section className="space-y-3 xl:space-y-4">
                    {role === "self" && <h1 className="text-base font-bold text-BBNDarkGreen xl:text-xl">Interests</h1>}
                    {role === "mentor" && <div className="flex items-center gap-2">
                        <Gem aria-hidden className="text-black" />
                        <h1 className="text-base font-bold text-black xl:text-xl">Expertise</h1>
                        <span className="text-sm text-gray-500 xl:text-base">I can help with...</span>
                    </div>}
                    <div className="flex flex-wrap gap-2">
                        {interests.map((item) => (
                            <span
                                key={item}
                                className="rounded-2xl border border-BBNBrightGreen bg-BBNLightGreen px-3 py-1.5 text-xs font-semibold text-BBNDarkGreen xl:px-4 xl:py-2 xl:text-sm"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </aside>
    );
}

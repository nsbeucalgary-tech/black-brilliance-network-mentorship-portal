import { useMemo } from "react";

function Icon({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span className={`inline-flex h-5 w-5 items-center justify-center ${className}`}>
            {children}
        </span>
    );
}

function Star({ filled }: { filled: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 ${filled ? "fill-[#86a95f]" : "fill-[#dfe8d4]"}`}
            aria-hidden="true"
        >
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );
}

function CircleIcon({ label }: { label: string }) {
    return (
        <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.06)]"
            aria-label={label}
        >
            <span className="text-[#2e3b20] opacity-80">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M12 22a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2Zm6-6H6v-5a6 6 0 0 1 12 0v5Zm-2 0v-5a4 4 0 1 0-8 0v5h8Z"
                    />
                </svg>
            </span>
        </button>
    );
}

export default function DashboardPage() {
    const tasks = useMemo(
        () => [
            { title: "Plan out communication workshop", owner: "Colin Bobbins", date: "June 4, 2025", status: "Done" },
            { title: "Lorem ipsum dolor sit amet consect", owner: "Colin Bobbins", date: "June 8, 2025", status: "In progress" },
            { title: "Lorem ipsum dolor sit amet consect", owner: "Colin Bobbins", date: "June 9, 2025", status: "To do" },
            { title: "Lorem ipsum dolor sit amet consect", owner: "Colin Bobbins", date: "June 1, 2025", status: "To do" },
        ],
        [],
    );

    const statusPill = (status: string) => {
        if (status === "Done") {
            return "bg-[#7d925b] text-white";
        }
        if (status === "In progress") {
            return "bg-[#c7b07b] text-white";
        }
        return "bg-[#cfd7c6] text-[#2e3b20]";
    };

    return (
        <div className="min-h-dvh w-full bg-[#eef0ee] text-[#223018]">
            <div className="flex min-h-dvh w-full">
                {/* Sidebar */}
                <aside className="hidden w-[260px] shrink-0 px-7 py-8 md:block">
                    <div className="h-full rounded-3xl bg-gradient-to-b from-[#2f3c20] to-[#283318] px-6 py-7 text-white shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-8 w-8 flex-col gap-1">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span className="ml-3 h-2 w-2 rounded-full bg-white" />
                            </div>
                            <div className="leading-tight">
                                <div className="text-lg font-semibold">Black</div>
                                <div className="text-lg font-semibold text-[#a7c77f]">Brilliance</div>
                            </div>
                        </div>

                        <nav className="mt-10 space-y-2 text-[15px]">
                            <a
                                href="#"
                                className="flex items-center gap-3 rounded-xl bg-[#dbe8c9] px-4 py-3 font-semibold text-[#233116] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                            >
                                <Icon>
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                        <path
                                            fill="currentColor"
                                            d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z"
                                        />
                                    </svg>
                                </Icon>
                                Dashboard
                            </a>

                            {[
                                { label: "Calendar", icon: "calendar" },
                                { label: "Matchmaking", icon: "match" },
                                { label: "Newsletter", icon: "newsletter" },
                                { label: "Home", icon: "home" },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href="#"
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white"
                                >
                                    <Icon className="text-white/70">
                                        {item.icon === "calendar" && (
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                                <path
                                                    fill="currentColor"
                                                    d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm13 8H6v10h14V10ZM6 8h14V6H6v2Z"
                                                />
                                            </svg>
                                        )}
                                        {item.icon === "match" && (
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                                <path
                                                    fill="currentColor"
                                                    d="M7 5h10v2H7V5Zm-2 4h14v2H5V9Zm2 4h10v2H7v-2Zm-2 4h14v2H5v-2Z"
                                                />
                                            </svg>
                                        )}
                                        {item.icon === "newsletter" && (
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                                <path
                                                    fill="currentColor"
                                                    d="M20 4H4v16h16V4Zm-2 4-6 4-6-4V6l6 4 6-4v2Z"
                                                />
                                            </svg>
                                        )}
                                        {item.icon === "home" && (
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                                <path
                                                    fill="currentColor"
                                                    d="M12 3 3 10v11h6v-7h6v7h6V10l-9-7Z"
                                                />
                                            </svg>
                                        )}
                                    </Icon>
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-auto pt-8">
                            <div className="mt-10 space-y-2 text-[15px]">
                                {["Settings", "Log out"].map((label) => (
                                    <a
                                        key={label}
                                        href="#"
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white"
                                    >
                                        <Icon className="text-white/60">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                                <path
                                                    fill="currentColor"
                                                    d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.1 7.1 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.83 14.5a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.3.6.22l2.39-.96c.51.4 1.05.71 1.63.94l.36 2.54c.04.24.25.42.49.42h3.8c.24 0 .45-.18.49-.42l.36-2.54c.58-.23 1.12-.54 1.63-.94l2.39.96c.22.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.56ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
                                                />
                                            </svg>
                                        </Icon>
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 px-8 py-7 md:px-8 md:py-8 lg:px-10">
                    {/* Top bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="w-full max-w-[620px]">
                                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.06)]">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#90a27b]" aria-hidden="true">
                                        <path
                                            fill="currentColor"
                                            d="M10 2a8 8 0 1 1 5.29 14.02l4.35 4.35-1.42 1.42-4.35-4.35A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"
                                        />
                                    </svg>
                                    <input
                                        className="w-full bg-transparent text-[15px] text-[#29361b] placeholder:text-[#c2c9bd] focus:outline-none"
                                        placeholder="Search Students"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CircleIcon label="Notifications" />
                            <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.06)]"
                                aria-label="Messages"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#2e3b20] opacity-80" aria-hidden="true">
                                    <path fill="currentColor" d="M4 4h16v12H7l-3 3V4Zm3 5h10v2H7V9Zm0-3h10v2H7V6Zm0 6h6v2H7v-2Z" />
                                </svg>
                            </button>
                            <button type="button" className="h-10 w-10 overflow-hidden rounded-full bg-white shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.06)]" aria-label="Profile">
                                <img
                                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=80"
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-7">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#27351a]">Dashboard</h1>

                        <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
                            {/* Profile card */}
                            <section className="rounded-3xl bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.06),0_25px_60px_rgba(0,0,0,0.06)]">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 overflow-hidden rounded-full bg-[#e9efe2]">
                                        <img
                                            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=128&q=80"
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[18px] font-semibold text-[#243015]">Temidayo Ope</div>
                                        <div className="mt-0.5 flex items-center gap-2 text-[12px] text-[#a5a9a2]">
                                            <span className="rounded-full bg-[#e8eee2] px-2 py-0.5 text-[#75806a]">Mentor</span>
                                            <span className="inline-flex items-center gap-1">
                                                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#aeb6aa]" aria-hidden="true">
                                                    <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                                                </svg>
                                                Calgary, AB
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[14px] font-semibold text-[#2b3a1b]">4,5</span>
                                            <div className="flex items-center gap-0.5" aria-label="Rating 4.5 out of 5">
                                                <Star filled />
                                                <Star filled />
                                                <Star filled />
                                                <Star filled />
                                                <Star filled={false} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Mentees card */}
                            <section className="rounded-3xl bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.06),0_25px_60px_rgba(0,0,0,0.06)]">
                                <h2 className="text-[16px] font-semibold text-[#2a381b]">Mentees</h2>
                                <div className="mt-4 h-[130px] rounded-2xl bg-[#fbfcfa]" />
                            </section>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
                            {/* Tasks */}
                            <section className="rounded-3xl bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.06),0_25px_60px_rgba(0,0,0,0.06)]">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-[16px] font-semibold text-[#2a381b]">My tasks</h2>
                                    <button
                                        type="button"
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7ece3] bg-white text-[#2a381b] shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-[#f7faf4]"
                                        aria-label="Add task"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                            <path fill="currentColor" d="M11 5h2v14h-2V5Zm-6 6h14v2H5v-2Z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-4 space-y-4">
                                    {tasks.map((t) => (
                                        <div key={t.title + t.date} className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="truncate text-[14px] font-medium text-[#253218]">{t.title}</div>
                                                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#9aa39a]">
                                                    <span className="inline-flex items-center gap-1">
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#c0c8be]" aria-hidden="true">
                                                            <path
                                                                fill="currentColor"
                                                                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-7 2-7 4.5V21h14v-2.5C19 16 16 14 12 14Z"
                                                            />
                                                        </svg>
                                                        {t.owner}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 flex-col items-end gap-2">
                                                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusPill(t.status)}`}>
                                                    {t.status}
                                                </span>
                                                <span className="text-[11px] text-[#9aa39a]">{t.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Schedule */}
                            <section className="rounded-3xl bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.06),0_25px_60px_rgba(0,0,0,0.06)]">
                                <h2 className="text-[16px] font-semibold text-[#2a381b]">My Schedule</h2>
                                <div className="mt-4">
                                    <div className="grid grid-cols-4 gap-3 px-2 text-[11px] font-semibold text-[#b4bcb2]">
                                        <div>Time</div>
                                        <div>Lesson</div>
                                        <div>Mentee</div>
                                        <div>Location</div>
                                    </div>
                                    <div className="mt-3 space-y-5">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="grid grid-cols-4 gap-3 px-2">
                                                <div className="h-4 border-b border-[#e7ece3]" />
                                                <div className="h-4 border-b border-[#e7ece3]" />
                                                <div className="h-4 border-b border-[#e7ece3]" />
                                                <div className="h-4 border-b border-[#e7ece3]" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}


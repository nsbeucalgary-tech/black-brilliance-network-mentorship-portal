import { useMemo, useState } from "react";

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

function TopIconButton({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#2f3c20] transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f3c20]/30"
            aria-label={label}
        >
            {children}
        </button>
    );
}

export default function DashboardPage() {
    const [activeNav, setActiveNav] = useState<
        "dashboard" | "calendar" | "matchmaking" | "newsletter" | "home" | "settings" | "logout"
    >("dashboard");

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
                <aside className="hidden shrink-0 px-6 py-6 md:block">
                    <div className="flex h-full overflow-hidden rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
                        {/* Icon rail */}
                        <div className="flex w-[72px] flex-col items-center bg-gradient-to-b from-[#2f3c20] to-[#283318] py-6">
                            <div className="flex flex-col items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span className="h-2 w-2 rounded-full bg-white opacity-80" />
                            </div>

                            <div className="mt-[72px] flex flex-1 flex-col items-center gap-6 text-white">
                                <button
                                    type="button"
                                    onClick={() => setActiveNav("dashboard")}
                                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                                        activeNav === "dashboard"
                                            ? "bg-[#1f2a12]"
                                            : "bg-transparent hover:bg-[#1f2a12]"
                                    }`}
                                    aria-label="Dashboard"
                                    aria-current={activeNav === "dashboard" ? "page" : undefined}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                        <path
                                            d="M4 5h16v10H4V5Zm6 14h4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveNav("calendar")}
                                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                                        activeNav === "calendar" ? "bg-[#1f2a12]" : "bg-transparent hover:bg-[#1f2a12]"
                                    }`}
                                    aria-label="Calendar"
                                    aria-current={activeNav === "calendar" ? "page" : undefined}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                        <path
                                            d="M7 4v2m10-2v2M5 8h14M6 6h12a2 2 0 0 1 2 2v12H4V8a2 2 0 0 1 2-2Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveNav("matchmaking")}
                                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                                        activeNav === "matchmaking"
                                            ? "bg-[#1f2a12]"
                                            : "bg-transparent hover:bg-[#1f2a12]"
                                    }`}
                                    aria-label="Matchmaking"
                                    aria-current={activeNav === "matchmaking" ? "page" : undefined}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                        <path
                                            d="M8.5 12.5 6 10l2.5-2.5a3 3 0 0 1 4.2 0l.3.3.3-.3a3 3 0 0 1 4.2 0L20 10l-2.5 2.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M9 13.5l2 2m2-2-2 2m-2.5-1.5 1.5 1.5M14 14l1.5 1.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveNav("newsletter")}
                                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                                        activeNav === "newsletter"
                                            ? "bg-[#1f2a12]"
                                            : "bg-transparent hover:bg-[#1f2a12]"
                                    }`}
                                    aria-label="Newsletter"
                                    aria-current={activeNav === "newsletter" ? "page" : undefined}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                        <path
                                            d="M5 6h14v12H5V6Zm0 2 7 5 7-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveNav("home")}
                                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                                        activeNav === "home" ? "bg-[#1f2a12]" : "bg-transparent hover:bg-[#1f2a12]"
                                    }`}
                                    aria-label="Home"
                                    aria-current={activeNav === "home" ? "page" : undefined}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                        <path
                                            d="M4 10.5 12 4l8 6.5V20H4v-9.5Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-auto flex flex-col items-center gap-6 pb-4 text-white">
                                {/* Settings */}
                                <button
                                    type="button"
                                    onClick={() => setActiveNav("settings")}
                                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                                        activeNav === "settings"
                                            ? "bg-[#1f2a12]"
                                            : "bg-transparent hover:bg-[#1f2a12]"
                                    }`}
                                    aria-label="Settings"
                                    aria-current={activeNav === "settings" ? "page" : undefined}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                        <path
                                            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                        <path
                                            d="M19.4 13a7.7 7.7 0 0 0 0-2l2-1.2-2-3.5-2.2.9a7.8 7.8 0 0 0-1.7-1l-.3-2.4H8.8l-.3 2.4c-.6.2-1.2.6-1.7 1L4.6 6.3l-2 3.5L4.6 11a7.7 7.7 0 0 0 0 2l-2 1.2 2 3.5 2.2-.9c.5.4 1.1.7 1.7 1l.3 2.4h6.4l.3-2.4c.6-.2 1.2-.6 1.7-1l2.2.9 2-3.5L19.4 13Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.2"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                {/* Log out */}
                                <button
                                    type="button"
                                    onClick={() => setActiveNav("logout")}
                                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                                        activeNav === "logout" ? "bg-[#1f2a12]" : "bg-transparent hover:bg-[#1f2a12]"
                                    }`}
                                    aria-label="Log out"
                                    aria-current={activeNav === "logout" ? "page" : undefined}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                                        <path
                                            d="M5 5h9v14H5V5Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M14 12h7m0 0-3-3m3 3-3 3"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Text panel */}
                        <div className="flex w-[220px] flex-col bg-white px-7 py-6 text-[#2a381b]">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 flex h-8 w-8 flex-col gap-1">
                                    <span className="h-2 w-2 rounded-full bg-[#2f3c20]" />
                                    <span className="ml-3 h-2 w-2 rounded-full bg-[#2f3c20]" />
                                </div>
                                <div className="leading-tight">
                                    <div className="text-lg font-semibold">Black</div>
                                    <div className="text-lg font-semibold text-[#a7c77f]">Brilliance</div>
                                </div>
                            </div>

                            <nav className="mt-10">
                                {/* Text items aligned to icon rail rows */}
                                <div className="flex flex-col gap-6 text-[18px]">
                                    <button
                                        type="button"
                                        onClick={() => setActiveNav("dashboard")}
                                        className={`h-11 w-full rounded-2xl text-left font-medium transition-all ${
                                            activeNav === "dashboard"
                                                ? "bg-[#2f3c20] pl-4 text-white"
                                                : "bg-transparent pl-0 text-[#2f3c20] hover:bg-[#2f3c20] hover:pl-2 hover:text-white"
                                        }`}
                                        aria-current={activeNav === "dashboard" ? "page" : undefined}
                                    >
                                        <span className="inline-flex h-11 items-center">Dashboard</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveNav("calendar")}
                                        className={`h-11 w-full rounded-2xl text-left font-medium transition-all ${
                                            activeNav === "calendar"
                                                ? "bg-[#2f3c20] pl-4 text-white"
                                                : "bg-transparent pl-0 text-[#2f3c20] hover:bg-[#2f3c20] hover:pl-2 hover:text-white"
                                        }`}
                                        aria-current={activeNav === "calendar" ? "page" : undefined}
                                    >
                                        <span className="inline-flex h-11 items-center">Calendar</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveNav("matchmaking")}
                                        className={`h-11 w-full rounded-2xl text-left font-medium transition-all ${
                                            activeNav === "matchmaking"
                                                ? "bg-[#2f3c20] pl-4 text-white"
                                                : "bg-transparent pl-0 text-[#2f3c20] hover:bg-[#2f3c20] hover:pl-2 hover:text-white"
                                        }`}
                                        aria-current={activeNav === "matchmaking" ? "page" : undefined}
                                    >
                                        <span className="inline-flex h-11 items-center">Matchmaking</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveNav("newsletter")}
                                        className={`h-11 w-full rounded-2xl text-left font-medium transition-all ${
                                            activeNav === "newsletter"
                                                ? "bg-[#2f3c20] pl-4 text-white"
                                                : "bg-transparent pl-0 text-[#2f3c20] hover:bg-[#2f3c20] hover:pl-2 hover:text-white"
                                        }`}
                                        aria-current={activeNav === "newsletter" ? "page" : undefined}
                                    >
                                        <span className="inline-flex h-11 items-center">Newsletter</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveNav("home")}
                                        className={`h-11 w-full rounded-2xl text-left font-medium transition-all ${
                                            activeNav === "home"
                                                ? "bg-[#2f3c20] pl-4 text-white"
                                                : "bg-transparent pl-0 text-[#2f3c20] hover:bg-[#2f3c20] hover:pl-2 hover:text-white"
                                        }`}
                                        aria-current={activeNav === "home" ? "page" : undefined}
                                    >
                                        <span className="inline-flex h-11 items-center">Home</span>
                                    </button>
                                </div>
                            </nav>

                            <div className="mt-auto flex flex-col gap-6 pb-4 text-[18px]">
                                <button
                                    type="button"
                                    onClick={() => setActiveNav("settings")}
                                    className={`h-11 w-full rounded-2xl text-left font-medium transition-all ${
                                        activeNav === "settings"
                                            ? "bg-[#2f3c20] pl-4 text-white"
                                            : "bg-transparent pl-0 text-[#2f3c20] hover:bg-[#2f3c20] hover:pl-2 hover:text-white"
                                    }`}
                                    aria-current={activeNav === "settings" ? "page" : undefined}
                                >
                                    <span className="inline-flex h-11 items-center">Settings</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveNav("logout")}
                                    className={`h-11 w-full rounded-2xl text-left font-medium transition-all ${
                                        activeNav === "logout"
                                            ? "bg-[#2f3c20] pl-4 text-white"
                                            : "bg-transparent pl-0 text-[#2f3c20] hover:bg-[#2f3c20] hover:pl-2 hover:text-white"
                                    }`}
                                    aria-current={activeNav === "logout" ? "page" : undefined}
                                >
                                    <span className="inline-flex h-11 items-center">Log out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 px-8 py-7 md:px-8 md:py-8 lg:px-10">
                    {/* Top bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="w-full max-w-[640px]">
                                <div className="flex items-center gap-2 rounded-md border border-[#e4e6e3] bg-white px-4 py-2">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4 text-[#c2c7bf]"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="11"
                                            cy="11"
                                            r="4.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                        />
                                        <path
                                            d="m14.5 14.5 3 3"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <input
                                        className="w-full bg-transparent text-[14px] text-[#7b827b] placeholder:text-[#b7bcb6] focus:outline-none"
                                        placeholder="Search Students"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <TopIconButton label="Notifications">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                    <path
                                        d="M12 22a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M18 16H6v-5a6 6 0 0 1 12 0v5Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </TopIconButton>
                            <TopIconButton label="Messages">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                    <path
                                        d="M4 6h16v12H7l-3 3V6Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4 7.5 12 13l8-5.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </TopIconButton>
                            <button
                                type="button"
                                className="h-9 w-9 overflow-hidden rounded-full bg-white shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.06)]"
                                aria-label="Profile"
                            >
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


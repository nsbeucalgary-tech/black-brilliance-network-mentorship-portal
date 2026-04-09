import {
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiSearch
} from 'react-icons/fi';

import BellButton from '../../components/calender/BellButton';
import MailButton from '../../components/calender/MailButton.tsx';
import ProfileAvatar from '../../components/calender/ProfileAvatar.tsx';
import AddNewEventModal from '../../components/calender/AddNewEventModal.tsx';

import {
    useCalendarController,
    HOURS,
    getDateKey,
    formatHour,
    isSameDay,
    isToday,
    getMinutesFromTime
} from '../../services/Calendarcontroller.ts';

import { db } from '../../_db_controller/init.ts';
import { useAuth } from '../../auth/useAuthContext.tsx';

// ─── Outer guard component ────────────────────────────────────────────────────
// Waits for a confirmed authenticated user before rendering the calendar.
// This prevents useCalendarController from ever running with an empty userId,
// which would cause Firestore permission errors.

export default function CalenderPage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <section className="flex h-screen flex-1 items-center justify-center bg-[#fbfbf7]">
                <p className="text-slate-400 text-sm">Loading calendar…</p>
            </section>
        );
    }

    return <CalendarPageInner uid={user.uid} />;
}

// ─── Inner component ──────────────────────────────────────────────────────────
// Only renders when uid is a real, non-empty string.

function CalendarPageInner({ uid }: { uid: string }) {
    const c = useCalendarController(db, uid);

    /**
     * Position an event card inside a day column.
     * Uses percentage-based positioning so it scales with the
     * flex-driven row height (no fixed px).
     */
    const totalMinutes = HOURS.length * 60; // 12 hours = 720 min
    const startOffset = HOURS[0] * 60; // 360 min (6 am)

    function eventStyle(startTime: string, endTime: string) {
        const startMin = getMinutesFromTime(startTime) - startOffset;
        const endMin = getMinutesFromTime(endTime) - startOffset;
        const duration = Math.max(endMin - startMin, 30);

        const topPct = (startMin / totalMinutes) * 100;
        const heightPct = (duration / totalMinutes) * 100;

        return {
            top: `${topPct}%`,
            height: `${heightPct}%`
        };
    }

    return (
        <section className="flex h-screen min-w-0 flex-1 flex-col bg-[#fbfbf7] p-3 md:p-4 xl:p-5">
            {/* ── Header bar ─────────────────────────────────────────── */}
            <div className="shrink-0 flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative flex flex-wrap items-center gap-3">
                    {/* Week nav arrows */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={c.handlePreviousWeek}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-BBNDarkGreen transition hover:bg-[#eef2e6]"
                        >
                            <FiChevronLeft size={22} />
                        </button>
                        <button
                            type="button"
                            onClick={c.handleNextWeek}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-BBNDarkGreen transition hover:bg-[#eef2e6]"
                        >
                            <FiChevronRight size={22} />
                        </button>
                    </div>

                    {/* Month picker */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                c.setShowMonthDropdown((prev) => !prev);
                                c.setShowYearDropdown(false);
                            }}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-3xl font-semibold text-black transition hover:bg-[#eef2e6]"
                        >
                            <span>{c.monthLabel}</span>
                            <FiChevronDown size={18} className="mt-1" />
                        </button>

                        {c.showMonthDropdown && (
                            <div className="absolute top-full z-30 mt-2 max-h-80 w-52 overflow-y-auto rounded-2xl border border-[#d9decf] bg-white p-2 shadow-xl">
                                {c.monthOptions.map((month, index) => (
                                    <button
                                        key={month}
                                        type="button"
                                        onClick={() => c.selectMonth(index)}
                                        className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                                            index === c.selectedDate.getMonth()
                                                ? 'bg-BBNDarkGreen text-white'
                                                : 'text-slate-700 hover:bg-[#eef2e6]'
                                        }`}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Year picker */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                c.setShowYearDropdown((prev) => !prev);
                                c.setShowMonthDropdown(false);
                            }}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-3xl font-semibold text-black transition hover:bg-[#eef2e6]"
                        >
                            <span>{c.yearLabel}</span>
                            <FiChevronDown size={18} className="mt-1" />
                        </button>

                        {c.showYearDropdown && (
                            <div className="absolute top-full z-30 mt-2 max-h-80 w-36 overflow-y-auto rounded-2xl border border-[#d9decf] bg-white p-2 shadow-xl">
                                {c.yearOptions.map((year) => (
                                    <button
                                        key={year}
                                        type="button"
                                        onClick={() => c.selectYear(year)}
                                        className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                                            year === c.selectedDate.getFullYear()
                                                ? 'bg-BBNDarkGreen text-white'
                                                : 'text-slate-700 hover:bg-[#eef2e6]'
                                        }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side — new event + search + icons */}
                <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
                    <button
                        type="button"
                        onClick={c.openNewEventModal}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-BBNDarkGreen px-5 text-sm font-semibold text-white transition hover:bg-[#33451f]"
                    >
                        <FiPlus size={18} />
                        <span>New Event</span>
                    </button>

                    <div className="relative min-w-0 flex-1 lg:w-[280px] xl:w-[320px]">
                        <div className="flex h-12 items-center rounded-xl border border-[#d9decf] bg-white px-4 shadow-sm">
                            <FiSearch className="mr-3 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search Calendar"
                                value={c.searchQuery}
                                onFocus={() => c.setSearchOpen(true)}
                                onChange={(e) => {
                                    c.setSearchQuery(e.target.value);
                                    c.setSearchOpen(true);
                                }}
                                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                            />
                        </div>

                        {c.searchOpen && (
                            <div className="absolute top-full z-30 mt-2 w-full rounded-2xl border border-[#d9decf] bg-white p-2 shadow-xl">
                                {!c.normalizedQuery && (
                                    <div className="px-3 py-2 text-sm text-slate-400">
                                        Start typing to search events
                                    </div>
                                )}

                                {c.partialMatches.map((event) => (
                                    <button
                                        key={event.id}
                                        type="button"
                                        onClick={() => c.focusEvent(event)}
                                        className="block w-full rounded-xl px-3 py-2 text-left transition hover:bg-[#eef2e6]"
                                    >
                                        <div className="text-sm font-semibold text-BBNDarkGreen">
                                            {event.title}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {event.date} · {event.startTime} – {event.endTime}
                                        </div>
                                    </button>
                                ))}

                                {c.exactMatch ? (
                                    <button
                                        type="button"
                                        onClick={() => c.focusEvent(c.exactMatch!)}
                                        className="block w-full rounded-xl border border-dashed border-[#cfd7c1] bg-[#f7faef] px-3 py-2 text-left transition hover:bg-[#eef2e6]"
                                    >
                                        <div className="text-sm font-semibold text-BBNDarkGreen">
                                            {c.exactMatch.title}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Exact match · {c.exactMatch.date} · {c.exactMatch.startTime} – {c.exactMatch.endTime}
                                        </div>
                                    </button>
                                ) : (
                                    c.normalizedQuery && (
                                        <div className="rounded-xl px-3 py-2 text-sm text-slate-400">
                                            No event found
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <BellButton />
                        <MailButton />
                        <ProfileAvatar />
                    </div>
                </div>
            </div>

            {/* ── Calendar grid (fills remaining viewport) ────────────── */}
            <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
                {/* Day column headers */}
                <div className="shrink-0 grid grid-cols-[60px_repeat(7,1fr)]">
                    <div className="pb-2 text-xs text-slate-400 self-end pr-3 text-right">
                        GMT +6
                    </div>
                    {c.weekDays.map((day) => {
                        const today = isToday(day);
                        return (
                            <button
                                key={day.toISOString()}
                                type="button"
                                onClick={() => c.setSelectedDate(day)}
                                className="border-b border-[#cfd4c8] pb-2 text-left pl-2 transition"
                            >
                                <div className="flex items-baseline gap-1.5">
                                    <span
                                        className={`text-xl font-bold xl:text-2xl ${
                                            today ? 'text-[#69bb52]' : 'text-black'
                                        }`}
                                    >
                                        {day.getDate()}
                                    </span>
                                    <span
                                        className={`text-sm xl:text-base ${
                                            today
                                                ? 'font-medium text-[#69bb52]'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {day.toLocaleString('en-US', { weekday: 'short' })}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/*
                 * Time grid — uses one relative container so hour lines
                 * run the full width unbroken (matching the Figma design).
                 * Day columns with events are overlaid on top.
                 */}
                <div className="relative min-h-0 flex-1">
                    {/* Hour rows — full-width continuous lines */}
                    {HOURS.map((hour, i) => {
                        const topPct = (i / HOURS.length) * 100;
                        return (
                            <div
                                key={hour}
                                className="absolute left-0 right-0 flex items-start"
                                style={{ top: `${topPct}%`, height: `${100 / HOURS.length}%` }}
                            >
                                {/* Hour label */}
                                <div className="w-[60px] shrink-0 pr-3 text-right text-xs text-slate-400 -translate-y-2">
                                    {formatHour(hour)}
                                </div>
                                {/* Unbroken line across all 7 day columns */}
                                <div className="flex-1 border-t border-[#d5d9d0]" />
                            </div>
                        );
                    })}

                    {/* Day columns overlaid with events */}
                    <div className="absolute inset-0 grid grid-cols-[60px_repeat(7,1fr)]">
                        {/* Empty gutter matching the hour-label width */}
                        <div />

                        {c.weekDays.map((day) => {
                            const dateKey = getDateKey(day);
                            const dayEvents = c.events.filter((e) => e.date === dateKey);

                            return (
                                <div key={dateKey} className="relative">
                                    {dayEvents.map((event) => {
                                        const style = eventStyle(
                                            event.startTime,
                                            event.endTime
                                        );
                                        const isHighlighted =
                                            c.highlightedEventId === event.id;

                                        return (
                                            <button
                                                key={event.id}
                                                type="button"
                                                onClick={() =>
                                                    c.setHighlightedEventId(event.id)
                                                }
                                                className={`absolute left-1 right-1 overflow-hidden rounded-sm border-l-[3px] px-2 py-1.5 text-left transition hover:shadow-md ${
                                                    event.colorClass
                                                } ${
                                                    isHighlighted
                                                        ? 'ring-2 ring-BBNDarkGreen ring-offset-1'
                                                        : ''
                                                }`}
                                                style={style}
                                            >
                                                <div className="text-[13px] font-semibold leading-tight truncate">
                                                    {event.title}
                                                </div>
                                                <div className="mt-0.5 text-[11px] opacity-80 truncate">
                                                    {formatHour(
                                                        parseInt(
                                                            event.startTime.split(':')[0]
                                                        )
                                                    )}{' '}
                                                    - {event.notes || 'No notes'}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── New Event Modal ─────────────────────────────────────── */}
            {c.showNewEventModal && (
                <AddNewEventModal
                    form={c.form}
                    setForm={c.setForm}
                    onClose={() => {
                        c.setShowNewEventModal(false);
                        c.setFormError('');
                    }}
                    onSave={c.saveEvent}
                    error={c.formError}
                />
            )}
        </section>
    );
}
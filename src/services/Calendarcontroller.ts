import { useMemo, useState, useCallback, useEffect } from 'react';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    type Firestore,
} from 'firebase/firestore';

// ─── Types ───────────────────────────────────────────────────────────────────

export type CalendarEvent = {
    id: string;
    title: string;
    date: string; // yyyy-mm-dd
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    notes: string;
    colorClass: string;
};

export type EventFormState = {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    notes: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const HOURS = Array.from({ length: 12 }, (_, i) => i + 6); // 6am → 5pm

export const EVENT_COLORS = [
    'bg-[#bfe6fb] text-[#2c6b88] border-[#8fd1f4]',
    'bg-[#f5e2be] text-[#a5671e] border-[#ebc67f]',
    'bg-[#f3d7e8] text-[#a15f96] border-[#e6b8d7]',
    'bg-[#f8d4dc] text-[#b55468] border-[#efb0bf]',
    'bg-[#d9f1d1] text-[#4e7b46] border-[#acd89f]'
];

// ─── Pure helpers ────────────────────────────────────────────────────────────

export function getDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function parseDateKey(value: string): Date {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
}

export function startOfWeek(date: Date): Date {
    const copy = new Date(date);
    const day = copy.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday-based
    copy.setDate(copy.getDate() + diff);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

export function addDays(date: Date, amount: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + amount);
    return copy;
}

export function addWeeks(date: Date, amount: number): Date {
    return addDays(date, amount * 7);
}

export function addMonths(date: Date, amount: number): Date {
    const copy = new Date(date);
    copy.setMonth(copy.getMonth() + amount);
    return copy;
}

export function formatHour(hour: number): string {
    const suffix = hour >= 12 ? 'pm' : 'am';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${h12}${suffix}`;
}

export function getMinutesFromTime(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

export function isSameDay(a: Date, b: Date): boolean {
    return getDateKey(a) === getDateKey(b);
}

/** Returns today's date with time zeroed out */
export function getCurDate(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
}

/** Check whether a given date is today */
export function isToday(date: Date): boolean {
    return isSameDay(date, getCurDate());
}

// ─── Firestore Controller ────────────────────────────────────────────────────

/**
 * Handles Firestore CRUD for calendar events.
 * Events are stored under: users/{userId}/events/{eventId}
 */
export class CalendarController {
    private db: Firestore;
    private userId: string;

    constructor(db: Firestore, userId: string) {
        this.db = db;
        this.userId = userId;
    }

    private eventsRef() {
        return collection(this.db, 'users', this.userId, 'events');
    }

    async getEvents(): Promise<CalendarEvent[]> {
        const snap = await getDocs(this.eventsRef());
        return snap.docs.map((d) => d.data() as CalendarEvent);
    }

    async createEvent(event: CalendarEvent): Promise<void> {
        await setDoc(doc(this.eventsRef(), event.id), event);
    }

    async deleteEvent(eventId: string): Promise<void> {
        await deleteDoc(doc(this.eventsRef(), eventId));
    }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCalendarController(db: Firestore, userId: string) {
    const controller = useMemo(() => new CalendarController(db, userId), [db, userId]);

    const curDate = useMemo(() => getCurDate(), []);

    const [selectedDate, setSelectedDate] = useState(curDate);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewEventModal, setShowNewEventModal] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
    const [formError, setFormError] = useState('');

    const [form, setForm] = useState<EventFormState>({
        title: '',
        date: getDateKey(curDate),
        startTime: '09:00',
        endTime: '10:00',
        notes: ''
    });

    // ── Load events from Firestore on mount ──────────────────────────────────

    useEffect(() => {
        setLoading(true);
        controller.getEvents()
            .then(setEvents)
            .finally(() => setLoading(false));
    }, [controller]);

    // ── Derived ──────────────────────────────────────────────────────────────

    const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);

    const weekDays = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart]
    );

    const monthLabel = selectedDate.toLocaleString('en-US', { month: 'long' });
    const yearLabel = selectedDate.getFullYear();

    const monthOptions = useMemo(
        () =>
            Array.from({ length: 12 }, (_, i) =>
                new Date(2026, i, 1).toLocaleString('en-US', { month: 'long' })
            ),
        []
    );

    const yearOptions = useMemo(
        () => Array.from({ length: 16 }, (_, i) => yearLabel - 10 + i),
        [yearLabel]
    );

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const exactMatch = normalizedQuery
        ? events.find((e) => e.title.toLowerCase() === normalizedQuery) ?? null
        : null;

    const partialMatches = normalizedQuery
        ? events.filter(
            (e) =>
                e.title.toLowerCase().includes(normalizedQuery) &&
                e.id !== exactMatch?.id
        )
        : [];

    // ── Actions ──────────────────────────────────────────────────────────────

    const openNewEventModal = useCallback(() => {
        setFormError('');
        setForm((prev) => ({ ...prev, date: getDateKey(selectedDate) }));
        setShowNewEventModal(true);
    }, [selectedDate]);

    const saveEvent = useCallback(async () => {
        if (!form.title.trim() || !form.date || !form.startTime || !form.endTime) {
            setFormError('Please fill in all required fields.');
            return;
        }
        if (getMinutesFromTime(form.endTime) <= getMinutesFromTime(form.startTime)) {
            setFormError('End time must be later than start time.');
            return;
        }

        const newEvent: CalendarEvent = {
            id: crypto.randomUUID(),
            title: form.title.trim(),
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            notes: form.notes.trim(),
            colorClass: EVENT_COLORS[events.length % EVENT_COLORS.length]
        };

        await controller.createEvent(newEvent);
        setEvents((prev) => [...prev, newEvent]);
        setSelectedDate(parseDateKey(form.date));
        setHighlightedEventId(newEvent.id);
        setShowNewEventModal(false);
        setFormError('');
        setForm({ title: '', date: form.date, startTime: '09:00', endTime: '10:00', notes: '' });
    }, [form, events.length, controller]);

    const deleteEvent = useCallback(async (eventId: string) => {
        await controller.deleteEvent(eventId);
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        if (highlightedEventId === eventId) setHighlightedEventId(null);
    }, [controller, highlightedEventId]);

    const handlePreviousWeek = useCallback(() => {
        setSelectedDate((prev) => addWeeks(prev, -1));
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
    }, []);

    const handleNextWeek = useCallback(() => {
        setSelectedDate((prev) => addWeeks(prev, 1));
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
    }, []);

    const selectMonth = useCallback((monthIndex: number) => {
        setSelectedDate(
            (prev) => new Date(prev.getFullYear(), monthIndex, Math.min(prev.getDate(), 28))
        );
        setShowMonthDropdown(false);
    }, []);

    const selectYear = useCallback((year: number) => {
        setSelectedDate(
            (prev) => new Date(year, prev.getMonth(), Math.min(prev.getDate(), 28))
        );
        setShowYearDropdown(false);
    }, []);

    const focusEvent = useCallback((event: CalendarEvent) => {
        setSelectedDate(parseDateKey(event.date));
        setHighlightedEventId(event.id);
        setSearchQuery(event.title);
        setSearchOpen(false);
    }, []);

    return {
        curDate,
        selectedDate,
        setSelectedDate,
        events,
        loading,
        showNewEventModal,
        setShowNewEventModal,
        showMonthDropdown,
        setShowMonthDropdown,
        showYearDropdown,
        setShowYearDropdown,
        searchQuery,
        setSearchQuery,
        searchOpen,
        setSearchOpen,
        highlightedEventId,
        setHighlightedEventId,
        formError,
        setFormError,
        form,
        setForm,
        weekDays,
        monthLabel,
        yearLabel,
        monthOptions,
        yearOptions,
        normalizedQuery,
        exactMatch,
        partialMatches,
        openNewEventModal,
        saveEvent,
        deleteEvent,
        handlePreviousWeek,
        handleNextWeek,
        selectMonth,
        selectYear,
        focusEvent
    };
}

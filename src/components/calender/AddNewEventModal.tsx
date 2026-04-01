import type { Dispatch, SetStateAction } from 'react';
import { FiX } from 'react-icons/fi';

export type EventFormState = {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    notes: string;
};

type AddNewEventModalProps = {
    form: EventFormState;
    setForm: Dispatch<SetStateAction<EventFormState>>;
    onClose: () => void;
    onSave: () => void;
    error?: string;
};

export default function AddNewEventModal({
                                             form,
                                             setForm,
                                             onClose,
                                             onSave,
                                             error
                                         }: AddNewEventModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-BBNDarkGreen">
                            New Event
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Frontend-only for now. Backend can plug into this later.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9decf] text-slate-500 transition hover:bg-slate-50"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="label">Event Name</label>
                        <input
                            type="text"
                            placeholder="Enter event name"
                            value={form.title}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    title: e.target.value
                                }))
                            }
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Event Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    date: e.target.value
                                }))
                            }
                            className="input"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="label">Start Time</label>
                            <input
                                type="time"
                                value={form.startTime}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        startTime: e.target.value
                                    }))
                                }
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">End Time</label>
                            <input
                                type="time"
                                value={form.endTime}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        endTime: e.target.value
                                    }))
                                }
                                className="input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Notes</label>
                        <textarea
                            rows={5}
                            placeholder="Add notes"
                            value={form.notes}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    notes: e.target.value
                                }))
                            }
                            className="input resize-none"
                        />
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-[#d9decf] px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        className="rounded-xl bg-BBNDarkGreen px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#33451f]"
                    >
                        Save Event
                    </button>
                </div>
            </div>
        </div>
    );
}
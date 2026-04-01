type Props = {
    open: boolean;
    onClose: () => void;
};

export default function FiltersDrawer({ open, onClose }: Props) {
    return (
        <>
            {open && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default bg-black/20"
                    onClick={onClose}
                    aria-label="Close filters"
                />
            )}

            <aside
                className={[
                    "fixed right-0 top-0 z-50 h-full w-[360px] bg-white shadow-xl transition-transform duration-200 border-l border-[#d4e5c3]",
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
                aria-hidden={!open}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e8f3dd] px-5 py-4">
                    <h2 className="text-lg font-bold text-[#2d3a1f]">
                        Filters
                    </h2>
                    <button
                        type="button"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-[#4a5c35] hover:bg-[#e8f3dd] transition-colors"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

                {/* Filter sections */}
                <div className="space-y-3 p-5">
                    {["Company", "Location", "School"].map((filter) => (
                        <div
                            key={filter}
                            className="rounded-xl border border-[#d4e5c3] bg-[#f4f9ee] p-4"
                        >
                            <p className="text-sm font-semibold text-[#2d3a1f]">
                                {filter}
                            </p>
                            <p className="mt-1 text-xs text-[#7a9b5c]">
                                Placeholder
                            </p>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="w-full rounded-xl bg-[#2d3a1f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#3d4a2b] transition-colors mt-2"
                        onClick={() => alert("Apply (todo)")}
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>
        </>
    );
}

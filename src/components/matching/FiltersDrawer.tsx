type Props = {
  open: boolean;
  onClose: () => void;
};

/** Right-side filters drawer (placeholder controls). */
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
          "fixed right-0 top-0 z-50 h-full w-[360px] bg-white shadow-xl transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">Filters</h2>
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-800">Company</p>
            <p className="mt-1 text-xs text-neutral-500">Placeholder</p>
          </div>

          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-800">Location</p>
            <p className="mt-1 text-xs text-neutral-500">Placeholder</p>
          </div>

          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-800">School</p>
            <p className="mt-1 text-xs text-neutral-500">Placeholder</p>
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            onClick={() => alert("Apply (todo)")}
          >
            Apply
          </button>
        </div>
      </aside>
    </>
  );
}

import { useState } from "react";
import {
  runSampleMentorMatching,
  sampleMentee,
  sampleMentors,
  type MatchBreakdown,
} from "../../services/matching/mentorMatcher";

export default function MentorMatchingTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<MatchBreakdown[]>([]);
  const [useEmbeddings, setUseEmbeddings] = useState(true);

  const handleRun = async () => {
    setLoading(true);
    setError("");

    try {
      const ranked = await runSampleMentorMatching(useEmbeddings);
      setResults(ranked);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Mentor Matching Test
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Runs the AI matching logic with sample data and shows the ranked
            mentor list.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={useEmbeddings}
                onChange={(e) => setUseEmbeddings(e.target.checked)}
              />
              Use HuggingFace embeddings
            </label>

            <button
              type="button"
              onClick={handleRun}
              disabled={loading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Running..." : "Run Matching Test"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Mentee
            </h2>
            <pre className="mt-3 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
              {JSON.stringify(sampleMentee, null, 2)}
            </pre>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Mentors
            </h2>
            <pre className="mt-3 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
              {JSON.stringify(sampleMentors, null, 2)}
            </pre>
          </article>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Mentor</th>
                  <th className="px-4 py-3">Professional</th>
                  <th className="px-4 py-3">Personal</th>
                  <th className="px-4 py-3">Logistical</th>
                  <th className="px-4 py-3">Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {results.map((row) => (
                  <tr key={row.mentorId}>
                    <td className="px-4 py-3 font-medium">{row.mentorName}</td>
                    <td className="px-4 py-3">{row.professionalScore}%</td>
                    <td className="px-4 py-3">{row.personalScore}%</td>
                    <td className="px-4 py-3">{row.logisticalScore}%</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {row.finalScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

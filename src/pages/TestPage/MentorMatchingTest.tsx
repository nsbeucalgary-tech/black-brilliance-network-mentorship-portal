import { useState } from "react";
import {
  rankMentors,
  type PersonProfile,
  type MatchBreakdown,
} from "../../services/matching/mentorMatcher";

const initialMenteeJson = `{
  "id": "m1",
  "name": "Amina",
  "role": "mentee",
  "discipline": "Software Engineering",
  "skills": ["Python", "React", "SQL"],
  "careerGoals": ["backend engineering", "data engineering", "cloud systems"],
  "academicLevel": "undergraduate",
  "hobbies": ["gaming", "music", "fitness"],
  "availability": ["mon_evening", "wed_evening", "sat_afternoon"],
  "meetingStyle": "online"
}`;

const initialMentorsJson = `[
  {
    "id": "t1",
    "name": "Jordan",
    "role": "mentor",
    "discipline": "Software Engineering",
    "skills": ["Java", "Python", "AWS", "SQL"],
    "careerGoals": ["backend systems", "cloud architecture", "mentorship"],
    "academicLevel": "industry professional",
    "hobbies": ["gaming", "basketball", "music"],
    "availability": ["mon_evening", "thu_evening"],
    "meetingStyle": "online"
  },
  {
    "id": "t2",
    "name": "Priya",
    "role": "mentor",
    "discipline": "Mechanical Engineering",
    "skills": ["CAD", "MATLAB", "controls"],
    "careerGoals": ["robotics", "automation", "product design"],
    "academicLevel": "graduate",
    "hobbies": ["fitness", "travel", "reading"],
    "availability": ["wed_evening", "sat_afternoon"],
    "meetingStyle": "hybrid"
  }
]`;

export default function MentorMatchingTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<MatchBreakdown[]>([]);
  const [useEmbeddings, setUseEmbeddings] = useState(true);
  const [menteeJson, setMenteeJson] = useState(initialMenteeJson);
  const [mentorsJson, setMentorsJson] = useState(initialMentorsJson);

  const handleRun = async () => {
    setLoading(true);
    setError("");

    try {
      const mentee = JSON.parse(menteeJson) as PersonProfile;
      const mentors = JSON.parse(mentorsJson) as PersonProfile[];

      const ranked = await rankMentors(mentee, mentors, {
        useEmbeddings,
        rateLimitKey: "mentor-matching-test-page",
      });

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
            Paste mentee and mentor JSON, run matching, and inspect ranked
            output.
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
              Mentee JSON
            </h2>
            <label htmlFor="mentee-json" className="sr-only">
              Mentee JSON input
            </label>
            <textarea
              id="mentee-json"
              title="Mentee JSON"
              placeholder='{"id":"m1", "role":"mentee", ...}'
              className="mt-3 h-80 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 outline-none focus:border-slate-400"
              value={menteeJson}
              onChange={(e) => setMenteeJson(e.target.value)}
            />
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Mentors JSON
            </h2>
            <label htmlFor="mentors-json" className="sr-only">
              Mentors JSON input
            </label>
            <textarea
              id="mentors-json"
              title="Mentors JSON"
              placeholder='[{"id":"t1", "role":"mentor", ...}]'
              className="mt-3 h-80 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 outline-none focus:border-slate-400"
              value={mentorsJson}
              onChange={(e) => setMentorsJson(e.target.value)}
            />
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

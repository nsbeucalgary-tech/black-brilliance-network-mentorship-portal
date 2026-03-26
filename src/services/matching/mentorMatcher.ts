import { pipeline } from "@huggingface/transformers";

export type MeetingStyle = "online" | "in-person" | "hybrid";

export type PersonProfile = {
  id: string;
  name: string;
  role: "mentor" | "mentee";
  discipline: string;
  skills: string[];
  careerGoals: string[];
  academicLevel?: string;
  hobbies: string[];
  availability: string[];
  meetingStyle: MeetingStyle;
};

export type MatchBreakdown = {
  mentorId: string;
  mentorName: string;
  professionalScore: number;
  personalScore: number;
  logisticalScore: number;
  finalScore: number;
};

type EmbeddingOutput = {
  tolist: () => unknown;
};

type EmbeddingExtractor = (
  text: string,
  options: { pooling: "mean"; normalize: true },
) => Promise<EmbeddingOutput>;

let cachedExtractor: EmbeddingExtractor | null = null;

function normalizeItems(items: string[]): string[] {
  return items
    .map((item) => item.toLowerCase().trim())
    .filter(Boolean);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function overlapScore(a: string[], b: string[]): number {
  const setA = new Set(normalizeItems(a));
  const setB = new Set(normalizeItems(b));

  if (setA.size === 0 || setB.size === 0) return 0;

  let overlap = 0;
  for (const item of setA) {
    if (setB.has(item)) overlap += 1;
  }

  const unionSize = new Set([...setA, ...setB]).size;
  return unionSize === 0 ? 0 : overlap / unionSize;
}

export function logisticalFit(mentee: PersonProfile, mentor: PersonProfile): number {
  const availabilityScore = overlapScore(mentee.availability, mentor.availability);

  let meetingStyleScore = 0;
  if (mentee.meetingStyle === mentor.meetingStyle) {
    meetingStyleScore = 1;
  } else if (mentee.meetingStyle === "hybrid" || mentor.meetingStyle === "hybrid") {
    meetingStyleScore = 0.7;
  } else {
    meetingStyleScore = 0.3;
  }

  return 0.7 * availabilityScore + 0.3 * meetingStyleScore;
}

function buildProfessionalText(profile: PersonProfile): string {
  return [
    `Discipline: ${profile.discipline}`,
    `Skills: ${profile.skills.join(", ")}`,
    `Career goals: ${profile.careerGoals.join(", ")}`,
    `Academic level: ${profile.academicLevel ?? ""}`,
  ].join("\n");
}

function buildPersonalText(profile: PersonProfile): string {
  return `Hobbies and interests: ${profile.hobbies.join(", ")}`;
}

async function getExtractor(): Promise<EmbeddingExtractor> {
  if (cachedExtractor) return cachedExtractor;

  const extractor = await pipeline(
    "feature-extraction",
    "sentence-transformers/all-MiniLM-L6-v2",
  );

  cachedExtractor = extractor as unknown as EmbeddingExtractor;

  return cachedExtractor;
}

async function getEmbedding(extractor: EmbeddingExtractor, text: string): Promise<number[]> {
  const cacheKey = text.trim();
  const cached = embeddingCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  const arr = output.tolist();
  if (!arr) {
    throw new Error("Unexpected embedding output shape");
  }

  if (Array.isArray(arr) && Array.isArray(arr[0])) {
    const vector = arr[0] as number[];
    addToEmbeddingCache(cacheKey, vector);
    return vector;
  }

  const vector = arr as number[];
  addToEmbeddingCache(cacheKey, vector);
  return vector;
}

function lexicalProfessionalScore(mentee: PersonProfile, mentor: PersonProfile): number {
  const discipline = overlapScore([mentee.discipline], [mentor.discipline]);
  const skills = overlapScore(mentee.skills, mentor.skills);
  const goals = overlapScore(mentee.careerGoals, mentor.careerGoals);
  const level = overlapScore([mentee.academicLevel ?? ""], [mentor.academicLevel ?? ""]);

  return discipline * 0.4 + skills * 0.3 + goals * 0.2 + level * 0.1;
}

function lexicalPersonalScore(mentee: PersonProfile, mentor: PersonProfile): number {
  return overlapScore(mentee.hobbies, mentor.hobbies);
}

type RankOptions = {
  useEmbeddings?: boolean;
  rateLimitKey?: string;
};

type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

type EmbeddingCacheConfig = {
  maxEntries: number;
};

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;

  return parsed;
}

const matcherRateLimit: RateLimitConfig = {
  maxRequests: parsePositiveInt(import.meta.env.VITE_MATCHING_RATE_LIMIT_MAX_REQUESTS, 20),
  windowMs: parsePositiveInt(import.meta.env.VITE_MATCHING_RATE_LIMIT_WINDOW_MS, 60_000),
};

const embeddingCacheConfig: EmbeddingCacheConfig = {
  maxEntries: parsePositiveInt(import.meta.env.VITE_MATCHING_EMBEDDING_CACHE_MAX_ENTRIES, 500),
};

const rateLimitState = new Map<string, number[]>();
const embeddingCache = new Map<string, number[]>();

function addToEmbeddingCache(key: string, value: number[]): void {
  if (embeddingCache.has(key)) {
    embeddingCache.delete(key);
  }

  embeddingCache.set(key, value);

  if (embeddingCache.size > embeddingCacheConfig.maxEntries) {
    const oldestKey = embeddingCache.keys().next().value;
    if (oldestKey) {
      embeddingCache.delete(oldestKey);
    }
  }
}

function enforceRateLimit(rateLimitKey: string): void {
  const now = Date.now();
  const windowStart = now - matcherRateLimit.windowMs;
  const timestamps = rateLimitState.get(rateLimitKey) ?? [];
  const inWindow = timestamps.filter((ts) => ts >= windowStart);

  if (inWindow.length >= matcherRateLimit.maxRequests) {
    throw new Error("Rate limit exceeded. Please wait and try again.");
  }

  inWindow.push(now);
  rateLimitState.set(rateLimitKey, inWindow);
}

export async function rankMentors(
  mentee: PersonProfile,
  mentors: PersonProfile[],
  options: RankOptions = {},
): Promise<MatchBreakdown[]> {
  const useEmbeddings = options.useEmbeddings ?? true;
  const rateLimitKey = options.rateLimitKey ?? "global";

  enforceRateLimit(rateLimitKey);

  let extractor: EmbeddingExtractor | null = null;
  if (useEmbeddings) {
    try {
      extractor = await getExtractor();
    } catch {
      extractor = null;
    }
  }

  let menteeProfessionalEmbedding: number[] | null = null;
  let menteePersonalEmbedding: number[] | null = null;

  if (extractor) {
    menteeProfessionalEmbedding = await getEmbedding(extractor, buildProfessionalText(mentee));
    menteePersonalEmbedding = await getEmbedding(extractor, buildPersonalText(mentee));
  }

  const results: MatchBreakdown[] = [];

  for (const mentor of mentors) {
    let professionalScore = 0;
    let personalScore = 0;

    if (extractor && menteeProfessionalEmbedding && menteePersonalEmbedding) {
      const mentorProfessionalEmbedding = await getEmbedding(
        extractor,
        buildProfessionalText(mentor),
      );
      const mentorPersonalEmbedding = await getEmbedding(extractor, buildPersonalText(mentor));

      professionalScore = Math.max(
        0,
        cosineSimilarity(menteeProfessionalEmbedding, mentorProfessionalEmbedding),
      );
      personalScore = Math.max(0, cosineSimilarity(menteePersonalEmbedding, mentorPersonalEmbedding));
    } else {
      professionalScore = lexicalProfessionalScore(mentee, mentor);
      personalScore = lexicalPersonalScore(mentee, mentor);
    }

    const logisticalScore = logisticalFit(mentee, mentor);

    const finalScore = professionalScore * 0.6 + personalScore * 0.3 + logisticalScore * 0.1;

    results.push({
      mentorId: mentor.id,
      mentorName: mentor.name,
      professionalScore: Number((professionalScore * 100).toFixed(1)),
      personalScore: Number((personalScore * 100).toFixed(1)),
      logisticalScore: Number((logisticalScore * 100).toFixed(1)),
      finalScore: Number((finalScore * 100).toFixed(1)),
    });
  }

  return results.sort((a, b) => b.finalScore - a.finalScore);
}

/*
Example payload shape for manual testing:

const mentee: PersonProfile = {
  id: "m1",
  name: "Amina",
  role: "mentee",
  discipline: "Software Engineering",
  skills: ["Python", "React", "SQL"],
  careerGoals: ["backend engineering", "data engineering", "cloud systems"],
  academicLevel: "undergraduate",
  hobbies: ["gaming", "music", "fitness"],
  availability: ["mon_evening", "wed_evening", "sat_afternoon"],
  meetingStyle: "online",
};

const mentors: PersonProfile[] = [
  {
    id: "t1",
    name: "Jordan",
    role: "mentor",
    discipline: "Software Engineering",
    skills: ["Java", "Python", "AWS", "SQL"],
    careerGoals: ["backend systems", "cloud architecture", "mentorship"],
    academicLevel: "industry professional",
    hobbies: ["gaming", "basketball", "music"],
    availability: ["mon_evening", "thu_evening"],
    meetingStyle: "online",
  },
];

const ranked = await rankMentors(mentee, mentors, { useEmbeddings: true, rateLimitKey: "user-123" });
*/

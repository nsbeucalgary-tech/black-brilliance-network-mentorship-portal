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
  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  const arr = output.tolist();
  if (!arr) {
    throw new Error("Unexpected embedding output shape");
  }

  if (Array.isArray(arr) && Array.isArray(arr[0])) {
    return arr[0] as number[];
  }

  return arr as number[];
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
};

export async function rankMentors(
  mentee: PersonProfile,
  mentors: PersonProfile[],
  options: RankOptions = {},
): Promise<MatchBreakdown[]> {
  const useEmbeddings = options.useEmbeddings ?? true;

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

export const sampleMentee: PersonProfile = {
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

export const sampleMentors: PersonProfile[] = [
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
  {
    id: "t2",
    name: "Priya",
    role: "mentor",
    discipline: "Mechanical Engineering",
    skills: ["CAD", "MATLAB", "controls"],
    careerGoals: ["robotics", "automation", "product design"],
    academicLevel: "graduate",
    hobbies: ["fitness", "travel", "reading"],
    availability: ["wed_evening", "sat_afternoon"],
    meetingStyle: "hybrid",
  },
  {
    id: "t3",
    name: "Samuel",
    role: "mentor",
    discipline: "Data Engineering",
    skills: ["Python", "SQL", "Spark", "ETL"],
    careerGoals: ["data engineering", "analytics engineering", "platforms"],
    academicLevel: "industry professional",
    hobbies: ["music", "chess", "gaming"],
    availability: ["mon_evening", "wed_evening", "sat_afternoon"],
    meetingStyle: "online",
  },
];

export async function runSampleMentorMatching(useEmbeddings = true): Promise<MatchBreakdown[]> {
  return rankMentors(sampleMentee, sampleMentors, { useEmbeddings });
}

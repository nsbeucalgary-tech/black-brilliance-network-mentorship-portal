import type { Timestamp } from "firebase/firestore";

export const MentorshipRelationshipStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  ENDED: "ended",
} as const;

export type MentorshipRelationshipStatus =
  (typeof MentorshipRelationshipStatus)[keyof typeof MentorshipRelationshipStatus];

export interface MentorshipRelationship {
  mentor_id: string;
  mentee_id: string;
  status: MentorshipRelationshipStatus;
  requested_by: string;
  requested_at: Date;
  responded_at: Date | null;
  started_at: Date | null;
  ended_at: Date | null;
  updated_at: Date;
}

export interface MentorshipRelationshipFirestoreData {
  mentor_id: string;
  mentee_id: string;
  status: MentorshipRelationshipStatus;
  requested_by: string;
  requested_at: Date | Timestamp;
  responded_at: Date | Timestamp | null;
  started_at: Date | Timestamp | null;
  ended_at: Date | Timestamp | null;
  updated_at: Date | Timestamp;
}

export type CreateMentorshipRequestPayload = {
  mentor_id: string;
  mentee_id: string;
};

export type MentorshipRelationshipActionStatus =
  | typeof MentorshipRelationshipStatus.ACCEPTED
  | typeof MentorshipRelationshipStatus.REJECTED;

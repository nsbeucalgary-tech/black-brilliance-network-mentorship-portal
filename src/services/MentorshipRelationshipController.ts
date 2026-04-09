import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type Firestore,
  type QueryConstraint,
} from "firebase/firestore";
import { UserRole, type UserFirestoreData } from "../types/User";
import {
  MentorshipRelationshipStatus,
  type CreateMentorshipRequestPayload,
  type MentorshipRelationship,
  type MentorshipRelationshipActionStatus,
  type MentorshipRelationshipFirestoreData,
  type MentorshipRelationshipStatus as RelationshipStatus,
} from "../types/MentorshipRelationship";

/**
 * Mentorship Relationship Controller
 * Stores mentor-mentee links and request lifecycle in a dedicated collection.
 */
export class MentorshipRelationshipController {
  private db: Firestore;
  private relationshipCollectionName = "mentor_mentee_relationships";
  private userCollectionName = "users";

  constructor(db: Firestore) {
    this.db = db;
  }

  private getRelationshipDocId(mentorId: string, menteeId: string): string {
    return `${mentorId}__${menteeId}`;
  }

  private assertNonEmptyId(label: string, value: string): void {
    if (!value.trim()) {
      throw new Error(`${label} is required`);
    }
  }

  private validatePair(mentorId: string, menteeId: string): void {
    this.assertNonEmptyId("mentor_id", mentorId);
    this.assertNonEmptyId("mentee_id", menteeId);

    if (mentorId === menteeId) {
      throw new Error("A user cannot be both mentor and mentee in the same relationship");
    }
  }

  private toDate(value: Date | Timestamp | null): Date | null {
    if (value === null) return null;
    return value instanceof Timestamp ? value.toDate() : value;
  }

  private toFirestoreTimestamp(value: Date | null): Timestamp | null {
    if (value === null) return null;
    return Timestamp.fromDate(value);
  }

  private isPermissionDeniedError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "permission-denied"
    );
  }

  private firestoreDataToRelationship(
    data: MentorshipRelationshipFirestoreData
  ): MentorshipRelationship {
    return {
      mentor_id: data.mentor_id,
      mentee_id: data.mentee_id,
      status: data.status,
      requested_by: data.requested_by,
      requested_at: this.toDate(data.requested_at) as Date,
      responded_at: this.toDate(data.responded_at),
      started_at: this.toDate(data.started_at),
      ended_at: this.toDate(data.ended_at),
      updated_at: this.toDate(data.updated_at) as Date,
    };
  }

  private relationshipToFirestoreData(
    relationship: MentorshipRelationship
  ): MentorshipRelationshipFirestoreData {
    return {
      mentor_id: relationship.mentor_id,
      mentee_id: relationship.mentee_id,
      status: relationship.status,
      requested_by: relationship.requested_by,
      requested_at: Timestamp.fromDate(relationship.requested_at),
      responded_at: this.toFirestoreTimestamp(relationship.responded_at),
      started_at: this.toFirestoreTimestamp(relationship.started_at),
      ended_at: this.toFirestoreTimestamp(relationship.ended_at),
      updated_at: Timestamp.fromDate(relationship.updated_at),
    };
  }

  private async assertUserRole(
    userId: string,
    expectedRole: typeof UserRole.MENTOR | typeof UserRole.MENTEE
  ): Promise<void> {
    const userSnapshot = await getDoc(doc(this.db, this.userCollectionName, userId));

    if (!userSnapshot.exists()) {
      throw new Error(`User ${userId} does not exist`);
    }

    const userData = userSnapshot.data() as Partial<UserFirestoreData>;
    if (userData.role !== expectedRole) {
      throw new Error(`User ${userId} must have role ${expectedRole}`);
    }
  }

  private async assertMentorMenteeRoles(mentorId: string, menteeId: string): Promise<void> {
    await Promise.all([
      this.assertUserRole(mentorId, UserRole.MENTOR),
      this.assertUserRole(menteeId, UserRole.MENTEE),
    ]);
  }

  async getRelationship(mentorId: string, menteeId: string): Promise<MentorshipRelationship | null> {
    this.validatePair(mentorId, menteeId);

    const relationshipSnapshot = await getDoc(
      doc(
        this.db,
        this.relationshipCollectionName,
        this.getRelationshipDocId(mentorId, menteeId)
      )
    );

    if (!relationshipSnapshot.exists()) {
      return null;
    }

    return this.firestoreDataToRelationship(
      relationshipSnapshot.data() as MentorshipRelationshipFirestoreData
    );
  }

  async createRequest(payload: CreateMentorshipRequestPayload): Promise<MentorshipRelationship> {
    const mentorId = payload.mentor_id;
    const menteeId = payload.mentee_id;

    this.validatePair(mentorId, menteeId);
    await this.assertMentorMenteeRoles(mentorId, menteeId);

    const relationshipRef = doc(
      this.db,
      this.relationshipCollectionName,
      this.getRelationshipDocId(mentorId, menteeId)
    );
    const now = new Date();
    let relationshipSnapshot;

    try {
      relationshipSnapshot = await getDoc(relationshipRef);
    } catch (error) {
      // Some Firestore rules allow create for the mentee but still deny a read
      // against a not-yet-existing relationship doc. In that case, treat it as
      // the first request for this pair and proceed with create.
      if (!this.isPermissionDeniedError(error)) {
        throw error;
      }

      relationshipSnapshot = null;
    }

    if (!relationshipSnapshot || !relationshipSnapshot.exists()) {
      const relationship: MentorshipRelationship = {
        mentor_id: mentorId,
        mentee_id: menteeId,
        status: MentorshipRelationshipStatus.PENDING,
        requested_by: menteeId,
        requested_at: now,
        responded_at: null,
        started_at: null,
        ended_at: null,
        updated_at: now,
      };

      await setDoc(relationshipRef, this.relationshipToFirestoreData(relationship));
      return relationship;
    }

    const existingRelationship = this.firestoreDataToRelationship(
      relationshipSnapshot.data() as MentorshipRelationshipFirestoreData
    );

    if (existingRelationship.status === MentorshipRelationshipStatus.PENDING) {
      throw new Error("A mentorship request for this pair is already pending");
    }

    if (existingRelationship.status === MentorshipRelationshipStatus.ACCEPTED) {
      throw new Error("Mentor and mentee are already linked");
    }

    await updateDoc(relationshipRef, {
      status: MentorshipRelationshipStatus.PENDING,
      requested_by: menteeId,
      requested_at: Timestamp.fromDate(now),
      responded_at: null,
      started_at: null,
      ended_at: null,
      updated_at: Timestamp.fromDate(now),
    });

    const reopenedRelationship = await this.getRelationship(mentorId, menteeId);
    if (!reopenedRelationship) {
      throw new Error("Failed to create mentorship request");
    }

    return reopenedRelationship;
  }

  async acceptRequest(mentorId: string, menteeId: string): Promise<MentorshipRelationship> {
    return this.respondToRequest(
      mentorId,
      menteeId,
      MentorshipRelationshipStatus.ACCEPTED
    );
  }

  async rejectRequest(mentorId: string, menteeId: string): Promise<MentorshipRelationship> {
    return this.respondToRequest(
      mentorId,
      menteeId,
      MentorshipRelationshipStatus.REJECTED
    );
  }

  private async respondToRequest(
    mentorId: string,
    menteeId: string,
    nextStatus: MentorshipRelationshipActionStatus
  ): Promise<MentorshipRelationship> {
    this.validatePair(mentorId, menteeId);
    await this.assertMentorMenteeRoles(mentorId, menteeId);

    const relationshipRef = doc(
      this.db,
      this.relationshipCollectionName,
      this.getRelationshipDocId(mentorId, menteeId)
    );
    const relationshipSnapshot = await getDoc(relationshipRef);

    if (!relationshipSnapshot.exists()) {
      throw new Error("Mentorship request does not exist");
    }

    const existingRelationship = this.firestoreDataToRelationship(
      relationshipSnapshot.data() as MentorshipRelationshipFirestoreData
    );

    if (existingRelationship.status !== MentorshipRelationshipStatus.PENDING) {
      throw new Error(
        `Only pending requests can be responded to (current status: ${existingRelationship.status})`
      );
    }

    const now = new Date();

    await updateDoc(relationshipRef, {
      status: nextStatus,
      responded_at: Timestamp.fromDate(now),
      started_at:
        nextStatus === MentorshipRelationshipStatus.ACCEPTED
          ? Timestamp.fromDate(now)
          : null,
      ended_at: null,
      updated_at: Timestamp.fromDate(now),
    });

    const updatedRelationship = await this.getRelationship(mentorId, menteeId);
    if (!updatedRelationship) {
      throw new Error("Failed to update mentorship request");
    }

    return updatedRelationship;
  }

  async cancelRequest(mentorId: string, menteeId: string): Promise<MentorshipRelationship> {
    this.validatePair(mentorId, menteeId);
    await this.assertMentorMenteeRoles(mentorId, menteeId);

    const relationshipRef = doc(
      this.db,
      this.relationshipCollectionName,
      this.getRelationshipDocId(mentorId, menteeId)
    );
    const relationshipSnapshot = await getDoc(relationshipRef);

    if (!relationshipSnapshot.exists()) {
      throw new Error("Mentorship request does not exist");
    }

    const existingRelationship = this.firestoreDataToRelationship(
      relationshipSnapshot.data() as MentorshipRelationshipFirestoreData
    );

    if (existingRelationship.status !== MentorshipRelationshipStatus.PENDING) {
      throw new Error(
        `Only pending requests can be cancelled (current status: ${existingRelationship.status})`
      );
    }

    const now = new Date();

    await updateDoc(relationshipRef, {
      status: MentorshipRelationshipStatus.CANCELLED,
      responded_at: Timestamp.fromDate(now),
      started_at: null,
      ended_at: null,
      updated_at: Timestamp.fromDate(now),
    });

    const cancelledRelationship = await this.getRelationship(mentorId, menteeId);
    if (!cancelledRelationship) {
      throw new Error("Failed to cancel mentorship request");
    }

    return cancelledRelationship;
  }

  async endRelationship(mentorId: string, menteeId: string): Promise<MentorshipRelationship> {
    this.validatePair(mentorId, menteeId);
    await this.assertMentorMenteeRoles(mentorId, menteeId);

    const relationshipRef = doc(
      this.db,
      this.relationshipCollectionName,
      this.getRelationshipDocId(mentorId, menteeId)
    );
    const relationshipSnapshot = await getDoc(relationshipRef);

    if (!relationshipSnapshot.exists()) {
      throw new Error("Mentorship relationship does not exist");
    }

    const existingRelationship = this.firestoreDataToRelationship(
      relationshipSnapshot.data() as MentorshipRelationshipFirestoreData
    );

    if (existingRelationship.status !== MentorshipRelationshipStatus.ACCEPTED) {
      throw new Error(
        `Only accepted relationships can be ended (current status: ${existingRelationship.status})`
      );
    }

    const now = new Date();

    await updateDoc(relationshipRef, {
      status: MentorshipRelationshipStatus.ENDED,
      ended_at: Timestamp.fromDate(now),
      updated_at: Timestamp.fromDate(now),
    });

    const endedRelationship = await this.getRelationship(mentorId, menteeId);
    if (!endedRelationship) {
      throw new Error("Failed to end mentorship relationship");
    }

    return endedRelationship;
  }

  async getRelationshipsForMentor(
    mentorId: string,
    status?: RelationshipStatus
  ): Promise<MentorshipRelationship[]> {
    this.assertNonEmptyId("mentor_id", mentorId);

    const queryConstraints: QueryConstraint[] = [where("mentor_id", "==", mentorId)];
    if (status) {
      queryConstraints.push(where("status", "==", status));
    }

    const relationshipQuery = query(
      collection(this.db, this.relationshipCollectionName),
      ...queryConstraints
    );
    const querySnapshot = await getDocs(relationshipQuery);

    return querySnapshot.docs.map((relationshipDoc) =>
      this.firestoreDataToRelationship(
        relationshipDoc.data() as MentorshipRelationshipFirestoreData
      )
    );
  }

  async getRelationshipsForMentee(
    menteeId: string,
    status?: RelationshipStatus
  ): Promise<MentorshipRelationship[]> {
    this.assertNonEmptyId("mentee_id", menteeId);

    const queryConstraints: QueryConstraint[] = [where("mentee_id", "==", menteeId)];
    if (status) {
      queryConstraints.push(where("status", "==", status));
    }

    const relationshipQuery = query(
      collection(this.db, this.relationshipCollectionName),
      ...queryConstraints
    );
    const querySnapshot = await getDocs(relationshipQuery);

    return querySnapshot.docs.map((relationshipDoc) =>
      this.firestoreDataToRelationship(
        relationshipDoc.data() as MentorshipRelationshipFirestoreData
      )
    );
  }

  async getPendingRequestsForMentor(mentorId: string): Promise<MentorshipRelationship[]> {
    return this.getRelationshipsForMentor(mentorId, MentorshipRelationshipStatus.PENDING);
  }

  async getAcceptedMenteeIdsForMentor(mentorId: string): Promise<string[]> {
    const relationships = await this.getRelationshipsForMentor(
      mentorId,
      MentorshipRelationshipStatus.ACCEPTED
    );

    return relationships.map((relationship) => relationship.mentee_id);
  }

  async getAcceptedMentorIdsForMentee(menteeId: string): Promise<string[]> {
    const relationships = await this.getRelationshipsForMentee(
      menteeId,
      MentorshipRelationshipStatus.ACCEPTED
    );

    return relationships.map((relationship) => relationship.mentor_id);
  }
}

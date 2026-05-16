/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { ConversationController } from "../services/ConversationController";

/**
 * To run this file use npm run test:watch 
 */


// Mock firebase/firestore
vi.mock("firebase/firestore", () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    orderBy: vi.fn(),
    query: vi.fn(),
    serverTimestamp: vi.fn(() => "mock-timestamp"),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    where: vi.fn(),
}));

describe("ConversationController", () => {
    let controller: ConversationController;

    beforeEach(() => {
        vi.clearAllMocks();

        controller = new ConversationController({} as any);

        vi.mocked(doc).mockReturnValue({} as any);
        vi.mocked(collection).mockReturnValue({} as any);
        vi.mocked(query).mockReturnValue({} as any);
    });

    describe("createConversation", () => {
        it("creates a new conversation when one does not exist", async () => {
            vi.mocked(getDoc).mockResolvedValue({
                exists: () => false,
            } as any);

            const result = await controller.createConversation(
                "userAId",
                "userBId",
            );

            expect(getDoc).toHaveBeenCalled();

            expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
                participantIds: ["userAId", "userBId"],
                created_at: "mock-timestamp",
            });

            expect(result).toEqual({
                conversationId: "userAId_userBId",
                participantIds: ["userAId", "userBId"],
                created_at: "mock-timestamp",
            });
        });

        it("returns an existing conversation if found", async () => {
            vi.mocked(getDoc).mockResolvedValue({
                exists: () => true,
                id: "userAId_userBId",
                data: () => ({
                    participantIds: ["userAId", "userBId"],
                    created_at: "existing-time",
                }),
            } as any);

            const result = await controller.createConversation(
                "userAId",
                "userBId",
            );

            expect(setDoc).not.toHaveBeenCalled();

            expect(result).toEqual({
                conversationId: "userAId_userBId",
                participantIds: ["userAId", "userBId"],
                created_at: "existing-time",
            });
        });

        it("generates deterministic conversation IDs", async () => {
            vi.mocked(getDoc).mockResolvedValue({
                exists: () => false,
            } as any);

            const result = await controller.createConversation(
                "zebra",
                "alpha",
            );

            expect(result.conversationId).toBe("alpha_zebra");
        });
    });

    describe("getConversationById", () => {
        it("returns null when the conversation does not exist", async () => {
            vi.mocked(getDoc).mockResolvedValue({
                exists: () => false,
            } as any);

            const result = await controller.getConversationById("missing-id");

            expect(result).toBeNull();
        });

        it("returns a conversation when found", async () => {
            vi.mocked(getDoc).mockResolvedValue({
                exists: () => true,
                id: "conversation-1",
                data: () => ({
                    participantIds: ["userAId", "userBId"],
                    created_at: "mock-time",
                }),
            } as any);

            const result =
                await controller.getConversationById("conversation-1");

            expect(result).toEqual({
                conversationId: "conversation-1",
                participantIds: ["userAId", "userBId"],
                created_at: "mock-time",
            });
        });
    });

    describe("getUserConversation", () => {
        it("returns a list of user conversations", async () => {
            vi.mocked(getDocs).mockResolvedValue({
                docs: [
                    {
                        id: "conversation-1",
                        data: () => ({
                            participantIds: ["userAId", "userBId"],
                            created_at: "time-1",
                        }),
                    },
                    {
                        id: "conversation-2",
                        data: () => ({
                            participantIds: ["userAId", "userC"],
                            created_at: "time-2",
                        }),
                    },
                ],
            } as any);

            const result = await controller.getUserConversation("userAId");

            expect(where).toHaveBeenCalledWith(
                "participantIds",
                "array-contains",
                "userAId",
            );

            expect(orderBy).toHaveBeenCalledWith("last_message_at", "desc");

            expect(result).toEqual([
                {
                    conversationId: "conversation-1",
                    participantIds: ["userAId", "userBId"],
                    created_at: "time-1",
                },
                {
                    conversationId: "conversation-2",
                    participantIds: ["userAId", "userC"],
                    created_at: "time-2",
                },
            ]);
        });
    });

    describe("updateLastMessage", () => {
        it("updates the last message for a conversation", async () => {
            await controller.updateLastMessage("conversation-1", "Hello world");

            expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
                last_message: "Hello world",
                last_message_at: "mock-timestamp",
            });
        });
    });

    describe("Firestore helper calls", () => {
        it("calls serverTimestamp when creating conversations", async () => {
            vi.mocked(getDoc).mockResolvedValue({
                exists: () => false,
            } as any);

            await controller.createConversation("userAId", "userBId");

            expect(serverTimestamp).toHaveBeenCalled();
        });

        it("calls serverTimestamp when updating messages", async () => {
            await controller.updateLastMessage("conversation-1", "Test");

            expect(serverTimestamp).toHaveBeenCalled();
        });
    });
});

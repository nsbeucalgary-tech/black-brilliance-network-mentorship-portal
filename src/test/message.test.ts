/* eslint-disable @typescript-eslint/no-explicit-any */

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
    serverTimestamp,
} from "firebase/firestore";

import { MessageController } from "../services/MessageController";

vi.mock("firebase/firestore", () => ({
    addDoc: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    onSnapshot: vi.fn(),
    orderBy: vi.fn(),
    query: vi.fn(),
    updateDoc: vi.fn(),
    where: vi.fn(),
    serverTimestamp: vi.fn(() => "mock-ts"),
}));

describe("MessageController", () => {
    let controller: MessageController;

    beforeEach(() => {
        vi.clearAllMocks();
        controller = new MessageController({} as any);

        vi.mocked(collection).mockReturnValue({} as any);
        vi.mocked(doc).mockReturnValue({} as any);
        vi.mocked(query).mockReturnValue({} as any);
    });

    describe("sendMessage", () => {
        it("throws if message is empty", async () => {
            await expect(
                controller.sendMessage("c1", "u1", "   "),
            ).rejects.toThrow("Message text cannot be empty");
        });

        it("throws if message exceeds limit", async () => {
            await expect(
                controller.sendMessage("c1", "u1", "x".repeat(2001)),
            ).rejects.toThrow("Message exceeds 2000 character limit");
        });

        it("creates message and updates conversation", async () => {
            vi.mocked(addDoc).mockResolvedValue({ id: "m1" } as any);

            vi.mocked(serverTimestamp).mockReturnValue("mock-ts" as any);

            const result = await controller.sendMessage("c1", "u1", "hello");

            expect(collection).toHaveBeenCalledWith(
                expect.anything(),
                "conversations",
                "c1",
                "messages",
            );

            expect(addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    senderId: "u1",
                    text: "hello",
                }),
            );

            expect(updateDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    last_message: "hello",
                    last_message_at: "mock-ts",
                }),
            );

            expect(result).toEqual({
                messageId: "m1",
                senderId: "u1",
                text: "hello",
                created_at: "mock-ts",
            });
        });
    });

    describe("getConversationMessages", () => {
        it("returns messages ordered by time", async () => {
            vi.mocked(getDocs).mockResolvedValue({
                docs: [
                    {
                        id: "m1",
                        data: () => ({
                            senderId: "u1",
                            text: "hi",
                            created_at: "t1",
                        }),
                    },
                ],
            } as any);

            const result = await controller.getConversationMessages("c1");

            expect(orderBy).toHaveBeenCalledWith("created_at", "asc");

            expect(result.length).toBe(1);
            expect(result[0].messageId).toBe("m1");
        });
    });

    describe("getUserMessages", () => {
        it("filters by senderId", async () => {
            vi.mocked(getDocs).mockResolvedValue({
                docs: [
                    {
                        id: "m1",
                        data: () => ({
                            senderId: "u1",
                            text: "hi",
                            created_at: "t1",
                        }),
                    },
                ],
            } as any);

            await controller.getUserMessages("c1", "u1");

            expect(where).toHaveBeenCalledWith("senderId", "==", "u1");
        });
    });

    describe("subscribeToMessages", () => {
        it("calls callback with messages", () => {
            const callback = vi.fn();

            vi.mocked(onSnapshot).mockImplementation((_q, cb: any) => {
                cb({
                    docs: [
                        {
                            id: "m1",
                            data: () => ({
                                senderId: "u1",
                                text: "hello",
                                created_at: "t1",
                            }),
                        },
                    ],
                });

                return vi.fn();
            });

            controller.subscribeToMessages("c1", callback);

            expect(callback).toHaveBeenCalled();
        });
    });
});

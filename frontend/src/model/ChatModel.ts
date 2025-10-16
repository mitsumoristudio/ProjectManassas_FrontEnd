

export type ChatRole = "system" | "user" | "assistant"| "admin";

export interface ChatMessageModel {
    role: ChatRole;
    messageContent: string;
    sessionId: string;
    createdAt: string;
}

export interface ChatSessionModel {
    sessionId: string;
    messageContent: ChatMessageModel[];
}
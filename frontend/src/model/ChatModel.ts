

export type ChatRole = "system" | "user" | "assistant"| "admin";

export interface ChatMessageModel {
    role: ChatRole;
    messageContent: string;
    sessionId: string;
    createdAt: string;
    sources: ChatSnippetModel[];
}

export interface ChatSessionModel {
    sessionId: string;
    messageContent: ChatMessageModel[];
}

export interface ChatSnippetModel {
    documentId: string;
    pageNumber: number;
    snippet: string;
}
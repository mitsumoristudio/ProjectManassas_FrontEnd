import React, {
    createContext,
    useContext,
    useRef,
    useState,
} from "react";
import { PROJECT_CHAT } from "../util/urlconstants";

export type ChatMessage = {
    sessionId: string;
    role: "user" | "assistant";
    messageContent: string;
    payload?: any;
    createdAt: string;
};

type ChatContextType = {
    messages: ChatMessage[];
    sendMessage: (content: string) => Promise<void>;
    streamingMessage: string | null;
    isTyping: boolean;
    sessionId: string;
};

const ChatContext = createContext<ChatContextType | null>(null);
export const useChat = () => useContext(ChatContext);

type ChatProviderProps = { children: React.ReactNode };

export default function ProjectChatProvider({ children }: ChatProviderProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    // ✅ ONE session per chat
    const sessionIdRef = useRef<string>(crypto.randomUUID());

    const sendMessage = async (content: string) => {
        const sessionId = sessionIdRef.current;

        const userMessage: ChatMessage = {
            sessionId,
            role: "user",
            messageContent: content,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        setStreamingMessage("");

        const response = await fetch(PROJECT_CHAT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, message: content }),
        });

        if (!response.ok) {
            setIsTyping(false);
            throw new Error("Chat request failed");
        }

        // ✅ Plain text response
        const text = await response.text();

        setIsTyping(false);
        setStreamingMessage(null);

        setMessages(prev => [
            ...prev,
            {
                sessionId,
                role: "assistant",
                messageContent: text,
                createdAt: new Date().toISOString(),
            },
        ]);
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                sendMessage,
                streamingMessage,
                isTyping,
                sessionId: sessionIdRef.current,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

import React, { useState, useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import {useSendMessageMutation} from "../../features/chatapiSlice";
import {ChatSuggestions} from "./ChatSuggestions";

export function ChatPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [sessionId] = useState("session-1234");
    const [inProgressMessage, setInProgressMessage] = useState<any>(null);
    const responseControllerRef = useRef(null);

    const [sendMessage, {isLoading}] = useSendMessageMutation();

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage = {
            role: "user",
            messageContent: text,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInProgressMessage({role: "assistant", messageContent: "..."});

        try {
            const session = {
                sessionId,
                messages: [userMessage],
            };

            const response: any = await sendMessage(session).unwrap();

            if (response?.messageContent) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: response.role,
                        messageContent: response.messageContent,
                        createdAt: response.createdAt,
                    },
                ]);
            }

        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setInProgressMessage(null);
        }
        // const cancelCurrentResponse = () => {
        //     if (messages) setMessages((prev: any) => [...prev, messages]);
        //     responseControllerRef.current;
        //     setMessages([]);
        //
        // const addUserMessage = async (userMessage: any) => {
        //     cancelCurrentResponse();
        // }
        // }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-800">
            <div className="flex-1 overflow-y-auto p-4">
                <ChatMessageList
                    messages={messages}
                    inProgressMessage={inProgressMessage}
                    noMessagesContent="Start a with AI Construction Assistant...)"
                />
            </div>
            <div className="p-4 border-t bg-white">
                <ChatInput onSend={handleSendMessage} disabled={isLoading}/>
            </div>
        </div>
    );
}

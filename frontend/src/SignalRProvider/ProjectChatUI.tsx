import React, {useEffect, useRef, useState} from "react";
import {useChat} from "../SignalRProvider/ProjectChatProvider";

export function ProjectChatUI() {
    const {
        messages,
        sendMessage,
        streamingMessage,
        isTyping,
    } = useChat()!;

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    /* ---------- Auto-scroll ---------- */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingMessage]);

    /* ---------- Send ---------- */
    const handleSend = async () => {
        if (!input.trim() || !isTyping) return;
        await sendMessage(input.trim());
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <div className="flex h-screen flex-col bg-gray-50">
                {/* ---------- Header ---------- */}
                <div className="flex items-center justify-between border-b bg-white px-4 py-2">
                    <h1 className="text-md font-semibold">Project Chat</h1>
                    {isTyping && (
                        <span className="text-xs font-medium text-blue-600">
                        Assistant is typing…
                    </span>
                    )}
                </div>

                {/* ---------- Messages ---------- */}
                <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-900"
                                }`}
                            >
                                {message.messageContent}
                            </div>
                        </div>
                    ))}

                    {/* ---------- Streaming ---------- */}
                    {isTyping && streamingMessage && (
                        <div className="flex justify-start">
                            <div className="max-w-[70%] rounded-2xl bg-white px-4 py-2 text-sm text-gray-900 shadow">
                                <span>{streamingMessage}</span>
                                <span className="ml-1 inline-block animate-pulse">▍</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* ---------- Input ---------- */}
                <div className="border-t bg-white px-4 py-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Ask something..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isTyping}
                            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm
                                   focus:border-blue-500 focus:outline-none focus:ring-2
                                   focus:ring-blue-500 disabled:bg-gray-100"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isTyping || !input.trim()}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white
                                   hover:bg-blue-700 disabled:cursor-not-allowed
                                   disabled:bg-gray-300"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectChatUI;
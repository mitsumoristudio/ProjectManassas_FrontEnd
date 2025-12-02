import React, {useState, useRef, useEffect} from "react";
import {useChat} from "./ChatRProvider";
import MessageBubble from "../SignalRProvider/MessageBubble"
import TypingIndicator from "./TypingIndicator";
import ChatProjectList from "../SignalRProvider/ChatProjectList";
import ChatProjectDetail from "../SignalRProvider/ChatProjectDetail";
import {NavLink} from "react-router-dom";
import ChatCreateProject from "../SignalRProvider/ChatCreateProject";


export function ChatUI() {

    const {
        messages,
        streamingMessage,
        isTyping,
        sendMessage,
        projects,
    }: any = useChat();

    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage("SM", input.trim());
        setInput("");
    };

    // Auto-scroll on new messages or streamed chunks
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, streamingMessage, isTyping]);

    return (
        <div className="flex flex-col h-screen bg-white">

            {/* ChatCreateProject*/}
            <ChatCreateProject />

            {/* HEADER */}
            <div className="p-4 border-b text-xl font-semibold bg-gray-50">
                <NavLink to={"/"}>
                    Mori Solution Chat
                </NavLink>

            </div>

            {/* MESSAGE LIST */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

                {selectedProject ? (
                    <ChatProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
                ) : (
                    projects.length > 0 && (
                        <ChatProjectList
                            projects={projects}
                            onSelect={setSelectedProject}
                        />
                    )
                )}

                {/*{projects?.length > 0 && (*/}
                {/*    <ChatProjectList*/}
                {/*        projects={projects}*/}
                {/*        onSelect={(p => sendMessage("SM", `find project ${p.projectNumber}`))}*/}
                {/*/>*/}
                {/*)}*/}

                {messages.map((m: any, i: number) => (
                    <MessageBubble
                        key={i}
                        message={m.message}
                        ai={m.user === "assistant"}
                    />
                ))}

                {/* STREAMING MESSAGE */}
                {streamingMessage && (
                    <MessageBubble message={streamingMessage} ai />
                )}

                {/* TYPING */}
                {isTyping && !streamingMessage && (
                    <TypingIndicator/>
                )}

                <div ref={bottomRef}/>
            </div>

            {/* INPUT BAR */}
            <div className="p-4 border-t bg-gray-50 flex gap-2">

                <input
                    className="flex-1 border rounded-xl px-4 py-2 focus:outline-none"
                    placeholder="Send a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
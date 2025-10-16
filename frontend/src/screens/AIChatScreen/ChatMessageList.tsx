import {useEffect, useRef} from "react";
import CustomLoader from "../../components/Layout/CustomLoader";
import {ChatMessageItem} from "./ChatMessageItem";

export default function ChatMessageList({
                                            messages,
                                            inProgressMessage,
                                            noMessagesContent,
                                        }: {messages: any, inProgressMessage: any, noMessagesContent: any}) {
    const containerRef = useRef(null);

    // Determine if message list is empty
    const isEmpty = !messages?.some(
        (m: any) => (m.role === "user" || m.role === "assistant") && m.text?.trim()
    );

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        const container = containerRef.current;
        // if (container) {
        //     container.scrollTop = container.scrollHeight;
        // }
    }, [messages, inProgressMessage]);

    return (
        <div className="message-list-container">
            <div
                className={`w-full max-w-3xl mx-auto flex flex-col gap-2 overflow-y-auto message-list ${
                    inProgressMessage ? "in-progress" : ""
                }`}
                ref={containerRef}
            >
                {messages.map((message: any, index: any) => (
                    <ChatMessageItem key={index} message={message} />
                ))}

                {inProgressMessage && (
                    <>
                        <ChatMessageItem message={inProgressMessage} inProgress />
                        <CustomLoader />
                    </>
                )}

                {!inProgressMessage && isEmpty && (
                    <div className="text-gray-500 text-center mt-4">
                        {noMessagesContent || "No messages yet."}
                    </div>
                )}
            </div>
        </div>
    );
}
import {useEffect, useRef} from "react";
import CustomLoader from "../../components/Layout/CustomLoader";
import ChatMessageItem from "./ChatMessageItem";

export default function ChatMessageList({ messages, inProgressMessage, noMessagesContent }: any) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages, inProgressMessage]);

    const isEmpty = !messages?.some((m: any) => m.role && m.text?.trim());

    return (
        <div className="flex-1 overflow-y-auto p-2" ref={containerRef}>
            {messages.map((m: any, idx: number) => (
                <ChatMessageItem key={idx} message={m} />
            ))}
            {inProgressMessage && (
                <>
                    <ChatMessageItem message={inProgressMessage} />
                    <CustomLoader />
                </>
            )}
            {!inProgressMessage && isEmpty && (
                <div className="text-gray-900 text-center">{noMessagesContent || "No messages yet."}</div>
            )}
        </div>
    );
}
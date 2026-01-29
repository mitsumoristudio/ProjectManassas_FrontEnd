import React from "react";
import {useEffect, useRef} from "react";
import CustomLoader_Small from "../../components/Layout/CustomLoader_Small";
import ChatMessageItem from "./ChatMessageItem";

export function ChatMessageList({ messages, inProgressMessage, noMessagesContent, showSources = false, onSpeakHandler,
                                    onPause, onResume, onStop, isPlaying, isPaused }:
                                {   messages: any,
                                    inProgressMessage: any,
                                    noMessagesContent: any,
                                    showSources?: boolean,
                                    onSpeakHandler?: (text: string) => void,
                                    onPause?: () => void,
                                    onResume?: () => void,
                                    onStop?: () => void,
                                    isPlaying?: boolean,
                                    isPaused?: boolean,
                                    }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages, inProgressMessage]);

    const isEmpty = !messages?.some((m: any) => m.role && m.text?.trim());

    return (
        <div className="flex-1 overflow-y-auto p-2" ref={containerRef}>
            {messages?.map((m: any, idx: number) => (
                <ChatMessageItem
                    key={idx}
                    message={m}
                    showSources={showSources}
                    onSpeak={onSpeakHandler}
                    inProgress={inProgressMessage}
                    onPause={onPause}
                    onResume={onResume}
                    onStop={onStop}
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                />
            ))}

            {inProgressMessage && (
                <>
                    <ChatMessageItem message={messages}
                                     showSources={showSources} inProgress={inProgressMessage}
                    />

                    <CustomLoader_Small/>
                </>
            )}
            {!inProgressMessage && isEmpty && (
                <div className="text-gray-900 text-center"> {noMessagesContent || "No messages yet."}</div>
            )}
        </div>
    );
}
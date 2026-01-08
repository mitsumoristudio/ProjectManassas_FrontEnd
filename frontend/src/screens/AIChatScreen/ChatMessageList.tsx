import React from "react";
import {useEffect, useRef} from "react";
//import CustomLoader from "../../components/Layout/CustomLoader";
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
                                     showSources={showSources} inProgress={inProgressMessage}                    />
                    <div
                        /*Loader Component*/
                        className="grid min-h-[180px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                        <svg className="w-24 h-24 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path
                                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                stroke="currentColor" strokeWidth="5" strokeLinejoin="round"
                               ></path>
                            <path
                                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                                className="text-gray-900">
                            </path>
                        </svg>
                    </div>
                </>
            )}
            {!inProgressMessage && isEmpty && (
                <div className="text-gray-900 text-center"> {noMessagesContent || "No messages yet."}</div>
            )}
        </div>
    );
}
import React, { useEffect, useState, useRef } from "react";
import ChatCitation from "./ChatCitation";
import Markdown from "react-markdown";
// import {useSendSemanticAIMessageMutation} from "../../features/chatapiSlice";
import {BotIcon, User, MicIcon, PauseIcon, CircleStop, PlayCircle} from "lucide-react";
import {Button} from "@mui/material";


interface ChatMessageItemProps {
    message: any,
    inProgress: boolean,
    showSources?: boolean,
    onSpeak?: (text: string) => void,
    onPause?: () => void,
    onResume?: () => void,
    onStop?: () => void,
    isPlaying?: boolean,
    isPaused?: boolean,
}


export default function ExcelMessageItem({
                                            message,
                                            inProgress = false,
                                            showSources = false,
                                            onSpeak,
                                            onPause,
                                            onResume,
                                            onStop,
                                            isPaused,
                                            isPlaying,
                                        }: ChatMessageItemProps) {

    const [citations, setCitations] = useState<{ file: string; page: number | null; quote: string }[]>([]);

    useEffect(() => {
        if (!inProgress && message?.role === "assistant" && (message?.text || message?.messageContent)) {
            const text = message.text || message.messageContent;
            const regex = /<citation filename='([^']*)' page_number='(\d*)'>(.*?)<\/citation>/g;
            const matches = [...text.matchAll(regex)];

            if (matches.length > 0) {
                setCitations(
                    matches.map((m) => ({
                        file: m[1],
                        page: m[2] ? parseInt(m[2], 10) : null,
                        quote: m[3],
                    }))
                );
            }
        }
    }, [message, inProgress]);

    if (!message) return null;

    // ❌ ERROR STATE
    if (message.error) {
        return (
            <div className="bg-red-100 text-red-900 px-3 py-2 rounded-md max-w-full mx-2 text-sm">
                {typeof message.error === "string"
                    ? message.error
                    : JSON.stringify(message.error)}
            </div>
        );
    }

    // ✅ USER MESSAGE
    if (message.role === "user") {
        return (
            <div className="flex justify-end gap-2 sm:gap-4 px-2 sm:px-4 my-2 sm:my-4">

                <div className="bg-blue-500 text-white rounded-2xl px-3 py-2 sm:px-5 sm:py-4
                                text-sm sm:text-base max-w-[90%] sm:max-w-[70%] break-words shadow">
                    {message.text || message.messageContent}
                </div>

                <div className="p-1 sm:p-2 rounded-full">
                    <User className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" />
                </div>
            </div>
        );
    }

    // ✅ ASSISTANT MESSAGE
    if (message.role === "assistant") {
        return (
            <div className="flex gap-2 sm:gap-4 px-2 sm:px-6 py-2 sm:py-4">

                {/* ICON */}
                <div className="justify-items-start p-2 rounded-md ">
                    <BotIcon className="h-2 w-2 sm:h-6 sm:w-6 text-blue-700" />
                </div>

                {/* MESSAGE BOX */}
                <div className="bg-gray-100 rounded-xl shadow
                                px-3 py-2 sm:px-5 sm:py-4
                                w-full max-w-full sm:max-w-xl flex flex-col gap-2">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                        <div className="font-semibold text-black text-sm sm:text-base">
                            AI Assistant
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex flex-wrap gap-2">

                            <Button size="small"
                                    className="bg-blue-400 hover:bg-blue-600 rounded-md min-w-0 px-2"
                                    onClick={() => onSpeak?.(message.text || message.messageContent)}>
                                <MicIcon size={16} />
                            </Button>

                            {isPlaying && (
                                <Button size="small"
                                        className="bg-yellow-400 rounded-md min-w-0 px-2"
                                        onClick={() => onPause?.()}>
                                    <PauseIcon size={16} />
                                </Button>
                            )}

                            {isPaused && (
                                <Button size="small"
                                        className="bg-green-400 rounded-md min-w-0 px-2"
                                        onClick={() => onResume?.()}>
                                    <PlayCircle size={16} />
                                </Button>
                            )}

                            {onStop && (
                                <Button size="small"
                                        className="bg-red-400 rounded-md min-w-0 px-2"
                                        onClick={() => onStop?.()}>
                                    <CircleStop size={16} />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* MESSAGE CONTENT */}
                    <div className="text-gray-700 text-sm sm:text-base break-words">
                        <Markdown>
                            {message.text || message.messageContent}
                        </Markdown>

                        {citations?.map((c, i) => (
                            <ChatCitation
                                key={i}
                                file={c.file}
                                page={c.page}
                                quote={c.quote}
                                pageNumber={c.page}
                            />
                        ))}
                    </div>

                    {/* SOURCES */}
                    {showSources && message.sources?.length > 0 && (
                        <div className="mt-2 border-t pt-2 text-xs sm:text-sm">
                            <div className="font-medium mb-1">Sources:</div>
                            <ul className="list-disc list-inside space-y-1">
                                {message.sources.map((src: any, i: number) => (
                                    <li key={i}>
                                        <ChatCitation
                                            file={src.documentId}
                                            page={src.pageNumber}
                                            quote={src.snippet}
                                            pageNumber={src.pageNumber}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        );
    }

    return null;
}
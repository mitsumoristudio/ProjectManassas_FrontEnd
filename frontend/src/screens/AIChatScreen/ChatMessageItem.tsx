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

export default function ChatMessageItem({message, inProgress = false, showSources = false, onSpeak, onPause, onResume, onStop, isPaused, isPlaying}: ChatMessageItemProps) {

    const [citations, setCitations] = useState<{ file: string; page: number | null; quote: string }[]>([]);

    useEffect(() => {
        if (!inProgress && message?.role === "assistant" && message?.text?.length > 0) {
            const regex = /<citation filename='([^']*)' page_number='(\d*)'>(.*?)<\/citation>/g;
            const matches = [...message.text.matchAll(regex)];
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

    // Handle error messages
    if (message.error) {
        return (
            <div className="bg-red-100 text-red-900 px-4 py-2 rounded-md max-w-md self-center break-words">
                {typeof message.error === "string" ? message.error : JSON.stringify(message.error, null, 2)}
            </div>
        );
    }

    if (message.role === "user") {
        return (
            <div className={"flex flex-1 my-4 gap-4 mx-2 items-start justify-end px-4"}>
                <div className="p-2 rounded-full bg-gray-100 border border-gray-200">
                    <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="my-2 bg-blue-600 text-white rounded-br-sm break-words max-w-[95%] rounded-2xl px-6 py-6 text-lg shadow-lg whitespace-normal ">
                    {message.text || message.messageContent}

                </div>

            </div>

        );
    }

    if (message.role === "assistant") {
        return (
            <section className={"flex flex-1 my-1 gap-4 items-start justify-items-start px-6 py-6"}>
                <div className="p-2 rounded-full bg-blue-50 border border-blue-100">
                    <BotIcon className="h-6 w-6 text-blue-700" />
                </div>
                <div className="bg-gray-100 px-6 py-3 text-md rounded-lg shadow-lg max-w-xl mb-2 flex flex-col gap-2">
                    <div className="flex mx-2 gap-y-4 my-2 justify-between">
                        <div className="font-semibold">AI Assistant</div>

                        <div className={"flex gap-2"}>
                            {/* SPEECH 🔊  */}
                            <Button className={"gap-2 mx-auto bg-blue-400 hover:bg-blue-600 scale-x-100 opacity-90 rounded-lg"}
                                    onClick={() => onSpeak?.(message.text || message.messageContent)}>
                                <MicIcon size={24} />
                            </Button>

                            {/* Pause ⏸  */}
                            {isPlaying && (
                                <Button className={"bg-yellow-400 hover: bg-yellow-600 rounded-lg"}
                                        onClick={() => onPause()}>
                                    <PauseIcon size={24} />
                                </Button>
                            )}

                            {/* Resume ▶️  */}
                            {isPaused && (
                                <Button className={"bg-green-400 hover: bg-green-600 rounded-lg"}
                                        onClick={() => onResume()}>
                                    <PlayCircle size={24} />
                                </Button>
                            )}

                            {/* Stop ⏹ */}
                            {onStop && (
                                <Button className={"bg-red-400 hover: bg-red-600 rounded-lg"}
                                        onClick={() => onStop()}>
                                    <CircleStop size={24} />
                                </Button>

                            )}


                        </div>




                    </div>


                    <div className="ml-2 rounded-br-sm break-words max-w-[95%] text-gray-700 text-xl ">
                        <Markdown>{message.text || message.messageContent}</Markdown>
                        {citations?.map((c, i) => (
                            <ChatCitation file={c.file}
                                          page={c.page}
                                          quote={c.quote}
                                          pageNumber={c.page} />
                        ))}
                    </div>


                    {/* Render sources if toggle is on */}
                    {showSources &&
                        message.sources?.length > 0 && (
                            <div className="mt-2 border-t border-gray-400 pt-2">
                                <div className={"text-sm text-gray-800 font-medium mb-1"}>
                                    Sources:
                                </div>
                                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
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
            </section>

        );
    }

    return null;
}


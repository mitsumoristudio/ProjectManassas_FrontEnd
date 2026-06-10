import React, { useEffect, useState, useRef } from "react";
import ChatCitation from "./ChatCitation";
import Markdown from "react-markdown";
// import {useSendSemanticAIMessageMutation} from "../../features/chatapiSlice";
import {BotIcon, User, MicIcon, PauseIcon, CircleStop, PlayCircle} from "lucide-react";
import {Button} from "@mui/material";
import {useSelector} from "react-redux";
import {assets} from "../../assets/assets";


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

    const {userInfo} = useSelector((state: any) => state.auth)

    const uniquePages = [
        ...new Set(
            (message.sources ?? [])
                .map((s: any) => s.PageNumber ?? s.pageNumber)
                .filter(Boolean)
        )
    ];

    useEffect(() => {
        if (!inProgress && message?.role === "assistant" && message?.text?.length > 0) {
            const regex = /<citation filename='([^']*)' page_number='(\d*)'>(.*?)<\/citation>/g;
            const matches = [...message.text.matchAll(regex)];
            if (matches.length > 0) {
                setCitations(
                    matches.map((m) => ({
                        formFile: m[1],
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
            <div className={"flex flex-1 my-2 gap-4 mx-2 items-start justify-center px-4"}>
                <div className="p-2 rounded-full">
                    <div className='flex-shrink-0'>
                        <div
                            className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-sm text-white font-medium'>

                            {userInfo?.userName?.split(" ")
                                ?.map(name => name[0])
                                ?.slice(0, 10)
                                ?.join("")
                                ?.toUpperCase()}
                        </div>
                    </div>
                </div>
                <div className="my-2 bg-gray-100 text-gray-600 rounded-br-sm break-words max-w-[95%] rounded-2xl px-4 py-5 font-serif text-base shadow-md whitespace-normal ">
                    {message.text || message.messageContent}

                </div>

            </div>

        );
    }

    if (message.role === "assistant") {
        return (
            <section className={"flex w-full my-1 gap-4 items-start justify-center px-8 py-6"}>
                <div className="p-2 rounded-full ">
                    <img
                        alt=""
                        src={assets.mori_solution_logo2}
                        className="h-10 w-10 rounded-3xl shadow-md"
                    />
                </div>
                <div className="bg-white px-8 py-6 text-md rounded-2xl shadow-lg w-full max-w-6xl flex flex-col gap-4">


                    <div className="flex mx-3 gap-y-2 my-2 items-center">
                        <div className="font-light"> Document Response</div>

                        <div className={"flex"}>
                            {/* SPEECH 🔊  */}
                            <Button className={"gap-2 mx-auto bg-gray-400 hover:bg-blue-200 scale-x-100 opacity-90 rounded-lg"}
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


                    <div className="ml-2 rounded-br-sm break-words max-w-[95%] text-gray-600 text-base font-serif ">
                        <Markdown>{message.text || message.messageContent}</Markdown>

                        {uniquePages.length > 0 && (
                                <div className="mt-2 border-t pt-3">
                                    <h4 className={"text-md text-gray-800 font-medium mb-1 py-2"}>
                                        Source Page:
                                    </h4>

                                    {uniquePages.map((page: number) => (
                                        <span
                                            key={page}
                                            className="px-3 py-1 bg-blue-300 text-blue-800 rounded-full mx-2 text-sm"
                                        > Page {page} </span>
                                    ))}
                                </div>
                            )}
                    </div>

                </div>
            </section>

        );
    }

    return null;
}


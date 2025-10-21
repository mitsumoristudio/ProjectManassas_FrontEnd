import React, { useEffect, useState } from "react";
import ChatCitation from "./ChatCitation";
import Markdown from "react-markdown";
import {useSendSemanticAIMessageMutation} from "../../features/chatapiSlice";

export default function ChatMessageItem({ message, inProgress = false, showSources = false, }: {
    message: any; inProgress?: boolean, showSources?: boolean  }) {

    const [citations, setCitations] = useState<{ file: string; page: number | null; quote: string }[]>([]);
    const [sendSemanticAIMessage] = useSendSemanticAIMessageMutation();

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
            <div className="bg-blue-300 text-blue-800 px-4 py-2 my-4 rounded-md self-end max-w-md break-words ">
                {message.text || message.messageContent}
            </div>
        );
    }

    if (message.role === "assistant") {
        return (
            <div className="bg-gray-300 px-4 py-3 text-md rounded-md max-w-lg mb-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="font-semibold">Assistant</div>
                </div>

                <div className="ml-2">
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
        );
    }

    return null;
}
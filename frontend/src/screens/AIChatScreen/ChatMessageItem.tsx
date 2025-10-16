import {useEffect, useState} from "react";
import ChatCitation from "./ChatCitation";
import Markdown from "react-markdown";

export function ChatMessageItem({
                                    message,
                                    inProgress = false,
                                }: {
    message: any;
    inProgress?: boolean;
}) {
    const [citations, setCitations] = useState([]);

    // Normalize the message shape from backend → frontend
    const normalizedRole =
        message.role?.toLowerCase?.() || message.userRole?.toLowerCase?.() || "assistant";
    const normalizedText = message.text || message.messageContent || "";

    // Parse citations
    useEffect(() => {
        if (!inProgress && normalizedRole === "assistant" && normalizedText.length > 0) {
            const regex =
                /<citation filename='([^']*)' page_number='(\d*)'>(.*?)<\/citation>/g;
            const matches = [...normalizedText.matchAll(regex)];
            if (matches.length > 0) {
                const parsed = matches.map((m) => ({
                    file: m[1],
                    page: m[2] ? parseInt(m[2], 10) : null,
                    quote: m[3],
                }));
                // @ts-ignore
                setCitations(parsed);
            }
        }
    }, [normalizedText, normalizedRole, inProgress]);

    // 💬 User Message
    if (normalizedRole === "user") {
        return (
            <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-md self-end max-w-md break-words">
                {normalizedText}
            </div>
        );
    }

    // 🤖 Assistant Message
    if (normalizedRole === "assistant") {
        return (
            <div className="bg-gray-100 px-4 py-3 rounded-md max-w-lg mb-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="text-gray-500">
                        {/* Assistant icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                            />
                        </svg>
                    </div>
                    <div className="font-semibold">Assistant</div>
                </div>

                <div className="ml-7">
                    <Markdown>{normalizedText}</Markdown>

                    {citations?.map((c: any, i: number) => (
                        <ChatCitation key={i} file={c.file} page={c.page} quote={c.quote} pageNumber={c.pageNumber}/>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
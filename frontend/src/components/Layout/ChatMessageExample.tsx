
import {BotIcon, User} from "lucide-react";
import React from "react";
import cn from "../../util/util";

interface ChatMessageProps {
    role: "user" | "assistant";
    message: string;
    timestamp?: string;
}

export default function ChatMessageExample({role, message, timestamp}: ChatMessageProps) {
    const isUser = role === "user";
    return (
        <>
            <div
                className={cn(
                    "flex w-full gap-3 mb-6",
                    isUser ? "justify-end" : "justify-start"
                )}
            >
                {/* Avatar or Icon */}
                {!isUser && (
                    <div className="flex items-start">
                        <div className="p-2 rounded-full bg-blue-50 border border-blue-100">
                            <BotIcon className="h-6 w-6 text-blue-700" />
                        </div>
                    </div>
                )}

                {/* Message Bubble */}
                <div
                    className={cn(
                        "max-w-[95%] rounded-2xl px-6 py-6 text-lg shadow-lg whitespace-normal",
                        isUser
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    )}
                >
                    <p className="leading-relaxed">{message}</p>

                    {timestamp && (
                        <p
                            className={cn(
                                "text-xs mt-2 text-right",
                                isUser ? "text-blue-200" : "text-gray-500"
                            )}
                        >
                            {timestamp}
                        </p>
                    )}
                </div>

                {/* User Icon */}
                {isUser && (
                    <div className="flex items-start">
                        <div className="p-2 rounded-full bg-gray-100 border border-gray-200">
                            <User className="h-6 w-6 text-gray-600" />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
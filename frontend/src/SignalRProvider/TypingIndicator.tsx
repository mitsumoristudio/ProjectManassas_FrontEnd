import React from "react";

export default function TypingIndicator() {
    return (
        <div className="flex gap-2 p-3 bg-gray-100 rounded-2xl w-20">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
        </div>
    );
}

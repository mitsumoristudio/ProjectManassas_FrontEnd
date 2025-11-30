import React from "react";


export default function MessageBubble({message, ai = false}) {
    return (
        <div
            className={`max-w-xl px-4 py-3 rounded-2xl mb-2 ${
                ai
                    ? "bg-gray-100 text-gray-800 self-start"
                    : "bg-blue-600 text-white self-end"
            }`}
        >
            {message}
        </div>
    )
}
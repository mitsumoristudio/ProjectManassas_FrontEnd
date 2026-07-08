import React, { forwardRef, useImperativeHandle, useState } from "react";

interface ChatSuggestionsProps {
    onSelected: (msg: { role: string; text: string }) => void;
}

export const ChatSuggestions = forwardRef<{ clear: () => void }, ChatSuggestionsProps>(
    ({ onSelected }, ref) => {
        const [suggestions, setSuggestions] = useState<string[]>([]);

        useImperativeHandle(ref, () => ({
            clear: () => setSuggestions([]),
            update: (msgs: string[]) => setSuggestions(msgs),
        }));

        return (
            <div className="flex gap-2">
                {suggestions.map((s, idx) => (
                    <button
                        key={idx}
                        className="bg-gray-200 px-2 py-1 rounded"
                        onClick={() => onSelected({ role: "user", text: s })}
                    >
                        {s}
                    </button>
                ))}
            </div>
        );
    }
);



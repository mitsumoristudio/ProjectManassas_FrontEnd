import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {useSearchMessageQuery} from "../../features/chatapiSlice";

const ChatSuggestions = forwardRef(({ onSelected }: any, ref) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const { data } = useSearchMessageQuery(
        { query },
        { skip: query.length === 0 }
    );

    useEffect(() => {
        if (data) {
            setSuggestions(data);
        }
    }, [data]);

    useImperativeHandle(ref, () => ({
        clear: () => setSuggestions([]),
        update: (messages: any[]) => {
            const lastUserMsg = messages.filter(m => m.role === "user").slice(-1)[0];
            if (lastUserMsg) setQuery(lastUserMsg.messageContent);
        },
    }));

    return (
        <div className="chat-suggestions flex flex-col gap-1">
            {suggestions.map((s: string, idx: number) => (
                <button
                    key={idx}
                    className="text-left text-sm text-gray-700 hover:text-gray-900"
                    onClick={() => onSelected(s)}
                >
                    {s}
                </button>
            ))}
        </div>
    );
});

export default ChatSuggestions;

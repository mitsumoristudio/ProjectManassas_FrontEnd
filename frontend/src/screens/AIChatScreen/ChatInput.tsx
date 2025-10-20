import React, { useState } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;
        onSend(inputValue.trim());
        setInputValue(""); // Clear input after send
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 text-gray-900 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />
            <button
                onClick={handleSend}
                disabled={disabled}
                className={`px-4 py-2 rounded-full text-white ${
                    disabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                Send
            </button>
        </div>
    );
};

export default ChatInput;

import React, { useState } from "react";
import ToggleSwitch from "../../components/Layout/ToggleSwitch.jsx";
// import PromptSelector from "../../components/Layout/PromptSelector";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    onToggle?: (isOn: boolean )=> void;
    value: string;
    onChange : (value: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false, onToggle, value, onChange }) => {
 //   const [inputValue, setInputValue] = useState("");
    const [isDocumentMode, setIsDocumentMode] = useState(false);


    const handleSend = () => {
        if (!value?.trim()) return;
        onSend(value.trim());
        onChange("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleToggle = () => {
        setIsDocumentMode(prev => {
            const newState = !prev;
            onToggle?.(newState);
            return newState;
        });
    };


    return (
        <div className={"flex flex-col gap-2"}>

            {/* Input + send + toggle */}
        <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 text-gray-900 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />

            <button
                onClick={handleSend}
                disabled={disabled}
                className={`px-4 py-2 rounded-full text-white ${
                    disabled
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-blue-400 hover:bg-blue-800"
                }`}
            >
                Send
            </button>
            {/* Example 1: Switch with a label */}
            <ToggleSwitch labelOn={"Document Mode"}
                          labelOff={"Normal Mode"}
                          onToggle={handleToggle} />

        </div>
        </div>
    );
};

export default ChatInput;


import React, { useRef, useState } from "react";
import { ArrowRight, Square } from "lucide-react";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
    value: string;
    onChange: (value: string) => void;
}

const ChatInputRev1: React.FC<ChatInputProps> = ({
                                                     onSend,
                                                     disabled = false,
                                                     value,
                                                     onChange,
                                                     isLoading = false,
                                             }) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isDocumentMode, setIsDocumentMode] = useState(false);

    const handleSend = () => {
    if (!value?.trim()) return;
    onSend(value.trim());
    onChange("");
    };

    const handleToggle = () => {
    setIsDocumentMode(prev => {
        const newState = !prev;
        return newState;
    });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full text-black">
            <div className="border border-gray-300 rounded-[16px] bg-white ">

                {/* Chat Input */}
                <div className="px-4 pt-4">
          <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask a question..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className="w-full resize-none overflow-hidden text-base bg-transparent outline-none placeholder:text-gray-400 max-h-48"
          />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-end p-2">
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!isLoading && !value.trim()}
                        className="bg-black text-white rounded-[10px] h-8 w-8 flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
                    >
                        {isLoading ? (
                            <Square className="h-4 w-4" fill="currentColor" />
                        ) : (
                            <ArrowRight className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInputRev1;
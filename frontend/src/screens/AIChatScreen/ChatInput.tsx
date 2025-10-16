
import {useState, useRef, useEffect} from "react";

export default function ChatInput({ onSend }: any) {
    const [messageText, setMessageText] = useState("");
    const textAreaRef = useRef(null);

    // Focus the textarea (similar to FocusAsync)
    // const focus = () => {
    //     textAreaRef.current?.focus();
    // };

    const sendMessage = (e: any) => {
        e.preventDefault();
        if (messageText.trim().length > 0) {
            onSend({ role: "user", text: messageText });
            setMessageText("");
        }
    };

    // // Optional: Auto-resize textarea
    // useEffect(() => {
    //     const ta = textAreaRef.current;
    //     if (!ta) return;
    //
    //     const handleInput = () => {
    //         ta.style.height = "auto";
    //         ta.style.height = ta.scrollHeight + "px";
    //     };
    //
    //     ta.addEventListener("input", handleInput);
    //     return () => ta.removeEventListener("input", handleInput);
    // }, []);

    return (
        <form onSubmit={sendMessage} className="w-full flex items-center p-2 gap-2">
            <label className="flex-1 relative">
        <textarea
            ref={textAreaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            rows={1}
            className="w-full p-2 pr-10 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                        type="submit"
                        title="Send"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                    >
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
                                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                            />
                        </svg>
                    </button>
                </div>
            </label>
        </form>
    );
}
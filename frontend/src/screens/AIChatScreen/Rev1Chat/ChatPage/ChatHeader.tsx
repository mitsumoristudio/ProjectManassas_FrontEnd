import React from "react";

export default function ChatHeader({ onNewChat }: any) {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="flex justify-between items-center max-w-5xl mx-auto mb-2">
                <button
                    onClick={onNewChat}
                    className="flex items-center gap-2 bg-white text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100"
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
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    New chat
                </button>
            </div>

            <h1 className="max-w-5xl mx-auto text-white text-2xl font-bold">
                Mori Solution
            </h1>
        </div>
    );
}
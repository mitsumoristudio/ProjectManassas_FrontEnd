import React from "react";
import { Sparkles, FolderOpen, Search, PlusCircle } from "lucide-react";

export default function ChatIntroPanel({onSelectAction}: { onSelectAction: (cmd: string) => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6 mt-10 opacity-90">

            <Sparkles size={40} className="text-blue-500 mb-4" />

            <h2 className="text-2xl font-semibold mb-3">
                Welcome! I’m your Mori AI Assistant 👋
            </h2>

            <p className="text-gray-600 max-w-md mb-6">
                I can help you explore your projects, create new ones, or answer questions as you work.
                Try one of the actions below to get started:
            </p>

            <div className="grid grid-cols-1 gap-3 w-full max-w-sm">

                <button className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl shadow-sm"
                onClick={() => onSelectAction("list all projects")}>
                    <FolderOpen className="text-blue-500" size={22} />
                    <span className="text-gray-700">“List all projects”</span>
                </button>

                <button className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl shadow-sm"
                onClick={() => onSelectAction("find project")}>
                    <Search className="text-blue-500" size={22} />
                    <span className="text-gray-700">“Find project 1023”</span>
                </button>

                <button className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl shadow-sm"
                onClick={() => onSelectAction("create new project")}>
                    <PlusCircle className="text-blue-500" size={22} />
                    <span className="text-gray-700">“Create project Aurora Heights”</span>
                </button>
            </div>

            <p className="text-gray-500 text-sm mt-6">
                I’m here whenever you need me. 💬
            </p>
        </div>
    );
}

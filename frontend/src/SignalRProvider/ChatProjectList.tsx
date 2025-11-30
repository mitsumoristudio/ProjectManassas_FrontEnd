import React from "react";

type ProjectListProps = {
    projects: any[];
    onSelect: (project: any) => void;
}

export default function ChatProjectList({projects, onSelect}: ProjectListProps) {
    return (
        <div className="border rounded-xl p-3 bg-gray-50 mb-3">
            <div className="font-semibold mb-2">Available Projects</div>

            <div className="flex flex-col gap-2">
                {projects.map((p: any) => (
                    <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className="text-left p-3 rounded-lg border bg-white hover:bg-blue-50 transition"
                    >
                        <div className="font-semibold">{p.projectName}</div>
                        <div className="text-sm text-gray-600">{p.location}</div>
                        <div className="text-xs text-gray-400">
                            #{p.projectNumber}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
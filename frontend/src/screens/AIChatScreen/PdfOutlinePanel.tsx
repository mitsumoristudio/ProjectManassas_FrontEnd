import React from "react";

type PdfSource = {
    documentId: string;
    pageNumber: number;
    content?: string;
    snippet: string;
    score?: number;
};



export default function PdfOutlinePanel({ messages }: { messages: any[] }) {
    const sources: PdfSource[] = messages
        .flatMap(m => m.sources || [])
        .filter(Boolean);

    if (!sources.length) {
        return (
            <div className="p-4 text-sm text-gray-500">
                No document references yet
            </div>
        );
    }

    return (
        <div className="p-4 space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">
                Document Outline
            </h3>

            {sources.map((src, i) => (
                <div
                    key={i}
                    className="border rounded p-2 hover:bg-gray-50 cursor-pointer rounded-2xl shadow-md"
                >
                    <div className="text-sm font-medium text-blue-600">
                        Page {src.pageNumber}
                    </div>

                    {src.documentId && (
                        <div className="text-sm font-semibold text-gray-800">
                            {src.documentId}
                        </div>
                    )}

                    <div className="text-xs text-gray-600 line-clamp-3">
                        {src.snippet}
                    </div>
                </div>
            ))}
        </div>
    );
}

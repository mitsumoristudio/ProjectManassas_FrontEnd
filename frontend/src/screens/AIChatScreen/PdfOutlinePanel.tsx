import React from "react";
import {NotepadTextIcon} from "lucide-react"
import {Button} from "@mui/material";

type PdfSource = {
    documentId: string;
    pageNumber: number;
    content?: string;
    snippet: string;
    score?: number;
};

interface PdfOutlinePanelProps {
    messages: any[];

}


export default function PdfOutlinePanel({ messages}: PdfOutlinePanelProps) {


    const sources: PdfSource[] = messages
        .flatMap(m => m.sources || [])
        .filter(Boolean);

    if (!sources.length) {
        return (
            <div className="p-4 text-sm text-gray-600 flex flex-row items-start gap-2 my-2">
                    <NotepadTextIcon size={24} />
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

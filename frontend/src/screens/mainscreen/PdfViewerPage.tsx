import { Document, Page } from "react-pdf";
import { useState } from "react";
import React from "react";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewerPage({ url, page, highlights }) {
    const [pageWidth, setPageWidth] = useState(800);

    if (!url) {
        return (
            <div className={"flex items-center justify-center h-full text-gray-700"}>
                No PDF was selected
            </div>
        )
    }

    return (
        <div className="relative w-full h-full overflow-auto">
            <Document
                file={{ url }}
                loading={<div className="p-4">Loading PDF.... Please wait</div>}
                error={<div className="p-4 text-red-500">Failed to load PDF</div>}
                onLoadError={(err) => console.error("PDF ERROR:", err)}
            >
                <Page
                    key={page}
                    pageNumber={page}
                    width={pageWidth}
                    renderTextLayer={true}
                />
            </Document>

            {/* Highlight overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {highlights?.map((h, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: `${h.top * 100}%`,
                            left: `${h.left * 100}%`,
                            width: `${h.width * 100}%`,
                            height: `${h.height * 100}%`,
                            backgroundColor: "yellow",
                            opacity: 0.4,
                            borderRadius: "4px"
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
import React, {useState} from "react"
import PDFViewer from "@embedpdf/react-pdf-viewer";
import {PRODUCTION_PDF_URL} from "../../util/urlconstants"
import { useParams} from "react-router-dom";

export default function PDFViewerPage() {
    const {documentId} = useParams();
    var pdfUrl = `${PRODUCTION_PDF_URL.replace(/\/$/, "")}/${documentId}`;


    return (
        <div className={"h-screen"}>
            <PDFViewer
                config = {{
                    src: 'https://snippet.embedpdf.com/ebook.pdf',
                    theme: { preference: 'light' }
                }}
                />
        </div>
    )
}
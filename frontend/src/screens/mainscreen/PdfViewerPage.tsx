import React from "react";
import { useParams } from "react-router-dom";
import PDFViewer from "@embedpdf/react-pdf-viewer";
import { useGetAzureBlobUrlQuery } from "../../features/chatapiSlice";

export default function PDFViewerPage({ blobUrl }) {

    if (!blobUrl) return <div>No PDF found</div>;

    const url = blobUrl.includes("%")
        ? encodeURI(blobUrl)
        : encodeURI(blobUrl);

    return (
        <div className="h-screen">
            <PDFViewer
                config={{
                    src: url,
                    theme: { preference: "light" }
                }}
            />
        </div>
    );
}
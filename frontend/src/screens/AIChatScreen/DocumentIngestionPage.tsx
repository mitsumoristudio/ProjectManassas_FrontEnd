
import React, {useState} from "react";
import DocumentIngestion, {UploadedDocumentProp} from "../AIChatScreen/DocumentIngestion";
import {useSendDocumentEmbeddingMutation} from "../../features/chatapiSlice";

export default function DocumentIngestionPage() {
    const [documents, setDocuments] = React.useState<UploadedDocumentProp[]>([]);
    const [createPdfIngestion] = useSendDocumentEmbeddingMutation();

    // When user selects or drags files
    const handleUpload = async (files: FileList) => {
        const fileArray = Array.from(files);

        for (const file of fileArray) {
            const id = crypto.randomUUID();
            const newDoc: UploadedDocumentProp = {
                id,
                filename: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                type: file.type,
                status: "uploading",
            };

            // Add to document list as "uploading"
            setDocuments((prev) => [...prev, newDoc]);

            try {
                const response = await createPdfIngestion({file: file, documentId: file.name}).unwrap();
                console.log("Upload was success:", response);

                // Update to analyzed
                setDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === id ? { ...doc, status: "analyzed" } : doc
                    )
                );

            } catch (error) {
                console.log(error);

                setDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === id ? { ...doc, status: "error" } : doc
                    )
                );
            }

        }




    }

        const handleRemove = (id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        }

    return (
        <>
            <div className={"max-w-2xl mx-auto p-6"}>
                <DocumentIngestion
                    documents={documents}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    />
            </div>
        </>
    )

}

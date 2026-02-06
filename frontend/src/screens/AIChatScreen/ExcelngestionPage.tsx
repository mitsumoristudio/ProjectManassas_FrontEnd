
import React, {useState} from "react";
import SideBar from "../../components/Layout/Graph & Tables/SideBar";
import ExcelIngestion, {UploadExcelIngestionProps} from "../../screens/AIChatScreen/ExcelIngestion";
import {useSendExcelDocumentMutation} from "../../features/chatapiSlice";


export default function ExcelIngestionPage() {
    const [excelDocuments, setExcelDocuments] = useState<UploadExcelIngestionProps[]>([]);
    const [createExcelIngestion] = useSendExcelDocumentMutation();

    // When user selects or drags files
    const handleUpload = async (files: FileList) => {
        const fileArray = Array.from(files);

        for (const file of fileArray) {
            const id = crypto.randomUUID();
            const newDoc: UploadExcelIngestionProps= {
                id,
                fileName: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                type: file.type,
                status: "uploading",
            };

            // Add to document list as "uploading"
            setExcelDocuments((prev) => [...prev, newDoc]);

            try {
                const response = await createExcelIngestion({file: file, datasetName: file.name}).unwrap();
                console.log("Upload was success:", response);

                // Update to analyzed
                setExcelDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === id ? { ...doc, status: "analyzed" } : doc
                    )
                );

            } catch (error) {
                console.log(error);

                setExcelDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === id ? { ...doc, status: "error" } : doc
                    )
                );
            }

        }
    }
    const handleRemove = (id: string) => {
        setExcelDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }

    return (
        <>
            <div className={"bg-[#0A0A0A] text-white font-sans min-h-screen flex"}>
                <SideBar/>

                <div className={"max-w-2xl mx-auto p-6"}>
                    <ExcelIngestion
                        documents={excelDocuments}
                        onUpload={handleUpload}
                        onRemove={handleRemove}
                    />
                </div>
            </div>
        </>
    )


}
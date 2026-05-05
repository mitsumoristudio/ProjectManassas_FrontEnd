

import React, { useRef, useState } from "react";
import { ArrowRight, Square, LucideFilePlus, FolderOpenIcon, XIcon, FileTextIcon} from "lucide-react";
import DocumentIngestion, {UploadedDocumentProp} from "../../../screens/AIChatScreen/DocumentIngestion";
import {useSendDocumentEmbeddingMutation,
    useGetPdfIngestedQuery
} from "../../../features/chatapiSlice";

import {assets} from "../../../assets/assets";
import {useParams} from "react-router-dom";
import {
    useGetPlayWrightProjectListQuery,
} from "../../../features/playwrightApiSlice";



interface ChatInputProps {
    onSend: (message: string, documents?: any []) => void;
    disabled?: boolean;
    isLoading?: boolean;
    value: string;
    onChange: (value: string) => void;
}

const PlayWrightChatInput: React.FC<ChatInputProps> = ({
                                                          onSend,
                                                          disabled = false,
                                                          value,
                                                          onChange,
                                                          isLoading = false,
                                                      }) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isDocumentMode, setIsDocumentMode] = useState(false);
    const [addPdfIngestion, setAddPdfIngestion] = useState(false);
    const [usePdfIngestion, setUsePdfIngestion] = useState(false);
    const [selectedPdfs, setSelectedPdfs] = useState<any[]>([]);

    const [documents, setDocuments] = useState<UploadedDocumentProp[]>([]);
    const [createPdfIngestion] = useSendDocumentEmbeddingMutation();
    const keyword = useParams();

    const togglePdfSelection = (doc: any) => {
        setSelectedPdfs((prev) => {
            const exists = prev.some(
                (d) => d.originalFileName === doc.originalFileName
            );

            if (exists) {
                return prev.filter(
                    (d) => d.originalFileName !== doc.originalFileName
                );
            } else {
                return [...prev, doc];
            }
        });
    };

    const {
        data: pdfs = [],
        isLoading: isPdfLoading,
        isError: isPdfError,
        refetch
    } = useGetPdfIngestedQuery({keyword});

    const {
        data: playWrightProject = [],
        isLoading: isProjectLoading,
        isError: isProjectError,
    } = useGetPlayWrightProjectListQuery({keyword})


    const handleSend = () => {
        if (!value?.trim()) return;

        // onSend({
        //     message: value.trim(),
        //     documents: selectedPdfs,
        // });

        onChange("");
    };

    const handleToggle = () => {
        setIsDocumentMode(prev => {
            const newState = !prev;
            return newState;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

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

    const handleConfirmSelection = () => {
        if (selectedPdfs.length === 0) return;

        // close modal
        setUsePdfIngestion(false);

        // (optional) you could trigger something here if needed
        console.log("Selected PDFs:", selectedPdfs);
    };


    return (
        <div className="w-full text-gray-600 font-serif py-2">
            <div className="relative border border-gray-300 rounded-[16px] bg-white py-4 ">

                {/* Chat Input */}
                <div className="px-5 pt-5">

          <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask a question..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className="w-full resize-none overflow-hidden text-base bg-transparent outline-none placeholder:text-gray-400 max-h-48"
          />
                </div>

                <div className={"flex items-center justify-between  md:p-2"}>
                    <div className={"flex items-center gap-x-1 relative top-20 left-2"}>
                        <button
                            className={"text-gray-800 hover:text-blue-700 my-4 flex items-center hover:bg-gray-300 rounded-md p-2 transition duration-700"}
                            onClick={() => setAddPdfIngestion(true)}
                        >
                            <LucideFilePlus size={18} color={"gray"}
                                            className={"mx-auto sm:mx-0"}/>
                            <span className={"hidden sm:inline text-gray-600 text-sm font-mono mx-2"}>Add Documents</span>
                        </button>

                        <button
                            className={"text-gray-800 hover:text-blue-700 my-4 flex items-center hover:bg-gray-300 rounded-md p-2 transition duration-700"}
                            onClick={() => setUsePdfIngestion(true)}
                        >
                            <FileTextIcon size={18} color={"gray"}
                                          className={"mx-auto sm:mx-0"}/>
                            <span className={"hidden sm:inline text-gray-600 text-sm font-mono mx-2"}>Use Document</span>
                        </button>

                        {addPdfIngestion && (
                            <div className={"fixed inset-0 z-50 flex items-center justify-center"}>
                                <div className={"bg-white rounded-xl shadow-xl w-full max-w-md p-6"}>
                                    <button className={"left-2 rounded-1xl hover:bg-gray-600 p-1 rounded-2xl transition duration-700"}
                                            onClick={() => setAddPdfIngestion(false)}>
                                        <XIcon size={20} color="gray" />
                                    </button>
                                    <DocumentIngestion
                                        documents={documents}
                                        onUpload={handleUpload}
                                        onRemove={handleRemove}
                                    />

                                </div>
                            </div>
                        )}

                        {usePdfIngestion && (
                            <div>
                                <div className={"fixed inset-0 z-50 flex items-center justify-center"}>
                                    <div className={"bg-white rounded-2xl w-full max-w-md p-10 shadow-md"}>
                                        <h2 className={"relative left-28 justify-center items-center"}>Select Document</h2>
                                        <button className={"relative right-4 bottom-6 rounded-1xl hover:bg-gray-600 p-1 rounded-2xl transition duration-700"}
                                                onClick={() => setUsePdfIngestion(false)}>
                                            <XIcon size={20} color="gray" />
                                        </button>

                                        <ul className="space-y-3">
                                            {pdfs?.map((doc: any, index: number) => {
                                                const isSelected = selectedPdfs.some(
                                                    (d) => d.originalFileName === doc.originalFileName
                                                );

                                                return (
                                                    <li
                                                        key={index}
                                                        onClick={() => togglePdfSelection(doc)}
                                                        className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer transition
                    ${isSelected ? "bg-blue-100 border-blue-600" : "hover:bg-gray-100"}
                `}
                                                    >
                                                        <div className="flex items-center gap-2">

                                                            {/* ✅ Checkbox */}
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => togglePdfSelection(doc)}
                                                                onClick={(e) => e.stopPropagation()} // prevents double toggle
                                                                className="w-4 h-4"
                                                            />

                                                            <img
                                                                alt=""
                                                                src={assets.pdf_file_format}
                                                                className="h-6 w-6"
                                                            />

                                                            <span className="text-sm text-gray-800">
                        {doc.originalFileName}
                    </span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        <div className={"flex flex-row p-3 justify-end items-end gap-2 scroll-auto"}>
                                            <button className={"p-1 text-gray-800 rounded-md hover:bg-gray-500 transition duration-600"}
                                                    onClick={() => setUsePdfIngestion(false)}
                                            >
                                                Cancel
                                            </button>

                                            <button className={"p-1 bg-black text-white rounded-md hover:bg-gray-600 transition duration-600"}
                                                    onClick={() => handleConfirmSelection()}>
                                                Confirm
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}




                    </div>
                    {selectedPdfs.length > 0 && (
                        <div className="relative flex flex-wrap gap-2 px-2 py-2 mb-2 bottom-20 right-2">
                            {selectedPdfs.map((doc) => (
                                <div
                                    key={doc.originalFileName}
                                    className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-md text-xs text-white"
                                >
                                    <FileTextIcon size={12} />
                                    {doc.originalFileName}

                                    <button
                                        onClick={() => togglePdfSelection(doc)}
                                        className="ml-1"
                                    >
                                        <XIcon size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-end p-2">
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!isLoading && !value.trim()}
                        className="bg-black text-white rounded-[10px] h-8 w-8 flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
                    >
                        {isLoading ? (
                            <Square className="h-4 w-4" fill="currentColor" />
                        ) : (
                            <ArrowRight className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayWrightChatInput;
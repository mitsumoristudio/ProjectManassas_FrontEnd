
import React, { useState } from "react";
import { ArrowRight, Square, LucideFilePlus, XIcon, FileTextIcon, } from "lucide-react";
import {useParams, useNavigate} from "react-router-dom";
import {
    useGetPdfIngestedQuery,
} from "../../../features/chatapiSlice";
import {assets} from "../../../assets/assets";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    value: string;
    onChange : (value: string) => void;
    selectedPdfs: any[];
    setSelectedPdfs: React.Dispatch<React.SetStateAction<any[]>>;

}

const QueryChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false, value, onChange, setSelectedPdfs, selectedPdfs }) => {
    //   const [inputValue, setInputValue] = useState("");
    const [isDocumentMode, setIsDocumentMode] = useState(false);
    const [usePdfIngestion, setUsePdfIngestion] = useState(false);


    const keyword = useParams();

    const {
        data: pdfFile = [],
        refetch,
    } = useGetPdfIngestedQuery({keyword});

    const togglePdfSelection = (doc: any) => {
        const normalizedDoc = {
            id: doc.id,
            azureBlobId: doc.azureBlobId ?? doc.azureDocumentId, // <-- comes from API
            originalFileName: doc.originalFileName,
        };

        setSelectedPdfs((prev) => {
            const exists = prev.some((d) => d.id === normalizedDoc.id);

            return exists
                ? prev.filter((d) => d.id !== normalizedDoc.id)
                : [...prev, normalizedDoc];
        });
    };

    const handleSend = () => {
        if (!value?.trim()) return;
        onSend(value.trim());
        onChange("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleToggle = () => {
        setIsDocumentMode(prev => {
            const newState = !prev;
            return newState;
        });
    };

    const handleConfirmSelection = () => {
        if (selectedPdfs.length === 0) return;

        // close modal
        setUsePdfIngestion(false);

        refetch();

        // (optional) you could trigger something here if needed
        console.log("Selected PDFs:", selectedPdfs);
    };


    return (
        <div className={"flex flex-col gap-2"}>

            {/* Input + send + toggle */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 text-gray-900 rounded-xl px-2 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                />

                <button
                    className={"text-gray-800 hover:text-blue-700 my-4 flex items-center hover:bg-gray-300 rounded-md p-2 transition duration-700"}
                    onClick={() => setUsePdfIngestion(true)}
                >
                    <FileTextIcon size={20} color={"gray"}
                                  className={"mx-auto sm:mx-0"}/>
                    <span className={"hidden sm:inline text-gray-600 text-sm font-mono mx-2"}></span>
                </button>

                {/* Select PDF document Ingestion */}
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
                                    {pdfFile?.map((doc: any, index: number) => {
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
                                    <button className={"px-4 py-2  text-gray-800 rounded-md hover:bg-gray-500 transition duration-600"}
                                            onClick={() => setUsePdfIngestion(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button className={"px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600 transition duration-600"}
                                            onClick={() => handleConfirmSelection()}>
                                        Confirm
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSend}
                    disabled={disabled}
                    className={`px-4 py-2 rounded-full text-white ${
                        disabled
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-blue-400 hover:bg-blue-800"
                    }`}
                >
                    Send
                </button>
                {/* Example 1: Switch with a label */}


            </div>
        </div>
    );
};

export default QueryChatInput;

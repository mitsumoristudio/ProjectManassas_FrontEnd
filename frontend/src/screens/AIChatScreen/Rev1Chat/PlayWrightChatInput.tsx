
import React, { useRef, useState } from "react";
import { ArrowRight, Square, LucideFilePlus, XIcon, FileTextIcon, LucideFolderOpenDot, ArrowDownUpIcon, ToolCaseIcon} from "lucide-react";
import DocumentIngestion, {UploadedDocumentProp} from "../../../screens/AIChatScreen/DocumentIngestion";
import {
    useSendDocumentEmbeddingMutation,
    useGetPdfIngestedQuery,
} from "../../../features/chatapiSlice";
import {useContractAnalysisMutation,
        useAdviseContractMutation,
        useReviewSpecificationMutation} from "../../../features/contractAnalysisSlice";

import {assets} from "../../../assets/assets";
import {useParams, useNavigate} from "react-router-dom";
import {
    useGetPlayWrightProjectListQuery,
    useGetPlayWrightProjectbyIdQuery, useFetchPlayWrightQueryListByIdQuery,
} from "../../../features/playwrightApiSlice";

import {
    useSummaryContractMutation
} from "../../../features/contractAnalysisSlice";

import {toast} from "react-toastify";
import CustomLoaderSmall from "../../../components/Layout/CustomLoaderSmall";

interface ChatInputProps {
    onSend: (value: string, toolType?: string, mode?: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
    value: string;
    onChange: (value: string) => void;
    onQueryTypeChange?: (
        type: "tabular-review" | "single-query-review" | "single-search"
    ) => void;
}

const PlayWrightChatInput: React.FC<ChatInputProps> = ({
                                                          onSend,
                                                          disabled = false,
                                                          value,
                                                          onChange,
                                                          isLoading = false,
                                                           onQueryTypeChange,
                                                      }) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isDocumentMode, setIsDocumentMode] = useState(false);
    const [addPdfIngestion, setAddPdfIngestion] = useState(false);
    const [usePdfIngestion, setUsePdfIngestion] = useState(false);
    const [selectedPdfs, setSelectedPdfs] = useState<any[]>([]);
    const [openReviewQuery, setOpenReviewQuery] = useState<boolean>(false);
    const [queryType, setQueryType] = useState<"tabular-review" | "single-query-review" | "single-search">("tabular-review");
// Review is set for tabular and Ask is set for single query

    const [toolType, setToolType] = useState<"advisor"| "analysis" | "specification" |'summarization'>("advisor");
    const [selectGadget, setSelectGadget] = useState<boolean>(false);

    // State-Driven Model Workflow
    type Mode = "advisor-config"| "analysis-config" | "specification-config" | "document-config"| "regularChat";
    const [mode, setMode] = useState<Mode>("regularChat");
    const [reviewPrompt, setReviewPrompt] = useState<string>("");

    const [documents, setDocuments] = useState<UploadedDocumentProp[]>([]);
    const [createPdfIngestion] = useSendDocumentEmbeddingMutation();

    const {id} = useParams();
    const {keyword} = useParams();
    const projectId = String(id);
    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId);

    /* ---------------- AI Redux Toolkit call ---------------- */
    const [contractAnalysis, {isLoading: iscontractAnalysisLoading}] = useContractAnalysisMutation();
    const [reviewSpecification, {isLoading: isreviewSpecificationLoading}] = useReviewSpecificationMutation();
    const [projectAdvisor, {isLoading: isprojectAdvisorLoading}] = useAdviseContractMutation();
    const [summarizationAI, {isLoading: isSummaryAILoading}] = useSummaryContractMutation();

    const {
        data: playWrightQuery,
        isLoading: isPlayWrightLoading,
        isError: isPlayWrightError,
    } = useFetchPlayWrightQueryListByIdQuery(id);

    const navigate = useNavigate();

    const {
        data: pdfFile = [],
        isLoading: isPdfLoading,
        isError: isPdfError,
        refetch,
    } = useGetPdfIngestedQuery({keyword});


    const toolMutationMap = {
        analysis: contractAnalysis,
        specification: reviewSpecification,
        advisor: projectAdvisor,
        summarization: summarizationAI,
    };

    const handleToolMutation = async () => {
        if (selectedPdfs.length === 0) {
            console.error("No selected pdf found.");
            return;
        }

        try {

            // Summarization workflow
            if (toolType == "summarization") {

                const pdf = selectedPdfs[0];

                console.log("azureBlobId", pdf.id);

                await summaryOnSubmitHandler(
                    reviewPrompt || value,
                    "summarization",
                    "regularChat",
                    reviewPrompt || value,
                    projectId,
                    pdf.id,
                    pdf.id
                );
                return
            }

            // Existing workflow for Advisor / Analysis / Specification
            const selectedMutation = toolMutationMap[toolType];

            const requests = selectedPdfs.map(async  (pdf) => {
                const payload = {
                    projectQueryTitle: reviewPrompt || value,
                    playWrightProjectId: projectId,
                    documentId: pdf.id,
                    azureBlobId: pdf.id,
                    singleTabular: queryType,
                };

                console.log("Summary Payload", payload);

                return await selectedMutation(payload).unwrap();



            });
            const responses = await Promise.all(requests);

            setMode("regularChat");

            onChange("");

            setReviewPrompt("");

            console.log("Mutation response", responses);

            toast.success("Added new query")

        } catch (err) {
            toast.error(err?.data?.message || "Failed to create a project");
        }
    }

    const summaryOnSubmitHandler = async (
        messages: string,
        toolType?: string,
        mode?: string,
        projectQueryTitle?: string,
        playWrightProjectId?: string,
        documentId?: string,
        azureBlobId?: string,
    )=> {
        if (!messages?.trim()) {
            toast.error("Message cannot be empty");
            return;
        }

        if (
            toolType === "summarization" &&
            mode === "regularChat"
        ) {
            try {
                const userMessage = {
                    role: "user",
                    messageContent: messages,
                    createdAt: new Date().toISOString(),
                };

                const session = {
                    sessionId: crypto.randomUUID(),
                    messages: [ {
                        role: "user",
                        messageContent: messages,
                        createdAt: new Date().toISOString(),
                    }]
                };

                const response = await summarizationAI({
                    projectQueryTitle: projectQueryTitle,
                    playWrightProjectId: playWrightProjectId,
                    azureBlobId: azureBlobId,
                    session: session,
                    documentId: documentId,
                    singleTabular: "single-search",
                }).unwrap();

                console.log("messages", messages);
                console.log("ProjectQueryTitle", projectQueryTitle);
                console.log("PlayWrightProjectId", playWrightProjectId);

                console.log("PlayWrightQueryId", response.playWrightQueryId);
                console.log("Response", response);


                navigate(`/playWrightQuery/chatItem/${response.playWrightQueryId}`, {
                    state: {
                        initialMessages: [
                            userMessage,
                            {
                                role: "assistant",
                                messageContent: response.messageContent,
                                createdAt: response.createdAt,
                                sources: response.sources,
                            },
                        ],
                    },
                });

            } catch (err) {
                console.error(err);
            }
            return;
        }
        console.log("Sending message:", messages);
    };


    const modelPromptHandler = () => {
        if (!value.trim()) return;

        if (queryType === "single-query-review" && toolType === "advisor") {
            setReviewPrompt(value);
            setMode("advisor-config")
            return;
        }

        if (queryType === "single-query-review" && toolType === "analysis") {
            setReviewPrompt(value);
            setMode("analysis-config")
            return;
        }

        if (queryType === "single-query-review" && toolType === "specification") {
            setReviewPrompt(value);
            setMode("specification-config")
            return;
        }

        if (queryType === "single-search" && toolType === "summarization") {
            setReviewPrompt(value);
            setMode("document-config");
            return;
        }

        if (queryType === "tabular-review" && toolType === "advisor") {
            setReviewPrompt(value);
            setMode("advisor-config");
            return;
        }

        if (queryType === "tabular-review" && toolType === "analysis") {
            setReviewPrompt(value);
            setMode("analysis-config");
            return;
        }

        if (queryType === "tabular-review" && toolType === "specification") {
            setReviewPrompt(value);
            setMode("specification-config");
            return;
        }

        onSend(value);
        onChange("");
    };

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

    // When user selects or drags pdf ingestion files
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
                progress: 0,
            };

            // Add to document list as "uploading"
            setDocuments((prev) => [...prev, newDoc]);

            // Fake smooth progress animation
            const interval = setInterval(() => {
                setDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === id
                            ? {
                                ...doc,
                                progress: Math.min(
                                    (doc.progress ?? 0) + 5,
                                    90
                                ),
                            }
                            : doc
                    )
                );
            }, 500);

            try {
                const response = await createPdfIngestion({
                    file: file,
                    playWrightProjectId: projectData?.id.toString(),
                }).unwrap();
                console.log("Upload was success:", response);

                clearInterval(interval);

                // Update to analyzed
                setDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === id ? { ...doc, status: "analyzed", progress: 100, } : doc
                    )
                );

                refetch();

            } catch (error) {
                console.log(error);

                // Mark Failed
                setDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === id ? { ...doc, status: "error", progress: 0 } : doc
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

        refetch();

        // (optional) you could trigger something here if needed
        console.log("Selected PDFs:", selectedPdfs);
    };

    return (
        <div className="w-full text-gray-600 font-serif py-3">
            <div className="relative border border-gray-300 rounded-[16px] bg-white py-4 shadow-lg">

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

                {/* DropDown Icons */}
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

                        <button
                            className={"text-gray-800 hover:text-blue-700 my-4 flex items-center hover:bg-gray-300 rounded-md p-2 transition duration-700"}
                            onClick={() => setOpenReviewQuery(true)}
                        >
                            <LucideFolderOpenDot size={18} color={"gray"}
                                          className={"mx-auto sm:mx-0"}/>
                            <span className={"hidden sm:inline text-gray-600 text-sm font-mono mx-2"}>Review Query</span>
                            <ArrowDownUpIcon size={18} color={"gray"} />
                        </button>

                        <button
                            className={"text-gray-800 hover:text-blue-700 my-4 flex items-center hover:bg-gray-300 rounded-md p-2 transition duration-700"}
                            onClick={() => setSelectGadget(true)}
                        >
                            <ToolCaseIcon size={18} color={"gray"}
                                          className={"mx-auto sm:mx-0"}/>
                            <span className={"hidden sm:inline text-gray-600 text-sm font-mono mx-2"}>Gadget</span>
                            <ArrowDownUpIcon size={18} color={"gray"} />
                        </button>

                        {/* Add PDF Document */}
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

                        {/* Review Query - Choose from Tabular vs. Singular */}
                        {openReviewQuery && (
                            <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
                                <div className="bg-white rounded-2xl shadow-xl w-[500px] p-4">

                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm font-medium">Choose query type</div>
                                        <button onClick={() => setOpenReviewQuery(false)}>✕</button>
                                    </div>

                                    {/* Options For Tabular,Single-Query and Single Search */}
                                    <div className="flex flex-col gap-3">

                                        {/* Review Query */}
                                        <div
                                            onClick={() => {
                                                setQueryType("tabular-review");
                                                onQueryTypeChange?.("tabular-review");
                                            }}

                                            className={`p-4 rounded-xl border cursor-pointer transition
                    ${queryType === "tabular-review"
                                                ? "border-black bg-gray-100"
                                                : "hover:bg-gray-50"}
                    `}
                                        >
                                            <div className="font-medium">Review query (Tabular)</div>
                                            <div className="text-sm text-gray-500">
                                                Get individual answers for each file in a table view.
                                            </div>
                                        </div>

                                        {/* Review Single Query */}
                                        <div
                                            onClick={() => {
                                                setQueryType("single-query-review");
                                                onQueryTypeChange?.("single-query-review");
                                            }}

                                            className={`p-4 rounded-xl border cursor-pointer transition
                    ${queryType === "single-query-review"
                                                ? "border-black bg-gray-100"
                                                : "hover:bg-gray-50"}
                    `}
                                        >
                                            <div className="font-medium">Review query (Single)</div>
                                            <div className="text-sm text-gray-500">
                                                Get a single query answer across all files.
                                            </div>
                                        </div>

                                        {/* Single Search */}
                                        <div
                                            onClick={() => {
                                                setQueryType("single-search");
                                                onQueryTypeChange?.("single-search");
                                            }}

                                            className={`p-4 rounded-xl border cursor-pointer transition
                    ${queryType === "single-search"
                                                ? "border-black bg-gray-100"
                                                : "hover:bg-gray-50"}
                    `}
                                        >
                                            <div className="font-medium">Single Search Query</div>
                                            <div className="text-sm text-gray-500">
                                                Search engine for documents
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={() => setOpenReviewQuery(false)}
                                            className="px-4 py-2 bg-black text-white rounded-lg"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isPdfLoading && (
                            <>
                                <div className="flex space-x-2 gap-x-1 justify-center items-center bg-white">
                                    <span className="sr-only text-black">Loading...</span>
                                    <div
                                        className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div
                                        className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="h-1 w-1 bg-blue-600 rounded-full animate-bounce"></div>
                                </div>
                            </>
                        )}


                        {isPdfError && (
                            <>
                                <span className="text-red-500 text-xs">Error Loading PDF</span>
                            </>
                        )}

                        {isProjectError && (
                            <>
                                <span className="text-red-500 text-xs">Error Loading Project From Database</span>
                            </>
                        )}

                        {/* Select Tool Type */}
                        {selectGadget && (
                            <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
                                <div className="bg-white rounded-2xl shadow-xl w-[500px] p-4">

                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm font-medium">Choose Gadet Type</div>
                                        <button onClick={() => setSelectGadget(false)}>✕</button>
                                    </div>

                                    {/* Options */}
                                    <div className="flex flex-col gap-3">

                                        {/* Specification */}
                                        <div
                                            onClick={() => setToolType("specification")}
                                            className={`p-4 rounded-xl border cursor-pointer transition
                    ${toolType === "specification"
                                                ? "border-black bg-gray-100"
                                                : "hover:bg-gray-50"}
                    `}
                                        >
                                            <div className="font-medium">Review Contract Specification</div>
                                            <div className="text-sm text-gray-500">
                                                Review assistant for construction specification
                                            </div>
                                        </div>

                                        {/* Review Project Advisor */}
                                        <div
                                            onClick={() => setToolType("advisor")}
                                            className={`p-4 rounded-xl border cursor-pointer transition
                    ${toolType === "advisor"
                                                ? "border-black bg-gray-100"
                                                : "hover:bg-gray-50"}
                    `}
                                        >
                                            <div className="font-medium">Project Advisor</div>
                                            <div className="text-sm text-gray-500">
                                                Get project tailored answers from knowledge source
                                            </div>
                                        </div>

                                        {/* Project Analysis */}
                                        <div
                                            onClick={() => setToolType("analysis")}
                                            className={`p-4 rounded-xl border cursor-pointer transition
                    ${toolType === "analysis"
                                                ? "border-black bg-gray-100"
                                                : "hover:bg-gray-50"}
                    `}
                                        >
                                            <div className="font-medium">Analyze Contract</div>
                                            <div className="text-sm text-gray-500">
                                                Analyze Contractual Agreement
                                            </div>
                                        </div>

                                        {/* Summarization */}
                                        <div
                                            onClick={() => setToolType("summarization")}

                                            className={`p-4 rounded-xl border cursor-pointer transition
                    ${toolType === "summarization"
                                                ? "border-black bg-gray-100"
                                                : "hover:bg-gray-50"}
                    `}
                                        >
                                            <div className="font-medium">Document Intelligence</div>
                                            <div className="text-sm text-gray-500">
                                                Find resources within documentation
                                            </div>
                                        </div>

                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={() => setSelectGadget(false)}
                                            className="px-4 py-2 bg-black text-white rounded-lg"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

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

                    </div>

                    {/* Project Analysis Card */}
                    {mode === "analysis-config" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                            <div className="bg-white w-[700px] max-h-[80vh] rounded-2xl shadow-xl flex flex-col">

                                {/* Header */}
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h2 className="font-semibold text-lg">
                                        Create a {toolType} {queryType}
                                    </h2>
                                    <button  onClick={() => {
                                        setMode("regularChat")
                                    }}>x</button>
                                </div>

                                {/* Table Config */}
                                <div className="overflow-y-auto p-4 flex-1">

                                    <div className="text-sm text-gray-500 mb-3">
                                        Review terms across documents.
                                    </div>

                                    {[// ClauseSummary
                                        { label: "Parties", question: "Who are the parties involved in this contract? Identify owner, contractor, and roles." },
                                        { label: "Scope Of Work", question: "What is the scope of work? Describe the work, deliverables, and responsibilities." },
                                        { label: "Change Of Control Provision", question: "Are there any assignment or change of control provisions? Can the contract be transferred?" },
                                        { label: "Termination Condition", question: "What are the termination conditions mentioned in this document" },
                                        { label: "Red Flag", question: "Are there any red flags or potential issues identified in this document" },
                                        { label: "Payment Term", question: "What are the payments terms for this contract?"},
                                        { label: "Liability", question: "What is the limitation of liability clause? Identify liability cap and exclusions"},
                                        { label: "Indemnification", question: "Who is solely liable for payment if something goes wrong legally? Specify indemnifies whom and scope"},
                                        { label: "Time Line", question: "Extract deadlines, dependencies and delays handling for General Contractor"},
                                        { label: "Change Order", question: "How are change orders handled in this contract, Process for adding work, pricing adjustments and approval requirements"},
                                        { label: "Warranties", question: "How long does the construction warranties last? Performance guarantees and compliance requirement"},
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-2 gap-4 border-b py-3"
                                        >
                                            <div className="font-medium text-sm">
                                                {item.label}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {item.question}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end gap-2 p-4 border-t">
                                    <button
                                        onClick={() => {
                                            setMode("regularChat")
                                        }}

                                        className="px-4 py-2 rounded-lg bg-gray-200"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={async () => {
                                            setMode("advisor-config"); // next step
                                            // onSend({
                                            //     type: "tabular-review",
                                            //     prompt: reviewPrompt,
                                            // });
                                            await handleToolMutation();

                                        }}
                                        className="px-4 py-2 rounded-lg bg-black text-white"
                                    >
                                        Continue
                                    </button>

                                    {iscontractAnalysisLoading && (
                                        <button type="button" className="px-4 py-2 bg-indigo-700 text-white rounded-md"disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {isSummaryAILoading && (
                                        <button type="button" className="px-4 py-2 bg-indigo-700 text-white rounded-md" disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {isreviewSpecificationLoading && (
                                        <button type="button" className="px-4 py-2 bg-indigo-700 text-white rounded-md" disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {isprojectAdvisorLoading && (
                                        <button type="button" className="px-4 py-2 bg-indigo-700 text-white rounded-md" disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Specification Card */}
                    {mode === "specification-config" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                            <div className="bg-white w-[700px] max-h-[80vh] rounded-2xl shadow-xl flex flex-col">

                                {/* Header */}
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h2 className="font-semibold text-lg">
                                        Create a {toolType} {queryType}
                                    </h2>
                                    <button  onClick={() => {
                                        setMode("regularChat")
                                    }}>x</button>
                                </div>

                                {/* Table Config */}
                                <div className="overflow-y-auto p-4 flex-1">

                                    <div className="text-sm text-gray-500 mb-3">
                                        Review terms across documents.
                                    </div>

                                    {[// SpecificationSummaryClause
                                        { label: "Contractor Obligations", question: "List all contractor obligations including labor, materials, permits, utilities, supervision, and compliance responsibilities." },
                                        { label: "Submittal Requirements", question: "What submittals are required (shop drawings, product data, samples)? Identify approval process and timing constraints." },
                                        { label: "Testing And Comissioning", question: "What testing and commissioning requirements are specified? Include pre-testing, functional testing, and final acceptance criteria." },
                                        { label: "Quality Requirements", question: "What quality standards must materials and equipment meet? Include UL, NEMA, or other regulatory requirements." },
                                        { label: "Approved Materials And Substitutions", question: "What are the requirements for approved manufacturers and 'or equal' substitutions? Identify approval risks." },
                                        { label: "Installation Requirements", question: "What are the installation requirements including manufacturer instructions, storage, and handling obligations?" },
                                        { label: "Integration Responsibilities", question: "What responsibilities does the contractor have for integrating with existing systems or other contractors' work?" },
                                        { label: "Repair And Correction Obligations", question: "What are the contractor’s obligations to repair or replace defective work? Who bears the cost?" },
                                        { label: "Site Conditions Risk", question: "Who bears the risk of unknown or differing site conditions? Can the contractor claim additional compensation?" },
                                        { label: "Quality And Payment Risk", question: "Is payment based on estimated or actual quantities? Identify risk of quantity variation affecting revenue." },
                                        { label: "Delay Notice Requirements", question: "What are the requirements for notifying delays? Include deadlines and consequences for missing notice." },
                                        { label: "Safety Requirements", question: "What safety obligations are imposed on the contractor? Include OSHA compliance and accident prevention responsibilities." },
                                        { label: "Traffic And Access Requirements", question: "What are the contractor’s obligations for maintaining traffic, access, and public safety during construction?" },
                                        { label: "Claims And Damage Handling", question: "How must the contractor handle property damage claims, insurance coordination, and reporting requirements?" },
                                        { label: "Temporary Works And Facilities", question: "What temporary utilities, facilities, and site logistics must the contractor provide and maintain?" },
                                        { label: "Closeout Requirements", question: "What are the requirements for project closeout including testing, documentation, punch list, and final acceptance?" },


                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-2 gap-4 border-b py-3"
                                        >
                                            <div className="font-medium text-sm">
                                                {item.label}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {item.question}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end gap-2 p-4 border-t">
                                    <button
                                        onClick={() => {
                                            setMode("regularChat")
                                        }}

                                        className="px-4 py-2 rounded-lg bg-gray-200"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={ async () => {
                                            setMode("advisor-config"); // next step
                                           await handleToolMutation();
                                            // onSend({
                                            //     type: "tabular-review",
                                            //     prompt: reviewPrompt,
                                            // });

                                        }}
                                        className="px-4 py-2 rounded-lg bg-black text-white"
                                    >
                                        Continue
                                    </button>

                                    {isreviewSpecificationLoading && (
                                        <button type="button" className="px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {iscontractAnalysisLoading && (
                                        <button type="button" className=" px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {isSummaryAILoading && (
                                        <button type="button" className="px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Project Advisor Card */}
                    {mode === "advisor-config" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                            <div className="bg-white w-[700px] max-h-[80vh] rounded-2xl shadow-xl flex flex-col">

                                {/* Header */}
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h2 className="font-semibold text-lg">
                                        Create a {toolType} {queryType}
                                    </h2>
                                    <button  onClick={() => {
                                        setMode("regularChat")
                                    }}>x</button>
                                </div>

                                {/* Table Config */}
                                <div className="overflow-y-auto p-4 flex-1">

                                    <div className="text-sm text-gray-500 mb-3">
                                        Review terms across documents.
                                    </div>

                                    {[// ProjectAdvisorClause
                                        { label: "Cost Structure Transparency", question: "Breakdown of Labor, Material, Equipment, Subcontractors, overhead & profit. Are allowances or provisional sums included." },
                                        { label: "Scope Completeness", question: "What work is explicitly included in the contract, Are there exclusions or by others statement." },
                                        { label: "Unit Price Reasonableness", question: "What are the key unit prices ($/sq ft, $/yard, etc.)?" },
                                        { label: "Schedule Feasibility", question: "What is the total project duration?. Is a critical path defined? Are the dependencies and sequencing clear." },
                                        { label: "Labor Assumptions", question: "What productivity rates are used? Is overtime included." },
                                        { label: "Material Pricing", question: "Are escalation clauses included? Which materials are most cost sensitive." },
                                        { label: "Subcontractor Coverage", question: "Which trades are subcontracted? Are any scopes undefined or missing." },
                                        { label: "Contingency", question: "Who is responsible for *Site conditions, *Weather delays, *Permits." },
                                        { label: "Contract Terms", question: "What are payment terms(milestones, retainage)? Are there liquidated damages." },
                                        { label: "Bid Strategy", question: "Are certain areas aggressively priced? How does this bid compare to competitors." },


                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-2 gap-4 border-b py-3"
                                        >
                                            <div className="font-medium text-sm">
                                                {item.label}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {item.question}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end gap-2 p-4 border-t">
                                    <button
                                        onClick={() => {
                                            setMode("regularChat")
                                        }}

                                        className="px-4 py-2 rounded-lg bg-gray-200"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={ async () => {
                                            setMode("advisor-config"); // next step
                                            await handleToolMutation();
                                            // onSend({
                                            //     type: "tabular-review",
                                            //     prompt: reviewPrompt,
                                            // });

                                        }}
                                        className="px-4 py-2 rounded-lg bg-black text-white"
                                    >
                                        Continue
                                    </button>

                                    {isprojectAdvisorLoading && (
                                        <button type="button" className="px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {iscontractAnalysisLoading && (
                                        <button type="button" className=" px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {isreviewSpecificationLoading && (
                                        <button type="button" className="px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summarization */}
                    {mode === "document-config" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                            <div className="bg-white w-[700px] max-h-[80vh] rounded-2xl shadow-xl flex flex-col">

                                {/* Header */}
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h2 className="font-semibold text-lg">
                                        Create a {toolType} {queryType}
                                    </h2>
                                    <button  onClick={() => {
                                        setMode("regularChat")
                                    }}>x</button>
                                </div>

                                {/* Table Config */}
                                <div className="overflow-y-auto p-4 flex-1">

                                    {/*<div className="text-sm text-gray-500 mb-3">*/}
                                    {/*    Review single term across documents.*/}
                                    {/*</div>*/}

                                    {[// ProjectAdvisorClause
                                        { label: "Review Single Term", question: "Review, analyze and understand terms in the contract" },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-2 gap-4 border-b py-3"
                                        >
                                            <div className="font-medium text-sm">
                                                {item.label}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {item.question}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end gap-2 p-4 border-t">
                                    <button
                                        onClick={() => {
                                            setMode("regularChat")
                                        }}

                                        className="px-4 py-2 rounded-lg bg-gray-200"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={ async () => {
                                            setMode("document-config"); // next step
                                            await handleToolMutation();
                                            // onSend({
                                            //     type: "tabular-review",
                                            //     prompt: reviewPrompt,
                                            // });

                                        }}
                                        className="px-4 py-2 rounded-lg bg-black text-white"
                                    >
                                        Continue
                                    </button>

                                    {isSummaryAILoading && (
                                        <button type="button" className="px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {isreviewSpecificationLoading && (
                                        <button type="button" className="px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                    {isprojectAdvisorLoading && (
                                        <button type="button" className="px-4 py-2 rounded-lg shadow-md text-white bg-indigo-700 ..." disabled>
                                            <svg className="mr-3 size-4  animate-spin ..." viewBox="0 0 24 24">
                                            </svg>
                                            Processing…
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show selected PDF on top right of text field */}
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
                        onClick={() => modelPromptHandler()}
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
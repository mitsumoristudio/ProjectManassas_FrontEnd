import CustomLoader from "../../components/Layout/CustomLoader";
import {Helmet} from "react-helmet";
import SideBar from "../../components/Layout/Graph & Tables/SideBar";
import {AIModel} from "../../components/Layout/DropdownMenu/ChatMenuSelector";
import ChatMenuSelector from "../../components/Layout/DropdownMenu/ChatMenuSelector";
import {useSelector} from "react-redux";
import {NavLink, useParams} from "react-router-dom";
import {PaperclipIcon, NotebookTabs, MicIcon, MicOffIcon} from "lucide-react"
import {useAzureSpeech} from "../../components/useAzureSpeech"
import {PDF_URL, PRODUCTION_PDF_URL} from "../../util/urlconstants"

import {useSendSemanticAIMessageMutation, useSendSafetyAIMessageMutation, useSendSummaryAIMessageMutation,
    useGetPdfIngestedQuery, useDeletePdfIngestedMutation, useDeleteEntirePdfMutation} from "../../features/chatapiSlice";
import {useSendAIProjectMessageMutation} from "../../features/projectApiSlice";
import {useSendAIEquipmentMessageMutation} from "../../features/equipmentApiSlice";
import React, { useState, useEffect} from "react";
import {motion} from "framer-motion";
import ChatInput from "./ChatInput";
import {ChatMessageList} from "./ChatMessageList";
import PromptSelector from "../../components/Layout/PromptSelector";
// import {chatConnection, startChatConnection} from "../../util/chatHub";
import PdfOutlinePanel from "../AIChatScreen/PdfOutlinePanel";
import {toast} from "react-toastify";
import {useAzureTextToSpeech} from "../../screens/AIChatScreen/useAzureTextToSpeech";

const promptList = [
    { id: "1", title: "Understand scope of work", description: "Please summarize contract for this project" },
    { id: "2", title: "List key obligations", description: "Extract main responsibilities and obligations" },
    { id: "3", title: "Identify risks and mitigation", description: "Tell me about OSHA Fall protection requirements" },
    { id: "4", title: "Payment and Terms", description: "How are payments handled for this project?" },
    { id: "5", title: "Safety in project workspace", description: "Please explain OSHA trench requirements ?" },
];

const models: AIModel[] = [
    {
        id: "summary-gpt",
        name: "Summary AI",
        description: "Specialized for providing contract summary",
        icon: "tree",
    },
    {
        id: "contract-ai",
        name: "Contract AI",
        description: "Optimized for contract review and understanding construction technical terms",
        icon: "zap",
    },
    {
        id: "safety-ai",
        name: "Safety AI",
        description: "Expert in OSHA law and safety regulations",
        icon: "sparkles",
    },
    {
        id: "project-ai",
        name: "Project AI",
        description: "Ask about ongoing project",
        icon: "folder",
    },
    {
        id: "equipment-ai",
        name: "Equipment AI",
        description: "Ask about equipment",
        icon: "tractor",
    },

];

export function ChatMainScreen() {
    const [messages, setMessages] = useState<any[]>([]);
    const [sessionId] = useState("session-1234");
    const [inProgressMessage, setInProgressMessage] = useState<any>(null);
    const [isDocumentMode, setIsDocumentMode] = useState(false);
    const [openPdfList, setOpenPdfList] = useState(false);
    const [previewPdfId, setPreviewPdfId] = useState<string | null>(null);

    const [sendSemanticAIMessage, {isLoading}] = useSendSemanticAIMessageMutation();
    const [sendSafetyAIMessage] = useSendSafetyAIMessageMutation();
    const [sendSummaryAIMessage] = useSendSummaryAIMessageMutation();
    const [sendProjectAIMessage] = useSendAIProjectMessageMutation();
    const [sendEquipmentAIMessage] = useSendAIEquipmentMessageMutation();

    const keyword = useParams();
    //@ts-ignore
    const {
        data: pdfs = [],
        isLoading: isPdfLoading,
        isError: isPdfError,
        refetch,
    } = useGetPdfIngestedQuery({keyword});

    const [deleteEmbedPdf] = useDeletePdfIngestedMutation();
    const [deleteEntirePdf] = useDeleteEntirePdfMutation();

    const [selectedModelId, setSelectedModelId] = useState("contract-ai");
    const [selectedPromptId, setSelectedPromptId] = useState<string>();
    const [inputValue, setInputValue] = useState("");

    // Authentication
    const {userInfo} = useSelector((state: any) => state.auth);

    // Use Azure Speech Service
    const {speak: speakSpeech, stopSpeech: stopTheSpeech, resumeSpeech, pauseSpeech, isPaused, isPlaying } = useAzureTextToSpeech();

    const handleAssistantAzureMessageHandler = (text: string) => {
        if (!text?.trim()) return;
        speakSpeech(text);
    }

    // When a prompt is selected from the dropdown
    const handleSelectedPrompt = (promptId: string) => {
        setSelectedPromptId(promptId);
        const prompt = promptList.find((prompt) => prompt.id === promptId);
        if (prompt) {
            setInputValue(prompt.description);
        }
    }

    useEffect(() => {
        console.log("📝 inputValue:", inputValue)
    }, [inputValue])

    // ✅ Handles toggle change
    const handleSwitch = (enabled: boolean) => {
        setIsDocumentMode(enabled);
    };

    const handleProjectAIMessage = async (message: string) => {
        if (!message.trim()) return;

        const userMessage = {
            role: "user",
            messageContent: message,
            createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, userMessage]);
        setInProgressMessage({role:"assistant", messageContent: "..."});

        try {
            const session = {sessionId, messages : [userMessage]};
            const response = await sendProjectAIMessage(session).unwrap();

            console.log("📄 Full Semantic AI Response:", response);

            // @ts-ignore
            if (response?.messageContent) {
                const assistantMessage = {
                    role: "assistant",
                    // @ts-ignore
                    messageContent: response.messageContent,
                    // @ts-ignore
                    createdAt: response.createdAt,
                    // @ts-ignore
                    sources: response.sources,
                };
                setMessages((prev) => [...prev, assistantMessage]);
            }

        } catch (err) {
            console.error("❌ Error sending semantic AI message:", err);
        } finally {
            setInProgressMessage(null);
        }
    }

    const handleEquipmentAIMessage = async (snippet: string) => {
        if (!snippet.trim()) return;

        const userMessage = {
            role: "user",
            messageContent: snippet,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInProgressMessage({role: "assistant", messageContent: "..."});

        try {
            const session = {sessionId, messages: [userMessage]};
            const response: any = await sendEquipmentAIMessage(session).unwrap();

            console.log("📄 Full Semantic AI Response:", response);
            console.log("🔗 Sources:", response.sources);

            if (response?.messageContent) {
                const assistantMessage = {
                    role: "assistant",
                    messageContent: response.messageContent,
                    createdAt: response.createdAt,
                    sources: response.sources,
                };
                setMessages((prev) => [...prev, assistantMessage]);
                //   setSources(response.sources);
            }
        } catch (err) {
            console.error("❌ Error sending semantic AI message:", err);
        } finally {
            setInProgressMessage(null);
        }
    }

    const handleSemanticAIMessage = async (snippet: string) => {
        if (!snippet.trim()) return;

        const userMessage = {
            role: "user",
            messageContent: snippet,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInProgressMessage({role: "assistant", messageContent: "..."});

        try {
            const session = {sessionId, messages: [userMessage]};
            const response: any = await sendSemanticAIMessage(session).unwrap();

            console.log("📄 Full Semantic AI Response:", response);
            console.log("🔗 Sources:", response.sources);

            if (response?.messageContent) {
                const assistantMessage = {
                    role: "assistant",
                    messageContent: response.messageContent,
                    createdAt: response.createdAt,
                    sources: response.sources,
                };
                setMessages((prev) => [...prev, assistantMessage]);
                //   setSources(response.sources);
            }
        } catch (err) {
            console.error("❌ Error sending semantic AI message:", err);
        } finally {
            setInProgressMessage(null);
        }
    };

    const handleSummaryAIMessage = async (snippet: string) => {
        if (!snippet.trim()) return;

        const userMessage = {
            role: "user",
            messageContent: snippet,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInProgressMessage({role: "assistant", messageContent: "..."});

        try {
            const session = {sessionId, messages: [userMessage]};

            const response: any = await sendSummaryAIMessage(session).unwrap();

            console.log("📄 Full Semantic AI Response:", response);
            console.log("🔗 Sources:", response.sources);

            if (response?.messageContent) {
                const assistantMessage = {
                    role: "assistant",
                    messageContent: response.messageContent,
                    createdAt: response.createdAt,
                    sources: response.sources,
                };
                setMessages((prev) => [...prev, assistantMessage]);
                //   setSources(response.sources);
            }
        } catch (err) {
            console.error("❌ Error sending semantic AI message:", err);
        } finally {
            setInProgressMessage(null);
        }
    };

    const handleSafetyAIMessage = async (snippet: string) => {
        if (!snippet.trim()) return;

        const userMessage = {
            role: "user",
            messageContent: snippet,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInProgressMessage({role: "assistant", messageContent: "..."});

        try {
            const session = {sessionId, messages: [userMessage]};
            const response: any = await sendSafetyAIMessage(session).unwrap();

            console.log("📄 Full Semantic AI Response:", response);
            console.log("🔗 Sources:", response.sources);

            if (response?.messageContent) {
                const assistantMessage = {
                    role: "assistant",
                    messageContent: response.messageContent,
                    createdAt: response.createdAt,
                    sources: response.sources,
                };
                setMessages((prev) => [...prev, assistantMessage]);
                //   setSources(response.sources);
            }
        } catch (err) {
            console.error("❌ Error sending semantic AI message:", err);
        } finally {
            setInProgressMessage(null);
        }
    };

    const handleAISendBasedOnModel = async (text: string) => {
        console.log("Selected Model:", selectedModelId);

        switch (selectedModelId) {

            case "equipment-ai":
                await handleEquipmentAIMessage(`${text}`);
                break;

            case "summary-gpt":
                await handleSummaryAIMessage(`${text}`);
                break;

            case "contract-ai":
                await handleSemanticAIMessage(`${text}`);
                break;

            case "safety-ai":
                await handleSafetyAIMessage(`${text}`);
                break;

            case "project-ai":
                await handleProjectAIMessage(`${text}`);
                break;

            default:
                await handleSemanticAIMessage(text);
                break;
        }
    }

    // Handle Speech Synthesis
    const {startSpeech, stopSpeech, isListening} = useAzureSpeech({
       onResult: (text: string) => {
           setInputValue(text);
       },
        onError: () => {
           toast.error("Speech support failed")
        }
    });

    // Delete PDF
    const deletePdfHandler = async (id: any) => {
        if (window.confirm("Are you sure you want to delete this PDF now?")) {
            try {
                await deleteEntirePdf(id)
                refetch();

                toast.success("PDF deleted successfully.");

            } catch (error) {
                toast.error("Problem with deleting this PDF.");
            }
        }
    }

    // Delete Embedded PDF
    const deleteEmbedPDF = async (documentid: any) => {
        if (window.confirm("Are you sure you want to delete embedded PDF now?")) {
            try {
                await deleteEmbedPdf(documentid);
                refetch();

                toast.success("Embedded PDF deleted successfully.");

            } catch (error) {
                toast.error("Problem with deleting embedded PDF.");
            }
        }
    }
    //
    // const streamChat = async (text: string, mode: string) => {
    //     if (!text.trim()) return;
    //
    //     await startChatConnection();
    //
    //     const userMessage = {
    //         role: "user",
    //         messageContent: text,
    //         createdAt: new Date().toISOString(),
    //     };
    //
    //     setMessages(prev => [...prev, userMessage]);
    //
    //     // Create placeholder assistant message
    //     const assistantMessage = {
    //         role: "assistant",
    //         messageContent: "",
    //         createdAt: new Date().toISOString(),
    //     };
    //
    //     setMessages(prev => [...prev, assistantMessage]);
    //
    //     const session = {
    //         sessionId,
    //         messages: [userMessage],
    //     };
    //
    //     const stream = chatConnection.stream<string>(
    //         "StreamSemanticChatAsync", // or StreamChatAsync
    //         session,
    //         mode
    //     );
    //
    //     stream.subscribe({
    //         next: (token) => {
    //             setMessages(prev => {
    //                 const updated = [...prev];
    //                 updated[updated.length - 1] = {
    //                     ...updated[updated.length - 1],
    //                     messageContent:
    //                         updated[updated.length - 1].messageContent + token,
    //                 };
    //                 return updated;
    //             });
    //         },
    //         complete: () => {
    //             console.log("✅ Stream complete");
    //         },
    //         error: (err) => {
    //             console.error("❌ Stream error:", err);
    //         },
    //     });
    // };

    // const handleStreamAIModel = async (text: string) => {
    //     switch (selectedModelId) {
    //         case "summary-gpt":
    //             await streamChat(text, "summary");
    //             break;
    //
    //         case "contract-ai":
    //             await streamChat(text, "contract");
    //             break;
    //
    //         case "safety-ai":
    //             await streamChat(text, "safety");
    //             break;
    //
    //         case "project-ai":
    //             await streamChat(text, "project");
    //             break;
    //
    //
    //         case "equipment-ai":
    //             await streamChat(text, "equipment");
    //             break;
    //
    //
    //         default:
    //             await streamChat(text, "contract");
    //             break;
    //     }
    // }


    // Standard AI Assistant
    //     const handleStandardAIMessage = async (text: string) => {
    //         if (!text.trim()) return;
    //
    //         const userMessage = {
    //             role: "user",
    //             messageContent: text,
    //             createdAt: new Date().toISOString()
    //         };
    //         setMessages((prev) => [...prev, userMessage]);
    //         setInProgressMessage({role: "assistant", messageContent: "..."});
    //
    //         try {
    //             const session = {
    //                 sessionId,
    //                 messages: [userMessage],
    //             };
    //
    //             const response: any = await sendMessage(session).unwrap();
    //
    //             if (response?.messageContent) {
    //                 setMessages((prev) => [
    //                     ...prev,
    //                     {
    //                         role: response.role,
    //                         messageContent: response.messageContent,
    //                         sources: response.sources,
    //                         createdAt: response.createdAt,
    //                     },
    //                 ]);
    //             }
    //
    //         } catch (err) {
    //             console.error("Error sending message:", err);
    //         } finally {
    //             setInProgressMessage(null);
    //         }
    //     };

        // @ts-ignore
    // @ts-ignore
    return (
            <>
                <Helmet>
                    <title>Chat App</title>
                    <meta name="description" content="Chat App"/>
                </Helmet>
                {isLoading ? (
                    <CustomLoader/>
                ) : (
                    <motion.div
                        initial={{opacity: 0, y: 60}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                    >
                        <div className={"bg-[#0A0A0A] h-full text-white font-sans flex"}>
                            <SideBar/>


                            <div className={"flex-1 flex flex-col min-w-1 bg-[#f7f7f7]"}>
                                {/*<ChatMessageExample/>*/}
                                <div
                                    className="h-14 border-b border-border px-4 my-2 flex items-center justify-between flex-shrink-0">
                                    <div className={" flex flex-1 justify-items-start mx-1 px-2 gap-x-4"}>
                                        <ChatMenuSelector
                                            models={models}
                                            selectedModelId={selectedModelId}
                                            onSelectModel={(id) => {
                                                console.log("Selected model:", id);
                                                setSelectedModelId(id);
                                            }}
                                        />

                                        {/* Open PDF Ingestion if the user is admin */}
                                        {userInfo && userInfo.isAdmin && (
                                            <NavLink to={"/documentingestion"}>
                                                <PaperclipIcon size={24} color={"black"} className={"my-4 mx-2"}/>
                                            </NavLink>
                                        )}

                                        <div className={"flex flex-1"}>
                                            <button onClick={() => setOpenPdfList(true)}
                                            className={"text-gray-800 hover:text-blue-700 my-4 flex items-center"}>
                                                <NotebookTabs size={22}   />
                                            </button>

                                            {openPdfList && userInfo?.isAdmin && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h2 className="text-lg font-semibold text-gray-800">
                                                                Ingested PDFs
                                                            </h2>
                                                            <button
                                                                onClick={() => setOpenPdfList(false)}
                                                                className="text-gray-500 hover:text-gray-800"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>

                                                        {isPdfLoading && <p className="text-gray-500">Loading PDFs...</p>}
                                                        {isPdfError && <p className="text-red-500">Failed to load PDFs</p>}

                                                        {!isPdfLoading && pdfs.length === 0 && (
                                                            <p className="text-gray-500">No PDFs ingested</p>
                                                        )}

                                                        <ul className="space-y-3">
                                                            {pdfs?.map((doc: any) => (
                                                                <li
                                                                    key={doc.documentId}
                                                                    className="border rounded-lg p-4 flex justify-between items-start"
                                                                >
                                                                    <div className="text-gray-800 text-sm space-y-1">
                                                                        <p><strong>ID:</strong> {doc.documentId}</p>
                                                                        <p>📄 Pages: {doc.pageCount}</p>
                                                                        <p>🧩 Chunks: {doc.chunkCount}</p>
                                                                    </div>


                                                                    <div className={"flex flex-col gap-2"}>
                                                                        {/* 🔍 PREVIEW */}
                                                                        <button
                                                                            onClick={() => setPreviewPdfId(doc.documentId)}
                                                                            className={"text-blue-600 hover:text-blue-900 text-sm"}>
                                                                            Preview
                                                                        </button>

                                                                        {/* 🗑 DELETE */}
                                                                        <button
                                                                            // onClick={async () => {
                                                                            //     await deleteEmbedPdf(doc.documentId).unwrap();
                                                                            //
                                                                            // }}
                                                                            onClick={() => deleteEmbedPDF(doc.documentId)}
                                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                                        >
                                                                            Delete Embedding
                                                                        </button>

                                                                        {/* Delete PDF */}
                                                                        <button
                                                                            onClick={ () => deletePdfHandler(doc.documentId)
                                                                            }
                                                                            className="text-red-400 hover:text-red-800 text-sm"
                                                                        >
                                                                            Delete PDF
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {previewPdfId && (
                                                            <div className={"fixed inset-0 py-20 px-20 z-50 items-center bg-black/60"}>
                                                                <div className="bg-white rounded-xl shadow-xl w-1/4 h-fit flex flex-col">

                                                                    {/* Header */}
                                                                    <div className="flex justify-between items-center p-4 border-b">
                                                                        <h2 className="font-semibold text-gray-800 truncate">
                                                                            {previewPdfId}
                                                                        </h2>
                                                                        <button
                                                                            onClick={() => setPreviewPdfId(null)}
                                                                            className="text-gray-500 hover:text-gray-800"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>

                                                                    {/* PDF iframe change to PDF_URL for development, */}
                                                                    <iframe
                                                                        src={`${PDF_URL}/${encodeURIComponent(previewPdfId)}`}
                                                                        className="flex-1 w-full"
                                                                        title="PDF Preview"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}


                                        </div>


                                    </div>


                                    <PromptSelector prompts={promptList} onSelectPrompt={handleSelectedPrompt}
                                                    selectedPromptId={selectedPromptId}/>
                                </div>


                                <div className="flex flex-auto overflow-hidden h-screen bg-gray-50">
                                    <div className="flex-1 overflow-y-auto p-4 text-gray-800 text-2xl">
                                        <ChatMessageList
                                            messages={messages}
                                            inProgressMessage={inProgressMessage}
                                            showSources={isDocumentMode}
                                            noMessagesContent="Start a conversation with AI agents ...."
                                            onSpeakHandler={handleAssistantAzureMessageHandler}
                                            onPause={pauseSpeech}
                                            onStop={stopTheSpeech}
                                            onResume={resumeSpeech}
                                            isPlaying={isPlaying}
                                            isPaused={isPaused}
                                        />
                                        <h2 className={"p-2 text-blue-700 font-medium text-sm text-center"}>Please note
                                            that AI agent may give inaccurate information</h2>
                                    </div>
                                    {/* PDF outline */}
                                    {!isDocumentMode && (
                                        <div className={"w-80 border-1 bg-white overflow-y-auto"}>
                                            <PdfOutlinePanel messages={messages} />
                                        </div>
                                    )}

                                </div>

                                <div className={"p-4 border-t bg-white flex items-center gap-3"}>
                                    { /*Speech Synthesis*/}
                                    <button
                                        onPointerDown={startSpeech}
                                        onPointerUp={stopSpeech}
                                        onTouchStart={startSpeech}
                                        onTouchEnd={stopSpeech}
                                        className={`rounded-full p-3 transition ${
                                            isListening
                                                ? "bg-red-600 text-white animate-pulse"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                        title="Hold to talk">
                                        {isListening ? <MicOffIcon size={22} /> : <MicIcon size={22} />}
                                    </button>

                                    {/*<ChatWindow/>*/}
                                    { /*Speech Recognition*/}
                                    <div className="flex-1">
                                        <ChatInput onSend={(text: string) => handleAISendBasedOnModel(text)}
                                                   disabled={isLoading}
                                                   onToggle={(checked) => handleSwitch(checked)}
                                                   value={inputValue}
                                                   onChange={setInputValue}
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>

                    </motion.div>
                )}

            </>
        )
    }

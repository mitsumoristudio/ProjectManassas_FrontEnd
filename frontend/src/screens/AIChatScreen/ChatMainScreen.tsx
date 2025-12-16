import CustomLoader from "../../components/Layout/CustomLoader";
import {Helmet} from "react-helmet";
import SideBar from "../../components/Layout/Graph & Tables/SideBar";
import {AIModel} from "../../components/Layout/DropdownMenu/ChatMenuSelector";
import ChatMenuSelector from "../../components/Layout/DropdownMenu/ChatMenuSelector";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import {PaperclipIcon} from "lucide-react"

import {useSendSemanticAIMessageMutation, useSendSafetyAIMessageMutation, useSendSummaryAIMessageMutation} from "../../features/chatapiSlice";
import React, { useState} from "react";
import {motion} from "framer-motion";
import ChatInput from "./ChatInput";
import {ChatMessageList} from "./ChatMessageList";
import PromptSelector from "../../components/Layout/PromptSelector";
import {chatConnection, startChatConnection} from "../../util/chatHub";

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
];

export function ChatMainScreen() {
    const [messages, setMessages] = useState<any[]>([]);
    const [sessionId] = useState("session-1234");
    const [inProgressMessage, setInProgressMessage] = useState<any>(null);
    // const responseControllerRef = useRef(null);
    // const [sources, setSources] = useState<any[]>([]);
    const [isDocumentMode, setIsDocumentMode] = useState(false);

  //  const [sendMessage, {isLoading}] = useSendAIMessageMutation();
    const [sendSemanticAIMessage, {isLoading}] = useSendSemanticAIMessageMutation();
    const [sendSafetyAIMessage] = useSendSafetyAIMessageMutation();
    const [sendSummaryAIMessage] = useSendSummaryAIMessageMutation();

    const [selectedModelId, setSelectedModelId] = useState("contract-ai");
    // const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
    const [selectedPromptId, setSelectedPromptId] = useState<string>();
    const [inputValue, setInputValue] = useState("");

    const {userInfo} = useSelector((state: any) => state.auth);

    // When a prompt is selected from the dropdown
    const handleSelectedPrompt = (promptId: string) => {
        setSelectedPromptId(promptId);
        const prompt = promptList.find((prompt) => prompt.id === promptId);
        if (prompt) {
            setInputValue(prompt.description);
        }
    }


    // ✅ Handles toggle change
    const handleSwitch = (state: boolean) => {
        console.log("Switch is now:", state ? "Document AI Mode" : "Normal AI Mode");
        setIsDocumentMode(state);
    };

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
            case "summary-gpt":
                await handleSummaryAIMessage(`${text}`);
                break;

            case "contract-ai":
                await handleSemanticAIMessage(`${text}`);
                break;

            case "safety-ai":
                await handleSafetyAIMessage(`${text}`);
                break;

            default:
                await handleSemanticAIMessage(text);
                break;
        }
    }

    const streamChat = async (text: string, mode: string) => {
        if (!text.trim()) return;

        await startChatConnection();

        const userMessage = {
            role: "user",
            messageContent: text,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);

        // Create placeholder assistant message
        const assistantMessage = {
            role: "assistant",
            messageContent: "",
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, assistantMessage]);

        const session = {
            sessionId,
            messages: [userMessage],
        };

        const stream = chatConnection.stream<string>(
            "StreamSemanticChatAsync", // or StreamChatAsync
            session,
            mode
        );

        stream.subscribe({
            next: (token) => {
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        messageContent:
                            updated[updated.length - 1].messageContent + token,
                    };
                    return updated;
                });
            },
            complete: () => {
                console.log("✅ Stream complete");
            },
            error: (err) => {
                console.error("❌ Stream error:", err);
            },
        });
    };

    const handleStreamAIModel = async (text: string) => {
        switch (selectedModelId) {
            case "summary-gpt":
                await streamChat(text, "summary");
                break;

            case "contract-ai":
                await streamChat(text, "contract");
                break;

            case "safety-ai":
                await streamChat(text, "safety");
                break;

            default:
                await streamChat(text, "contract");
                break;
        }
    }


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
                        <div className={"bg-[#0A0A0A] max-h-screen text-white font-sans flex"}>
                            <SideBar/>


                            <div className={"flex-1 flex flex-col min-w-1 bg-[#f7f7f7]"}>
                                {/*<ChatMessageExample/>*/}
                                <div
                                    className="h-14 border-b border-border px-4 flex items-center justify-between flex-shrink-0">
                                    <div className={" flex flex-1 justify-items-start mx-1 px-2 gap-x-4"}>
                                        <ChatMenuSelector
                                            models={models}
                                            selectedModelId={selectedModelId}
                                            onSelectModel={(id) => {
                                                console.log("Selected model:", id);
                                                setSelectedModelId(id);
                                            }}
                                        />

                                        {userInfo && userInfo.isAdmin && (
                                            <NavLink to={"/documentingestion"}>
                                                <PaperclipIcon size={24} color={"black"} className={"my-2"}/>
                                            </NavLink>
                                        )}

                                    </div>


                                    <PromptSelector prompts={promptList} onSelectPrompt={handleSelectedPrompt}
                                                    selectedPromptId={selectedPromptId}/>
                                </div>


                                <div className="flex flex-col h-screen bg-gray-50">
                                    <div className="flex-1 overflow-y-auto p-4 text-gray-800 text-2xl">
                                        <ChatMessageList
                                            messages={messages}
                                            inProgressMessage={inProgressMessage}
                                            showSources={isDocumentMode}
                                            noMessagesContent="Start a conversation with AI agents ...."
                                        />
                                        <h2 className={"p-2 text-blue-700 font-medium text-sm text-center"}>Please note
                                            that AI agent may give inaccurate information</h2>
                                    </div>
                                    {/*<ChatWindow/>*/}


                                    <div className="p-4 border-t bg-white items-center">
                                        <ChatInput onSend={(text) => handleAISendBasedOnModel(text)}
                                                   disabled={isLoading}
                                                   onToggle={handleSwitch}
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

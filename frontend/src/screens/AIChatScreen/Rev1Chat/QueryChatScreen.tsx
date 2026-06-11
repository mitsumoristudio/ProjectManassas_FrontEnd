import React, {useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import ChatSideBar from "../../../components/Layout/Graph & Tables/ChatSideBar";
import {useSelector } from "react-redux";
import { useParams} from "react-router-dom";
import {
    useGetPdfIngestedQuery,
} from "../../../features/chatapiSlice";

import {
    useGetPlayWrightProjectbyIdQuery,
    useGetPlayWrightQuerybyIdQuery,
} from "../../../features/playwrightApiSlice";
import {
    useContinueSummarizationMutation
} from "../../../features/contractAnalysisSlice";
import {toast} from "react-toastify";
import CustomLoaderSmall from "../../../components/Layout/CustomLoaderSmall";
import ChatInput from "../ChatInput";
import {ChatMessageList} from "../ChatMessageList";
import {motion} from "framer-motion";
import {useAzureTextToSpeech} from "../useAzureTextToSpeech";
import { sanitizeTextForTTS} from "../sanitizeTextForTTS";
import {useListProjectConversationByIdQuery} from "../../../features/conversationapiSlice";
import {useAzureSpeech} from "../../../components/useAzureSpeech";
import PdfOutlinePanel from "../../AIChatScreen/PdfOutlinePanel";
import { MicIcon, MicOffIcon} from "lucide-react";
import BoltCustomLoader from "../../../components/Layout/BoltCustomLoader";

export default function QueryChatScreen() {

    const [messages, setMessages] = useState<any[]>([]);
    const [inProgressMessage, setInProgressMessage] = useState<any>(null);
    const keyword = useParams();
    const [inputValue, setInputValue] = useState("");
    const [isDocumentMode, setIsDocumentMode] = useState(false);

    const [isPdfSideBarOpen, setIsPdfSideBarOpen] = useState(false);

    const {
        data: pdfs = [],
        isLoading: isPdfLoading,
        isError: isPdfError,
        refetch,
    } = useGetPdfIngestedQuery({keyword});

    const {id: playWrightQueryId} = useParams();

    const [continueSummarization, {isLoading}] = useContinueSummarizationMutation();
    const {data: queryInfo, refetch: refetchQuery} = useGetPlayWrightQuerybyIdQuery(playWrightQueryId);

    const azureBlobQueryId = queryInfo?.azureBlobId;
    const documentQueryId = queryInfo?.documentId;
    const playWrightQueryProjectId = queryInfo?.playWrightQueryProjectId;

    const {
        data: conversationMessages,
        isLoading: isMessagesLoading,
        refetch: refetchConversation,
    } =  useListProjectConversationByIdQuery(playWrightQueryId, {
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (conversationMessages && conversationMessages.length > 0) {
            setMessages(conversationMessages);
        }

       refetchQuery();

    }, [conversationMessages]);

    const summaryOnSubmitHandler = async (
        messages: string,
        projectQueryTitle?: string,
        playWrightProjectId?: string,
        documentId?: string,
        azureBlobId?: string,
    )=> {
        if (!messages?.trim()) {
            toast.error("Message cannot be empty");
            return;
        }

            try {
                const userMessage = {
                    role: "user",
                    messageContent: messages,
                    createdAt: new Date().toISOString(),
                };

                setMessages(prev => [...prev, userMessage])

                const session = {
                    sessionId: crypto.randomUUID(),
                    messages: [ {
                        role: "user",
                        messageContent: messages,
                        createdAt: new Date().toISOString(),
                    }]
                };

                const response = await continueSummarization({
                    projectQueryTitle: inputValue,
                    playWrightProjectId: playWrightQueryProjectId,
                    playWrightQueryId: playWrightQueryId.toString(),
                    azureBlobId: azureBlobQueryId,
                    singleTabular: "single-search",
                    documentId: azureBlobQueryId,
                    session : {
                        messages: [
                            {
                                role: "user",
                                messageContent: inputValue,
                            }
                        ]
                    }

                }).unwrap();

                await refetchConversation();

                setInputValue("");

                console.log("messages", messages);
                console.log("ProjectQueryTitle", inputValue);
                console.log("AzureBlobId", azureBlobQueryId);
                console.log("DocumentId", documentQueryId);
                console.log("PlayWrightQueryId", playWrightQueryId.toString());
                console.log("Response", response);
                console.log("ConversationMessages", conversationMessages);

            } catch (err) {
                console.error(err);
                toast.error("Failed to send message");
            }

            return;
    };


    // Authentication
    const {userInfo} = useSelector((state: any) => state.auth);

    // Use Azure Speech Service with sanitize Asterisk in conversation BOT
    const {speak: speakSpeech, stopSpeech: stopTheSpeech, resumeSpeech, pauseSpeech, isPaused, isPlaying } = useAzureTextToSpeech();

    const handleAssistantAzureMessageHandler = (text: string) => {
        if (!text?.trim()) return;

        const cleanText = sanitizeTextForTTS(text);

        speakSpeech(cleanText);
    }

    // Handle Scrolling upon selection
    const messageEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        scrollToBottom()
    }, [playWrightQueryId]);

    // Hide Header
    const hasStartedChat = messages.length > 0 || inProgressMessage;

    // Handle Speech Synthesis
    const {startSpeech, stopSpeech, isListening} = useAzureSpeech({
        onResult: (text: string) => {
            setInputValue(text);
        },
        onError: () => {
            toast.error("Speech support failed")
        }
    });

    return (
        <main>
            <Helmet>
                <title>Chat App</title>
                <meta name="description" content="Chat App"/>
            </Helmet>
            {isLoading && (
                <div className={"justify-center items-center py-20"}>
                    <BoltCustomLoader mode={"analysis"} />
                </div>
            )}


            {isMessagesLoading ? (
                <div className={"justify-center items-center py-20"}>
                    <CustomLoaderSmall />
                </div>
            ) : (
                <motion.div
                    initial={{opacity: 0, y: 60}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                    >
                    <div className={"bg-[#0A0A0A] h-screen text-white font-sans flex"}>
                        <ChatSideBar />

                        <div className={"flex-1 flex flex-col min-w-1 bg-[#f7f7f7]"}>
                            {/*================= Navigation Header ================= */}


                            {/* Chat Message List */}
                            <div className="flex flex-auto overflow-hidden h-screen bg-gray-50">

                                <div className="flex-1 overflow-y-auto p-4 text-gray-800 text-2xl">

                                    {/* SHOW ONLY BEFORE CHAT STARTS */}
                                    {!hasStartedChat && userInfo && (
                                        <div className="flex flex-col items-center justify-center h-full text-center">

                                            <h1 className="text-5xl font-bold text-gray-800 mb-4">
                                                AI Project Assistant
                                            </h1>

                                            <p className="text-xl text-gray-500 max-w-2xl">
                                                Ask questions about contracts, safety, project planning,
                                                equipment, proposals, and tabular data.
                                            </p>

                                        </div>
                                    )}

                                    {/* SHOW CHAT AFTER MESSAGE STARTS */}
                                    {hasStartedChat && userInfo && (
                                        <>
                                            <ChatMessageList
                                                messages={messages}
                                                inProgressMessage={inProgressMessage}
                                                showSources={isDocumentMode}
                                                noMessagesContent=""
                                                onSpeakHandler={handleAssistantAzureMessageHandler}
                                                onPause={pauseSpeech}
                                                onStop={stopTheSpeech}
                                                onResume={resumeSpeech}
                                                isPlaying={isPlaying}
                                                isPaused={isPaused}
                                            />

                                            <div ref={messageEndRef}></div>

                                        </>
                                    )}

                                    {isLoading && (
                                        <div className={"justify-center items-center py-20"}>
                                            <BoltCustomLoader mode={"summary"} />
                                        </div>
                                    )}

                                </div>

                                {/* PDF outline */}
                                {!isDocumentMode && isPdfSideBarOpen && (
                                    <section className="bg-white overflow-y-auto border-1 flex">

                                        <motion.div
                                            className={`relative z-10 transition-all duration-200 ease-in-out flex-shrink-0 ${
                                                isPdfSideBarOpen ? `w-54` : "w-20"
                                            }`}
                                            animate={{ width: isPdfSideBarOpen ? 340 : 40 }}
                                        >
                                            <PdfOutlinePanel messages={messages} />
                                        </motion.div>

                                    </section>
                                )}

                            </div>

                            <div className={"p-4 border-t bg-white"}>


                                {/*<ChatWindow/>*/}
                                { /*Speech Recognition*/}
                                <div className="flex items-end w-full gap-2">
                                    { /*Speech Synthesis*/}
                                    <button
                                        onPointerDown={startSpeech}
                                        onPointerUp={stopSpeech}
                                        onTouchStart={startSpeech}
                                        onTouchEnd={stopSpeech}
                                        className={`rounded-full p-2 transition ${
                                            isListening
                                                ? "bg-red-600 text-white animate-pulse"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                        title="Hold to talk">
                                        {isListening ? <MicOffIcon size={24} /> : <MicIcon size={24} />}
                                    </button>

                                    <div className={"flex-1"}>
                                        <ChatInput onSend={() => summaryOnSubmitHandler(inputValue)}
                                                   disabled={isMessagesLoading}
                                                   value={inputValue}
                                                   onChange={setInputValue}
                                        />
                                    </div>


                                </div>

                            </div>
                            <h2 className="p-2 text-blue-700 font-medium text-sm text-center">
                                Please note that AI agent may give inaccurate information
                            </h2>

                        </div>
                    </div>
                </motion.div>
            )}

        </main>
    )
}
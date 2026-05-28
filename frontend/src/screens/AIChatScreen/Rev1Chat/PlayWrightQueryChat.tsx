

import ChatSideBar from "../../../components/Layout/Graph & Tables/ChatSideBar";
import {useSelector, } from "react-redux";
import {useLocation, useParams, useNavigate} from "react-router-dom";
import {useAzureSpeech} from "../../../components/useAzureSpeech"
import React, {useState, useEffect, useRef,} from "react";
import {sanitizeTextForTTS} from "../../AIChatScreen/sanitizeTextForTTS";
import ChatInput from "../ChatInput";
import {ChatMessageList} from "../ChatMessageList";
import {toast} from "react-toastify";
import {useAzureTextToSpeech} from "../../AIChatScreen/useAzureTextToSpeech";
import {Helmet} from "react-helmet";
import CustomLoaderSmall from "../../../components/Layout/CustomLoaderSmall";
import {useSendSummaryAIMessageMutation} from "../../../features/chatapiSlice";
import { motion } from "framer-motion";
import PdfOutlinePanel from "../PdfOutlinePanel";
import {MicIcon, MicOffIcon} from "lucide-react";

export default function PlayWrightQueryChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [inProgressMessage, setInProgressMessage] = useState<any>(null);
    const [inputValue, setInputValue] = useState("");
    const {id: sessionIdParam} = useParams();
    const [isDocumentMode, setIsDocumentMode] = useState(false);
    const [isPdfSideBarOpen, setIsPdfSideBarOpen] = useState(false);
    const location = useLocation();

    const [sendSummaryAIMessage, {isLoading}] = useSendSummaryAIMessageMutation();
    // Authentication
    const {userInfo} = useSelector((state: any) => state.auth);
    const [sessionId] = useState("session-1234");

    // Handler for document summarize
    const handleSummarizeHandler = async (snippet: string) => {
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

    // Use Azure Speech Service with sanitize Asterisk in conversation BOT
    const {speak: speakSpeech, stopSpeech: stopTheSpeech, resumeSpeech, pauseSpeech, isPaused, isPlaying } = useAzureTextToSpeech();

    const handleAssistantAzureMessageHandler = (text: string) => {
        if (!text?.trim()) return;

        const cleanText = sanitizeTextForTTS(text);

        speakSpeech(cleanText);
    }

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
    }, [sessionIdParam]);

    useEffect(() => {
        if (location.state?.initialMessages) {
            setMessages(location.state.initialMessages);
        }
    }, [location.state]);


    return (
        <main>
            <Helmet>
                <title>PlayWright Chat</title>
                <meta name="description" content="Chat App"/>
            </Helmet>
            {isLoading ? (
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

                        <div className={"h-14 border-b border-border px-4 my-2 flex items-center justify-between flex-shrink-0"}>
                            <div className={"flex flex-1 justify-items-start mx-1 px-2 gap-x-4"}>

                                {/* Chat Message List */}
                                <div className="flex flex-auto overflow-hidden h-screen bg-gray-50">

                                    <div className="flex-1 overflow-y-auto p-4 text-gray-800 text-2xl">

                                        {/* SHOW ONLY BEFORE CHAT STARTS */}
                                        {!hasStartedChat && (
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
                                                    noMessagesContent="Please ask a question on contract"
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

                                    </div>

                                    {/* PDF outline */}
                                    {!isDocumentMode && isPdfSideBarOpen && userInfo && (
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

                                        <ChatInput onSend={(text: string) => handleSummarizeHandler(text)}
                                                   disabled={isLoading}
                                                   value={inputValue}
                                                   onChange={setInputValue}
                                        />
                                        <h2 className="p-2 text-blue-700 font-medium text-sm text-center">
                                            Please note that AI agent may give inaccurate information
                                        </h2>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </motion.div>
            )}


        </main>
    )
}
import CustomLoader from "../../components/Layout/CustomLoader";
import {Helmet} from "react-helmet";
import SideBar from "../../components/Layout/Graph & Tables/SideBar";
// import DashboardHeader from "../../components/Layout/DashBoardHeader";

import {useSendAIMessageMutation, useSendSemanticAIMessageMutation, useSearchMessageQuery} from "../../features/chatapiSlice";
import React, {useRef, useState} from "react";
import {motion} from "framer-motion";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

export function ChatMainScreen() {
    const [messages, setMessages] = useState<any[]>([]);
    const [sessionId] = useState("session-1234");
    const [inProgressMessage, setInProgressMessage] = useState<any>(null);
    const responseControllerRef = useRef(null);

    const [sendMessage, {isLoading}] = useSendAIMessageMutation();

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage = {
            role: "user",
            messageContent: text,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInProgressMessage({role: "assistant", messageContent: "..."});

        try {
            const session = {
                sessionId,
                messages: [userMessage],
            };

            const response: any = await sendMessage(session).unwrap();

            if (response?.messageContent) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: response.role,
                        messageContent: response.messageContent,
                        createdAt: response.createdAt,
                    },
                ]);
            }

        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setInProgressMessage(null);
        }

    };


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
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                >
                    <div className={"bg-[#0A0A0A] text-white font-sans min-h-screen flex"}>
                        <SideBar/>

                        <div className={"flex-1 flex flex-col"}>


                            <div className="flex flex-col h-screen bg-gray-50">
                                <div className="flex-1 overflow-y-auto p-4 text-gray-800 text-2xl">
                                    <ChatMessageList
                                        messages={messages}
                                        inProgressMessage={inProgressMessage}
                                        noMessagesContent="Start a conversation with AI agent ...."
                                    />
                                    <h2 className={"p-2 text-blue-700 font-medium text-sm text-center"}>Please note that AI agent may give inaccurate information</h2>
                                </div>

                                <div className="p-4 border-t bg-white">
                                    <ChatInput onSend={handleSendMessage} disabled={isLoading}/>
                                </div>
                            </div>

                        </div>

                    </div>

                </motion.div>
            )}

        </>
    )
}
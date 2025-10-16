import CustomLoader from "../../components/Layout/CustomLoader";
import {Helmet} from "react-helmet";
import SideBar from "../../components/Layout/Graph & Tables/SideBar";
import DashboardHeader from "../../components/Layout/DashBoardHeader";
import {ChatSessionModel, ChatMessageModel} from "../../model/ChatModel";
import {useSendMessageMutation, useSearchMessageQuery} from "../../features/chatapiSlice";
import {useState} from "react";
import {motion} from "framer-motion";

export function ChatExampleScreen() {
    const [sendMessage, {isLoading, data: response}] = useSendMessageMutation();
    const [input, setInput] = useState("");

    const handleSendMessage = async () => {
        await sendMessage({
            sessionId: "Test-session",
            message: [
                {role: "user", messageContent: input}
            ]
        });
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
                            <DashboardHeader/>
                        </div>

                    </div>

                </motion.div>
            )}

        </>
    )
}

import React, {useEffect, useState, useRef} from "react";
import ChatSideBar from "../../components/Layout/Graph & Tables/ChatSideBar";
import ChatInputRev1 from "../../screens/AIChatScreen/ChatInputRev1";
import {assets} from "../../assets/assets";
import {useSelector, useDispatch, } from "react-redux";

export default function AssistantChatScreen() {
    const [loaded, setLoaded] = useState(false);
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [iconOffset, setIconOffset] = useState(0);
    const [textOffset, setTextOffset] = useState(0);
    const textRef = useRef<HTMLHeadingElement>(null);
    const {userInfo} = useSelector((state: any) => state.auth);
    const [inputValue, setInputValue] = useState("");

const onSubmitHandler = (message: string) => {
    console.log("message", message);
    setInputValue("");
}

    return (
        <main>
            <div className={" h-screen text-white font-sans flex"}>
                {/*<SideBar/>*/}
                <ChatSideBar/>

                <div className={"flex flex-col h-full w-full px-6 bg-[#f7f7f7]"}>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="flex-col items-center w-full max-w-4xl relative px-0 xl:px-8">

                            {/*Header & UserName*/}
                            <div className="flex flex-row gap-x-4 items-center justify-center mb-10 space-y-4">
                                <img
                                    alt=""
                                    src={assets.mori_solution_logo2}
                                    className="h-12 w-12 rounded-3xl shadow-md"
                                />

                                <h1
                                    ref={textRef}
                                    className="text-4xl font-serif font-light text-gray-900 text-center "
                                >
                                    Hello, {userInfo?.userName?.split(' ')[0]}
                                </h1>
                            </div>

                            {/* Chat Input */}
                            <ChatInputRev1
                                onSend={onSubmitHandler}
                                value={inputValue}
                                onChange={setInputValue}
                            />

                            <div className="text-center">
                                <p className="text-sm py-3 mb-3 text-gray-500">
                                    AI can make mistakes. Answers are for the purpose of construction compliance.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </main>
    )
}
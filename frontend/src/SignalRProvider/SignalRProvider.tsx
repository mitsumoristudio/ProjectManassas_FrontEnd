import {ChatUI} from "../SignalRProvider/ChatUI";
import {ChatProvider} from "../SignalRProvider/ChatRProvider";
import React from "react";


export default function SignalRProvider() {
    // @ts-ignore
    return (
       <ChatProvider>
           <ChatUI />
       </ChatProvider>
    )
}

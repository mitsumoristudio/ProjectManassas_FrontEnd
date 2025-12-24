import {ChatUI} from "../SignalRProvider/ChatUI";
import ProjectChatUI from "../SignalRProvider/ProjectChatUI";
import {ChatProvider} from "../SignalRProvider/ChatRProvider";
import ProjectChatProvider from "../SignalRProvider/ProjectChatProvider"
import React from "react";


export default function SignalRProvider() {

    return (
       <ChatProvider>
           <ChatUI />
       </ChatProvider>
       //  <ProjectChatProvider>
       //      <ProjectChatUI />
       //  </ProjectChatProvider>
    )
}

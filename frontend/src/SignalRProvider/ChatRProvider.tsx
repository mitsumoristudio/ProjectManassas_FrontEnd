import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import * as signalR from "@microsoft/signalr";
import {BASE_RPC, CHAT_HUB_URL, PRODUCTION_CHATHUB, PRODUCTION_RPC} from "../util/urlconstants";
import ChatProjectCard from "../SignalRProvider/ChatProjectCard";

export type ChatMessage = { user: string; message: string };

type ChatContextType = {
    messages: ChatMessage[];
    sendMessage: (user: string, message: string) => Promise<void>;
    isConnected: boolean;
    streamingMessage: string | null;
    isTyping: boolean;
    projects: any[];
    openCreateProject: boolean;
    setOpenCreateProject: (project: any) => void;

    selectedProject: any | null;
    setSelectedProject: (project: any | null) => void;
};

const ChatContext = createContext<ChatContextType>({
    messages: [],
    sendMessage: async () => {},
    isConnected: false,
    streamingMessage: null,
    isTyping: false,
    projects: [],
    setOpenCreateProject: () => {},
    openCreateProject: false,
    selectedProject: {},
    setSelectedProject: () => {},

});

export const useChat = () => useContext(ChatContext);

type ChatProviderProps = { children: ReactNode };

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null);
    const [projects, setProjects] = useState([]);
    const [openCreateProject, setOpenCreateProject] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    const connectionRef = useRef<signalR.HubConnection | null>(null);

    async function sendChatCommand(text: string) {
        let rpcBody: any = null;
        let lower = text.toLowerCase();

        const isListCommand =
            lower.startsWith("list projects") ||
            lower.startsWith("list all projects") ||
            lower.startsWith("show projects") ||
            lower === "projects" ||
            lower === "list" ||
            lower === "show";

        if (isListCommand) {
            rpcBody = {
                jsonrpc: "2.0",
                id: Date.now(),
                method: "list_projects",
                params: {}
            };
        }  else if (text.toLowerCase().startsWith("find project")) {
            const query = text.replace("find project", "").trim();

            rpcBody = {
                jsonrpc: "2.0",
                id: Date.now(),
                method: "find_project",
                params: {projectName: query}
            }
        }

        if (text.startsWith("create project")) {
            const name = text.replace("create project", "").trim();
            rpcBody = {
                jsonrpc: "2.0",
                id: Date.now(),
                method: "create_project",
                params: {
                    projectName: name,
                    description: "",
                    projectNumber: "",
                    location: "",
                    contractor: "",
                    projectEstimate: 0,
                    projectManager: "" }
            };
        }

    if (!rpcBody) return null;

    try {
     //  const response = await fetch(BASE_RPC, {
        const response = await fetch(PRODUCTION_RPC, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rpcBody)
        });
        const json = await response.json();
        const result = json.result ?? json.error;
        let formatted: string;

        if (Array.isArray(result)) {
            formatted = result
                .map(p => `• ${p.projectName} (${p.location})\n  ${p.projectNumber} \n`)
                .join("\n\n");

            setProjects(result);
            setSelectedProject(null);

        } else if (result?.projectName) {
            setProjects([]);

            // @ts-ignore
            setMessages(prev => [...prev, {
                user: "assistant",
                message: <ChatProjectCard project={result} />
            }])
        }

        else {
            formatted = JSON.stringify(result, null, 2)
        }

        setMessages(prev => [...prev, {user: "assistant", message: formatted}]);
      //  setMessages(prev => [...prev, {user: "assistant", message: JSON.stringify(json.result ?? json.error, null, 2)}]);
        return json;

    } catch (err) {
        console.error("JSON-RPC error:", err);
        setMessages(prev => [...prev, {user: "assistant", message: "Error calling backend"}]);
    }

    }

    useEffect(() => {
        if (connectionRef.current) return;

        const connection = new signalR.HubConnectionBuilder()
        //   .withUrl(CHAT_HUB_URL, {
            .withUrl(PRODUCTION_CHATHUB, {
                withCredentials: true,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connectionRef.current = connection;

        let isCancelled = false;

        connection.on("ReceiveChatMessage", (user: string, message: string) => {
            setMessages(prev => [...prev, { user, message }]);
        });

        connection.on("ReceiveStreamingMessage", (fullMessage: string) => {
            setIsTyping(true);
            setStreamingMessage("");
            let index = 0;

            const interval = setInterval(() => {
                index++;
                setStreamingMessage(fullMessage.slice(0, index));

                if (index === fullMessage.length) {
                    clearInterval(interval);
                    setIsTyping(false);
                    setMessages(prev => [...prev, { user: "assistant", message: fullMessage }]);
                    setStreamingMessage(null);
                }
            }, 20);
        });

        const startConnection = async () => {
            try {
                await connection.start();
                if (!isCancelled) {
                    console.log("✅ SignalR Connected");
                    setIsConnected(true);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error("❌ SignalR start error:", err);
                }
            }
        };

        startConnection();

        return () => {
            isCancelled = true;

            if (
                connection.state === signalR.HubConnectionState.Connected ||
                connection.state === signalR.HubConnectionState.Connecting
            ) {
                connection.stop().catch(() => {});
            }

            connectionRef.current = null;
        };
    }, []);

    const sendMessage = async (user: string, message: string) => {
        const text = message.toLowerCase();

        if (text.startsWith("create project")
            || text.startsWith("new project") ||
                text.startsWith("create a project")
            || text.startsWith("setup new project") ||
            text.startsWith("establish new project") ||
            text.startsWith("create new project")) {
            setOpenCreateProject(true);
            return;
        }

        // Routing
        const commandRoute = [
            {
                match: (t: string) =>
                    t.startsWith("list all projects") ||
                    t.startsWith("list projects") ||
                    t.startsWith("show projects") ||
                    t.startsWith("get all projects") ||
                    t.startsWith("show me all projects") ||
                    t === "all projects",
                action: sendChatCommand
            },
            {
                match: (t: string) => t.startsWith("find project"),
                action: async (message: string) => {
                    const search = message.replace(/^find project/i, "").trim();
                    await sendChatCommand(`find project ${search}`);
                }
            },
            {
                match: t => t.includes("project") && (t.includes("find") || t.includes("search") || t.includes("look up")),
                action: sendChatCommand
            },
            {
                match: (t: string) => t.startsWith("create project") || t.startsWith("create a project")
                                    || t.startsWith("new project") || t.startsWith("create new project") ||
                                         t.startsWith("setup new project"),
                action: sendChatCommand
            }
        ];

        for (const route of commandRoute) {
            if (route.match(text)) {
                await route.action(message);
                return;
            }
        }

       if (!hubConnection || hubConnection.state !== signalR.HubConnectionState.Connected) {
           try {
               await hubConnection.invoke("SendChatMessage", user, message);
           } catch (err) {
               console.error("SignalR connection error:", err);
           }
       }
    };

    return (
        <ChatContext.Provider value={{ openCreateProject, setOpenCreateProject, messages, sendMessage, isConnected, streamingMessage,
            isTyping, projects, selectedProject, setSelectedProject}}>
            {children}
        </ChatContext.Provider>
    );
};

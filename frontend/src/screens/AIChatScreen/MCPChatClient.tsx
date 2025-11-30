import React, { useState, useRef, useEffect } from "react";



export default function MCPChatClient() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const wsRef = useRef<WebSocket | null>(null);
    const idRef = useRef(1);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080"); // Node.js proxy
        wsRef.current = ws;

        ws.onopen = () => console.log("Connected to WebSocket MCP proxy");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, { sender: "MCP", text: JSON.stringify(data, null, 2) }]);
        };

        ws.onerror = (err) => console.error("WebSocket error", err);
        ws.onclose = () => console.log("MCP connection closed");

        return () => ws.close();
    }, []);

    const sendRequest = (method: string, params: object = {}) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(
            JSON.stringify({
                jsonrpc: "2.0",
                id: idRef.current++,
                method,
                params,
            })
        );
    };

    return (
        <>
            <div className="p-4">
                <div className="mb-2 h-64 overflow-auto border p-2">
                    {messages.map((msg, i) => (
                        <div key={i} className={msg.sender === "MCP" ? "text-left" : "text-right"}>
                            <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                    ))}
                </div>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendRequest("list_projects_async")}
                />
                <button
                    onClick={() => sendRequest("list_projects_async")}
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                >
                    List Projects
                </button>
            </div>

        </>
    );
}

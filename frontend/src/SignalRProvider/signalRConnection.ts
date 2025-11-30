import {useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/projectHub")
    .withAutomaticReconnect()
    .build();

export function useSignalR() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (hubConnection.state === signalR.HubConnectionState.Disconnected) {
            hubConnection
                .start()
                .then(() => setIsConnected(true))
                .catch((err) => {
                    console.error("SignalR connection failed: ", err);
                    setTimeout(() => {
                        hubConnection.start();
                    }, 2000);
                });
        } else if (hubConnection.state === signalR.HubConnectionState.Connected) {
            setIsConnected(true);
        }

        // Cleanup: optional, you can leave connection alive
        return () => {
            // hubConnection.stop(); // usually we keep a singleton running
        };
    }, []);

    return isConnected;
}
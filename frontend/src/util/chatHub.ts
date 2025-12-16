import * as signalR from "@microsoft/signalr";

export const chatConnection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub") // adjust base URL if needed
    .withAutomaticReconnect()
    .build();

export async function startChatConnection() {
    if (chatConnection.state === signalR.HubConnectionState.Disconnected) {
        await chatConnection.start();
    }
}

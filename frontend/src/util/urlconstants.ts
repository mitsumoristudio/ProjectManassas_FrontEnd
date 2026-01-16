

export const PRODUCTION_URL =
    "https://nashai2-b2c3hhgwdwepcafk.centralus-01.azurewebsites.net";

export const LOCAL_URL = "http://localhost:5000";

/* ✅ BASE URL */
export const BASE_URL =  LOCAL_URL;

/* ✅ Core APIs */
export const PROJECT_URL = "/api/projects";
export const USERS_URL = "/api/users";
export const UPLOAD_URL = "/api/uploads";
export const EQUIPMENTS_URL = "/api/equipments";

/* ✅ JSON-RPC */
export const BASE_RPC = `${BASE_URL}/api/rpc`;

export const PDF_URL = `${BASE_URL}/api/pdfs/preview`;
export const PRODUCTION_PDF_URL = `${PRODUCTION_URL}/api/pdfs/preview`;

/* ✅ SignalR */
export const PRODUCTION_RPC = `${PRODUCTION_URL}/api/rpc`;
export const PRODUCTION_CHATHUB = `${PRODUCTION_URL}/chatHub`;
export const PROJECT_CHAT = `http://localhost:5000/api/projects/projectChat`;

/* ✅ WebSocket Speech to Text, Text to Speech */
export const SPEECH_TO_TEXT_URL = "http://localhost:5000/api/speech/tts"
export const PRODUCTION_SPEECH_TO_TEXT_URL = `${PRODUCTION_URL}/api/speech/tts`;

export const WEBSOCKET_URL = "ws://localhost:5000/ws/speech"
export const PRODUCTION_WEBSOCKET_URL = `${PRODUCTION_URL}/ws/speech`;

export const CHAT_HUB_URL = `${LOCAL_URL}/chatHub`;

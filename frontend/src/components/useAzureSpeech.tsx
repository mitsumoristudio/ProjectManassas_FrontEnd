
import { useState, useRef} from "react";

type UsePushToTalkProps = {
    onResult: (text: string) => void;
    onError?: (error: any) => void;
};

export function useAzureSpeech({onResult, onError}: UsePushToTalkProps) {
    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [isListening, setIsListening] = useState(false);

    const startSpeech = async () => {
        if (isListening) return;

        try {
            // 1️⃣ WebSocket → ASP.NET Core
            wsRef.current = new WebSocket("ws://localhost:5000/ws/speech");
            wsRef.current.onmessage = e => onResult(e.data);

            // 2️⃣ Microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // 3️⃣ AudioContext @ 16kHz (Azure requirement)
            const audioContext = new AudioContext({ sampleRate: 16000 });
            await audioContext.resume();
            audioContextRef.current = audioContext;

            // 4️⃣ Load AudioWorklet
            await audioContext.audioWorklet.addModule("/audio-worklet-processor.js");

            // 5️⃣ Mic → Source
            const source = audioContext.createMediaStreamSource(stream);

            // 6️⃣ AudioWorkletNode
            const workletNode = new AudioWorkletNode(audioContext, "pcm-processor");
            workletNodeRef.current = workletNode;

            // 7️⃣ Receive PCM from worklet
            workletNode.port.onmessage = (event) => {
                if (wsRef.current?.readyState !== WebSocket.OPEN) return;

                const float32 = event.data as Float32Array;
                const pcm16 = float32ToPCM16(event.data);

                wsRef.current.send(pcm16);
            };

            // 8️⃣ Connect graph (no speakers needed)
            source.connect(workletNode);

            setIsListening(true);
        } catch (err) {
            onError?.(err);
            stopSpeech();
        }
    };

    const stopSpeech = () => {
        // Disconnect worklet
        if (workletNodeRef.current) {
            workletNodeRef.current.disconnect();
            workletNodeRef.current = null;
        }

        // Stop mic tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Close AudioContext safely
        if (audioContextRef.current) {
            if (audioContextRef.current.state !== "closed") {
                audioContextRef.current.close().catch(() => {});
            }
            audioContextRef.current = null;
        }

        // Close WebSocket safely
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "END" }));
        }


        setIsListening(false);
    };


    return { startSpeech, stopSpeech, isListening };
}

function float32ToPCM16(float32: Float32Array): ArrayBuffer {
    const pcm16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        pcm16[i] = Math.max(-1, Math.min(1, float32[i])) * 0x7fff;
    }
    return pcm16.buffer;
}
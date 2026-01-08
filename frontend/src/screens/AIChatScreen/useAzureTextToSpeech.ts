import { useRef, useState, useCallback } from "react";
import {SPEECH_TO_TEXT_URL} from "../../util/urlconstants"

export function useAzureTextToSpeech() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [isPaused, setIsPaused] = useState<boolean>(false)

    const speakSpeech = useCallback(async (text: string) => {

        if (!text.trim()) return;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
        }

        const res = await fetch(SPEECH_TO_TEXT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept":"speech.wav"},
            body: JSON.stringify(text)
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`TTS failed with error: ${error}`);
        }

        const contentType = res.headers.get("content-type");
        console.log("TTS content-type:", contentType);

        if (!contentType?.includes("audio")) {
            const text = await res.text();
            console.error("Non-audio response:", text);
            throw new Error("Response is not audio");
        }

        const blob = await res.blob();
        console.log("Audio blob size:", blob.size);

        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => {
            setIsPlaying(true);
            setIsPaused(false);
        }

        audio.onpause = () => {
            setIsPaused(false);
            setIsPaused(true);
        }

        audio.onended = () => {
            setIsPlaying(false);
            setIsPaused(false);
            URL.revokeObjectURL(url);
        }

        audio.onerror = (e) =>  {
            console.error("Audio error", e);
            setIsPaused(false);
            setIsPlaying(false);
        }

        await audio.play();
        setIsPlaying(true);
        setIsPaused(false);

    }, []);

    const pauseSpeech = useCallback(() => {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            setIsPaused(true);
            setIsPaused(false);
        }
    }, []);

    const resumeSpeech = useCallback(() => {
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play();
        }
    }, []);

    const stopTheSpeech = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
            setIsPlaying(false);
            setIsPaused(false);
        }
    }, []);

    return { speak: speakSpeech,
             resumeSpeech,
             pauseSpeech,
             stopSpeech: stopTheSpeech,
             isPlaying: isPlaying,
            isPaused,};
}
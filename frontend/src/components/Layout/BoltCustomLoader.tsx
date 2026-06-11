
import React, {useState, useRef, useEffect} from "react";
import {assets} from "../../assets/assets";

interface LoaderProps {
    mode: "search" | "summary" | "analysis";
}

export default function BoltCustomLoader({mode} : LoaderProps) {

    const loaderMessages = {
        search: [
            "Searching documents...",
            "Finding relevant sections...",
            "Checking references...",
        ],
        summary: [
            "Reading content...",
            "Building summary...",
            "Formatting response...",
        ],
        analysis: [
            "Analyzing contract...",
            "Extracting clauses...",
            "Evaluating risks...",
        ],
    };

    const messages = loaderMessages[mode];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [mode, messages.length]);

    return (
        <main>
            <div className={"flex flex-col items-center gap-3"}>
                <img
                    alt=""
                    src={assets.image_bolt2}
                    className="w-16 h-16 animate-spin"
                />
                <p className={"text-sm text-gray-500 transition-opacity duration-400"}>
                    {messages[index]}
                </p>
            </div>
        </main>
    )
}
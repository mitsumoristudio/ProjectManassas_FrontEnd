import React from "react";

export const ScrollArea = () => {
    const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

    return (
        <div className="relative w-64 h-64 overflow-y-auto rounded-2xl border border-gray-300 shadow-md bg-white p-4 scroll-smooth">
            {/* Top gradient shadow */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10" />

            <ul className="space-y-2">
                {items.map((item) => (
                    <li
                        key={item}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium"
                    >
                        {item}
                    </li>
                ))}
            </ul>

            {/* Bottom gradient shadow */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10" />
        </div>
    );
};


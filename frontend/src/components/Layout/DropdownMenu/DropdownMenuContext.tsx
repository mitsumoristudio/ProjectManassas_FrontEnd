
import React, { useEffect, useRef } from "react";
import { useDropdownMenu } from "./DropdownMenu";

interface DropdownMenuContentProps {
    children: React.ReactNode;
    align?: "start" | "end" | "center";
    className?: string;
}

export function DropdownMenuContent({
                                        children,
                                        align = "start",
                                        className,
                                    }: DropdownMenuContentProps) {
    const { isOpen, setIsOpen, triggerRef } = useDropdownMenu();
    const contentRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target as Node) &&
                !triggerRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsOpen]);

    if (!isOpen) return null;

    const alignment = {
        start: "left-0",
        end: "right-0",
        center: "left-1/2 -translate-x-1/2",
    }[align];

    return (
        <div
            ref={contentRef}
            role="menu"
            className={(
                "absolute mt-2 min-w-[10rem] bg-gray-300 rounded-lg border bg-popover shadow-md p-1 z-50 animate-in fade-in-0 zoom-in-95")}
        >
            {children}
        </div>
    );
}

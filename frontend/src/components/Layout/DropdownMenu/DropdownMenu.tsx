
import React, { createContext, useContext, useState, useRef } from "react";

interface DropdownMenuContextValue {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    triggerRef: React.RefObject<HTMLButtonElement>;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

export function useDropdownMenu() {
    const ctx = useContext(DropdownMenuContext);
    if (!ctx) throw new Error("useDropdownMenu must be used within <DropdownMenu>");
    return ctx;
}

interface DropdownMenuProps {
    children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
        <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
            <div className="relative inline-block text-left">{children}</div>
        </DropdownMenuContext.Provider>
    );
}


import React from "react";
import { useDropdownMenu } from "./DropdownMenu";

interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export function DropdownMenuTrigger({ children, asChild = false }: DropdownMenuTriggerProps) {
    const { isOpen, setIsOpen, triggerRef } = useDropdownMenu();

    const toggleMenu = () => setIsOpen((prev) => !prev);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement, {
            ref: triggerRef,
            onClick: toggleMenu,
            "aria-expanded": isOpen,
            "aria-haspopup": "menu",
        });
    }

    return (
        <button
            ref={triggerRef}
            onClick={toggleMenu}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
            aria-expanded={isOpen}
            aria-haspopup="menu"
        >
            {children}
        </button>
    );
}

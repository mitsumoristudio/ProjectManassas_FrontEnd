
import React from "react";
import { useDropdownMenu } from "./DropdownMenu";


interface DropdownMenuItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
    const { setIsOpen } = useDropdownMenu();

    const handleClick = () => {
        onClick?.();
        setIsOpen(false); // auto close after click
    };

    return (
        <button
            role="menuitem"
            onClick={handleClick}
            className={
                "w-full text-left px-3 py-2 text-md text-gray-800 rounded-md hover:bg-accent focus:bg-accent focus:outline-none"

            }
        >
            {children}
        </button>
    );
}

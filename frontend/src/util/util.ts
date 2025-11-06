import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for conditionally combining Tailwind CSS class names.
 * It merges duplicates intelligently (e.g., handles 'px-4' overriding 'px-2').
 */
export default function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

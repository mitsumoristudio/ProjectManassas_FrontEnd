
export function sanitizeTextForTTS(text: string): string {
    return text
        // Remove markdown bold / italics
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/_(.*?)_/g, "$1")

        // Remove bullet points
        .replace(/^\s*[-*+]\s+/gm, "")

        // Remove headings (#, ##)
        .replace(/^#{1,6}\s+/gm, "")

        // Remove inline code
        .replace(/`([^`]*)`/g, "$1")

        // Remove block quotes
        .replace(/^>\s+/gm, "")

        // Remove HTML tags
        .replace(/<[^>]*>/g, "")

        // Remove citations like [1], [2]
        .replace(/\[\d+]/g, "")

        // Collapse whitespace
        .replace(/\s+/g, " ")
        .trim();
}

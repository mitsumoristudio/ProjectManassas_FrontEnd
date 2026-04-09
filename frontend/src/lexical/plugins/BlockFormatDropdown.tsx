import React from "react";
import { LexicalEditor } from "lexical";
import {formatParagraph,
        formatHeading,
        formatNumberedList,
        formatBulletList,
        formatCheckList
} from "../../lexical/utils/utils";
import {HeadingNode} from "@lexical/rich-text";

type Props = {
    editor: LexicalEditor;
    blockType: string;
};

export default function BlockFormatDropdown({
                                                editor,
                                                blockType,
                                            }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        switch (value) {
            case "paragraph":
                formatParagraph(editor);
                break;
            case "h1":
            case "h2":
            case "h3":
                formatHeading(editor, blockType, value);
                break;
            case "number":
                formatNumberedList(editor, blockType);
                break;
            case "bullet":
                formatBulletList(editor, blockType);
                break;
            case "check":
                formatCheckList(editor, blockType);
                break;
        }
    };

    return (
        <select
            value={blockType}
            onChange={handleChange}
            className="
        px-2 py-1 text-sm
        border border-gray-300 rounded-md
        bg-white
        hover:border-gray-400
        focus:outline-none focus:ring-1 focus:ring-blue-400
      "
        >
            <option value="paragraph">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="number">Numbered List</option>
            <option value="bullet">Bullet List</option>
            <option value="check">Check List</option>
        </select>
    );
}
import React from "react";
import { LexicalEditor } from "lexical";
import {
    $getSelection,
    $isRangeSelection,
} from "lexical";
import { $patchStyleText } from "@lexical/selection";

type Props = {
    editor: LexicalEditor;
    value: string;
    options: string[];
    style: "font-size" | "font-family";
    disabled?: boolean;
};

export const FONT_SIZE_OPTIONS = [
    "10px","11px","12px","13px","14px",
    "15px","16px","17px","18px","19px","20px"
];

export const FONT_FAMILY_OPTIONS = [
    "Arial",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Verdana"
];

export default function MoreSimpleFontDropDown({
                                              editor,
                                              value,
                                              options,
                                              style,
                                              disabled = false,
                                          }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;

        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {
                    [style]: selected,
                });
            }
        });
    };

    return (
        <select
            value={value}
            disabled={disabled}
            onChange={handleChange}
            className="
        px-2 py-1 text-sm
        border border-gray-300 rounded-md
        bg-white
        hover:border-gray-400
        focus:outline-none focus:ring-1 focus:ring-blue-400
      "
        >
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
}
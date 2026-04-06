import React from 'react';

import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo2Icon,
    RedoIcon,
    AlignJustify,
} from 'lucide-react';


import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';


function Divider() {
    return <div className="w-px bg-gray-200 mx-1" />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
                setCanUndo(payload);
                return false;
            }, COMMAND_PRIORITY_LOW),
            editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
                setCanRedo(payload);
                return false;
            }, COMMAND_PRIORITY_LOW)
        );
    }, [editor, $updateToolbar]);

    // 🔹 reusable button styles
    const baseBtn =
        "flex items-center justify-center p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed";

    const active = "bg-blue-100/30";

    return (
        <div
            className="flex mb-[1px] bg-white p-1 rounded-t-lg"
            ref={toolbarRef}
        >
            {/* Undo */}
            <button
                disabled={!canUndo}
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                className={baseBtn}
            >
                <Undo2Icon size={18} />
            </button>

            {/* Redo */}
            <button
                disabled={!canRedo}
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                className={baseBtn}
            >
                <RedoIcon size={18} />
            </button>

            <Divider />

            {/* Bold */}
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={`${baseBtn} ${isBold ? active : ''}`}
            >
                <Bold size={18} />
            </button>

            {/* Italic */}
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={`${baseBtn} ${isItalic ? active : ''}`}
            >
                <Italic size={18} />
            </button>

            {/* Underline */}
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={`${baseBtn} ${isUnderline ? active : ''}`}
            >
                <Underline size={18} />
            </button>

            {/* Strike */}
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                className={`${baseBtn} ${isStrikethrough ? active : ''}`}
            >
                <Strikethrough size={18} />
            </button>

            <Divider />

            {/* Alignments */}
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                className={baseBtn}
            >
                <AlignLeft size={18} />
            </button>

            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                className={baseBtn}
            >
                <AlignCenter size={18} />
            </button>

            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                className={baseBtn}
            >
                <AlignRight size={18} />
            </button>

            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
                className={baseBtn}
            >
                <AlignJustify size={18} />
            </button>
        </div>
    );
}
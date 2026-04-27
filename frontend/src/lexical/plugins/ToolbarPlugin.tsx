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
    LucideHighlighter,
    ScissorsIcon,
    ClipboardPasteIcon,
    PrinterIcon,
    SaveIcon,
    MessageCircleIcon,
    FolderIcon,
    FilesIcon
} from 'lucide-react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {

    createCommand,
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
    COPY_COMMAND,
    CUT_COMMAND,
    COMMAND_PRIORITY_NORMAL,
} from 'lexical';
import { ListNode, ListItemNode, } from '@lexical/list';
import { useCallback, useEffect, useRef, useState } from 'react';
import {$getSelectionStyleValueForProperty} from '@lexical/selection';
import {parseFontSizeForToolbar} from "../../lexical/plugins/FontSize";
import parseHtmlToDocx from "../../lexical/utils/parseHtmlToDocx";

import MoreSimpleFontDropDown, {
    FONT_FAMILY_OPTIONS,
    FONT_SIZE_OPTIONS
} from '../../lexical/plugins/MoreSimpleFontDropDown';
import { $generateHtmlFromNodes } from '@lexical/html';


import {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";

function Divider() {
    return <div className="w-px bg-gray-200 mx-1" />;
}

export function getEditorHtml(editor) {
    let html = '';

    editor.update(() => {
        html = $generateHtmlFromNodes(editor, null);
    });

    return html;
}

async function exportToDocx(editor) {
    const html = getEditorHtml(editor);
    const content = parseHtmlToDocx(html);

    const doc = new Document({
        numbering: {
            config: [
                {
                    reference: "numbered-list",
                    levels: [
                        {
                            level: 0,
                            format: "decimal",
                            text: "%1.",
                        },
                    ],
                },
            ],
        },
        sections: [
            {
                children: [
                    new Paragraph({
                        text: "Report",
                        heading: HeadingLevel.TITLE,
                    }),
                    ...content,
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "report.docx");
}

export function buildPdfHtml(content) {
    return `
    <html>
      <head>
        <title>Document:</title>
        <style>
          body {
            font-family: "Times New Roman", serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }

          .page {
            padding: 1in;
          }

          h1, h2, h3 {
            page-break-after: avoid;
          }

          p {
            margin: 10px 0;
          }

          ul, ol {
            margin-left: 20px;
          }

          @media print {
            @page {
              margin: 1in;
            }
          }
        </style>
      </head>

      <body>
        <div class="page">
          ${content}
        </div>
      </body>
    </html>
  `;
}





const initialConfig = {
    nodes: [ListNode, ListItemNode],
};

export const INSERT_FROM_CLIPBOARD = createCommand();


export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [canHighlight, setCanHighlight] = useState(false);
    const [canCopy, setCanCopy] = useState(false);
    const [canCut, setCanCut] = useState(false);


    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [blockType, setBlockType] = useState("paragraph");

    const [fontSize, setFontSize] = useState("12px");
    const [fontFamily, setFontFamily] = useState("Arial");

    function exportToPdf(editor) {
        const content = getEditorHtml(editor);
        const html = buildPdfHtml(content);

        const win = window.open('', '_blank');

        win.document.write(html);
        win.document.close();

        win.focus();
        win.print(); // user chooses "Save as PDF"
    }


    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));



            const fontSizeValue = $getSelectionStyleValueForProperty(
                selection,
                'font-size',
                '15px'
            );

            const fontFamilyValue = $getSelectionStyleValueForProperty(
                selection,
                'font-family',
                'Arial'
            );

            setFontSize(parseFontSizeForToolbar(fontSizeValue) || '15px');
            setFontFamily(fontFamilyValue || 'Arial');

            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();

            const type = anchorNode.getType();

            setBlockType(type);
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
            }, COMMAND_PRIORITY_LOW),

            editor.registerCommand(INSERT_FROM_CLIPBOARD, (text:any) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        selection.insertText(text);
                    }
                })
                return true;
            },
                COMMAND_PRIORITY_NORMAL,
            )
        );
    }, [editor, $updateToolbar]);

    // 🔹 reusable button styles
    const baseBtn =
        "flex items-center justify-center p-2 rounded-lg shrink-0 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed";

    const active = "bg-blue-100/30";

    function ToolbarButton({ active, onClick, children }) {
        return (
            <button
                onClick={onClick}
                className={`
        flex items-center justify-center p-2 rounded-lg
        hover:bg-gray-200
        ${active ? "bg-blue-100/30" : ""}
      `}
            >
                {children}
            </button>
        );
    }

    // @ts-ignore
    return (
        <div
            className="flex items-center w-full overflow-x-auto whitespace-nowrap bg-white px-1 gap-1"
            ref={toolbarRef}
        >
            <button
                title={"Open Folder"}
                onClick={ async () => {}}
                className={"hover:bg-gray-300 rounded-md px-2 transition-colors"}>
                <FolderIcon size={18} />
            </button>

            <button
                title={"Print PDF"}
                className={"hidden md:flex items-center justify-center p-2 rounded-md shrink-0 hover:bg-gray-300"}
                onClick={ async () => {}}>
                <MessageCircleIcon size={18} />
            </button>

            {/* Undo */}
            <button
                title={"Undo"}
                disabled={!canUndo}
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                className={baseBtn}
            >
                <Undo2Icon size={18} />
            </button>

            {/* Redo */}
            <button
                title={"Redo"}
                disabled={!canRedo}
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                className={baseBtn}
            >
                <RedoIcon size={18} />
            </button>

            <Divider />
                {/* existing buttons */}
                <MoreSimpleFontDropDown
                    editor={editor}
                    value={fontFamily}
                    options={FONT_FAMILY_OPTIONS}
                    style={"font-family"}
                />

            <MoreSimpleFontDropDown
                editor={editor}
                value={fontSize}
                options={FONT_SIZE_OPTIONS}
                style={"font-size"}
            />

            {/* Bold */}
            <button
                title={"Bold"}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={`${baseBtn} ${isBold ? active : ''}`}
            >
                <Bold size={18} />
            </button>

            {/* Italic */}
            <button
                title={"Italic"}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={`${baseBtn} ${isItalic ? active : ''}`}
            >
                <Italic size={18} />
            </button>

            {/* Underline */}
            <button
                title={"Underline"}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={`${baseBtn} ${isUnderline ? active : ''}`}
            >
                <Underline size={18} />
            </button>

            {/* Strike */}
            <button
                title={"Strikethrough"}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                className={`${baseBtn} ${isStrikethrough ? active : ''}`}
            >
                <Strikethrough size={18} />
            </button>

            {/* Alignments */}
            <button
                title={"Align Left"}
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                className={baseBtn}
            >
                <AlignLeft size={18} />
            </button>

            <button
                title={"Align Center"}
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                className={baseBtn}
            >
                <AlignCenter size={18} />
            </button>

            <button
                title={"Alight Right"}
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                className={baseBtn}
            >
                <AlignRight size={18} />
            </button>

            <button
                title={"Justify"}
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
                className={baseBtn}
            >
                <AlignJustify size={18} />
            </button>

            <Divider />

            <button
                title={"Highlight"}
                disabled={canHighlight}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}
                className={baseBtn}
            >
                <LucideHighlighter size={18} />
            </button>

            <button
                title={"Copy ClipBoard"}
                onClick={() => editor.dispatchCommand(COPY_COMMAND, "copy")}
            className={baseBtn}
            >
            <FilesIcon size={18} />
            </button>

            <button
                title={"Cut"}
                onClick={() => editor.dispatchCommand(CUT_COMMAND, "cut")}
                className={baseBtn}
            >
                <ScissorsIcon size={18} />
            </button>

            <button
                title={"Paste ClipBoard"}
                onClick={ async () => {
                    const text = await navigator.clipboard.readText();
                    editor.dispatchCommand(INSERT_FROM_CLIPBOARD, text);
                }}
                className={baseBtn}
            >
                <ClipboardPasteIcon size={18} />
            </button>

            <Divider />

            <button
                title={"Print PDF"}
                className={"hidden md:flex items-center justify-center p-2 rounded-md shrink-0 hover:bg-gray-300"}
            onClick={ async () => {exportToPdf(editor)}}>
                <PrinterIcon size={18} />
            </button>

            <button
                title={"Save as Doc file"}
                className={"hidden md:flex items-center justify-center p-2 rounded-md shrink-0 hover:bg-gray-300"}
                onClick={ async () => {exportToDocx(editor)}}>
                <SaveIcon size={18} />
            </button>

        </div>
    );
}
import React, {JSX} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import FontSize, {parseFontSizeForToolbar} from "../../lexical/plugins/FontSize";
import {
    clearFormatting,
    formatBulletList,
    formatCheckList,
    formatHeading,
    formatNumberedList,
    formatParagraph
} from "../../lexical/utils/utils";

import {
    $getSelectionStyleValueForProperty,
    $isParentElementRTL,
    $patchStyleText,
} from '@lexical/selection';

import {
    $getSelection,
    SKIP_SELECTION_FOCUS_TAG,
    $addUpdateTag,
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

import {
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListOrderedIcon,
    ListIcon,
    LucideCircleCheck,
    TextIcon,
} from 'lucide-react';
import {SHORTCUTS} from "../../lexical/utils/shortcuts";
import {blockTypeToBlockName} from "../../lexical/plugins/ToolbarContext";
import {LexicalEditor} from "lexical";
import DropDown from "../../lexical/components/DropDown";
import {DropDownItem} from "../../lexical/components/DropDown";


const FONT_FAMILY_OPTIONS: [string, string][] = [
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
    ['10px', '10px'],
    ['11px', '11px'],
    ['12px', '12px'],
    ['13px', '13px'],
    ['14px', '14px'],
    ['15px', '15px'],
    ['16px', '16px'],
    ['17px', '17px'],
    ['18px', '18px'],
    ['19px', '19px'],
    ['20px', '20px'],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rootTypeToRootName = {
    root: 'Root',
    table: 'Table',
};

function Divider() {
    return <div className="w-px bg-gray-200 mx-1" />;
}

function dropDownActiveClass(active: boolean) {
    if (active) {
        return 'active dropdown-item-active';
    } else {
        return '';
    }
}

export default function FontDropDown({
    editor,
    blockType,
    value,
    rootType,
    style,
    disabled = false,
                                     }: {
    blockType: keyof typeof  blockTypeToBlockName;
    rootType: keyof  typeof rootTypeToRootName;
    editor: LexicalEditor;
    disabled: boolean;
    style: string;
    value: string;

}): JSX.Element {

    const handleClick = useCallback(
        (option: string) => {
            editor.update(() => {
                $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
                const selection = $getSelection();
                if (selection !== null) {
                    $patchStyleText(selection, {
                        [style]: option,
                    });
                }
            });
        },
        [editor, style],
    );

    const buttonAriaLabel =
        style === 'font-family'
            ? 'Formatting options for font family'
            : 'Formatting options for font size';

    return (
        <main>

            <DropDown
                buttonClassName={"toolbar-item block-controls"}
                disabled={disabled}
                buttonIconClassName={`icon block-type` + blockType}
                buttonLabel={blockTypeToBlockName[blockType]}
                buttonAriaLabel={"Formatting options for text style"}>

                <DropDownItem
                    className={
                        'item wide ' + dropDownActiveClass(blockType === 'paragraph')
                    }
                    onClick={() => formatParagraph(editor)}>
                    <div className="icon-text-container">
                        <i className="icon paragraph" />

                        <TextIcon size={10} />
                        <span className="text">Normal</span>
                    </div>
                    <span className="shortcut">{SHORTCUTS.NORMAL}</span>
                </DropDownItem>
                <DropDownItem
                    className={'item wide ' + dropDownActiveClass(blockType === 'h1')}
                    onClick={() => formatHeading(editor, blockType, 'h1')}>
                    <div className="icon-text-container">
                        <i className="icon h1" />
                        <Heading1Icon size={10} />

                        <span className="text">Heading 1</span>
                    </div>
                    <span className="shortcut">{SHORTCUTS.HEADING1}</span>
                </DropDownItem>
                <DropDownItem
                    className={'item wide ' + dropDownActiveClass(blockType === 'h2')}
                    onClick={() => formatHeading(editor, blockType, 'h2')}>
                    <div className="icon-text-container">
                        <i className="icon h2" />
                        <Heading2Icon size={10} />

                        <span className="text">Heading 2</span>
                    </div>
                    <span className="shortcut">{SHORTCUTS.HEADING2}</span>
                </DropDownItem>

                <DropDownItem
                    className={'item wide ' + dropDownActiveClass(blockType === 'h3')}
                    onClick={() => formatHeading(editor, blockType, 'h3')}>
                    <div className="icon-text-container">
                        <i className="icon h3" />
                        <Heading3Icon size={10} />

                        <span className="text">Heading 3</span>
                    </div>
                    <span className="shortcut">{SHORTCUTS.HEADING3}</span>
                </DropDownItem>

                <DropDownItem
                    className={'item wide ' + dropDownActiveClass(blockType === 'number')}
                    onClick={() => formatNumberedList(editor, blockType)}>
                    <div className="icon-text-container">
                        <i className="icon numbered-list" />
                        <ListOrderedIcon size={10} />

                        <span className="text">Numbered List</span>
                    </div>
                    <span className="shortcut">{SHORTCUTS.NUMBERED_LIST}</span>
                </DropDownItem>

                <DropDownItem
                    className={'item wide ' + dropDownActiveClass(blockType === 'bullet')}
                    onClick={() => formatBulletList(editor, blockType)}>
                    <div className="icon-text-container">
                        <i className="icon bullet-list" />
                        <ListIcon size={10} />

                        <span className="text">Bullet List</span>
                    </div>
                    <span className="shortcut">{SHORTCUTS.BULLET_LIST}</span>
                </DropDownItem>

                <DropDownItem
                    className={'item wide ' + dropDownActiveClass(blockType === 'check')}
                    onClick={() => formatCheckList(editor, blockType)}>
                    <div className="icon-text-container">
                        <i className="icon check-list" />
                        <LucideCircleCheck size={10} />

                        <span className="text">Check List</span>
                    </div>
                    <span className="shortcut">{SHORTCUTS.CHECK_LIST}</span>
                </DropDownItem>

            </DropDown>


            {/*<DropDown*/}
            {/*    disabled={disabled}*/}
            {/*    buttonClassName={'toolbar-item ' + style}*/}
            {/*    buttonLabel={value}*/}
            {/*    buttonIconClassName={*/}
            {/*        style === 'font-family' ? 'icon block-type font-family' : ''*/}
            {/*    }*/}
            {/*    buttonAriaLabel={buttonAriaLabel}>*/}
            {/*    {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(*/}
            {/*        ([option, text]) => (*/}
            {/*            <DropDownItem*/}
            {/*                className={`item ${dropDownActiveClass(value === option)} ${*/}
            {/*                    style === 'font-size' ? 'fontsize-item' : ''*/}
            {/*                }`}*/}
            {/*                onClick={() => handleClick(option)}*/}
            {/*                key={option}>*/}
            {/*                <span className="text">{text}</span>*/}
            {/*            </DropDownItem>*/}
            {/*        ),*/}
            {/*    )}*/}
            {/*</DropDown>*/}

        </main>
    )
}
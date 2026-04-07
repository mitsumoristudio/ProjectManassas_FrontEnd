import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {PlusIcon, MinusIcon} from "lucide-react";

import {LexicalEditor} from 'lexical';
import {
    MAX_ALLOWED_FONT_SIZE,
    MIN_ALLOWED_FONT_SIZE
} from "../../lexical/plugins/ToolbarContext";

import {SHORTCUTS} from "../../lexical/utils/shortcuts";

import {isKeyboardInput} from "../../lexical/utils/focusUtils";
import {
    updateFontSize,
    updateFontSizeInSelection,
    UpdateFontSizeType
} from "../../lexical/utils/utils";

function parseFontSize(input: string): [number, string] | null {
    const match = input.match(/^(\d+(?:\.\d+)?)(px|pt)$/);
    return match ? [Number(match[1]), match[2]] : null;
}

function normalizeToPx(fontSize: number, unit: string): number {
    return unit === 'pt' ? Math.round((fontSize * 4) / 3) : fontSize;
}

function isValidFontSize(fontSizePx: number): boolean {
    return (
        fontSizePx >= MIN_ALLOWED_FONT_SIZE && fontSizePx <= MAX_ALLOWED_FONT_SIZE
    );
}

export function parseFontSizeForToolbar(input: string): string {
    const parsed = parseFontSize(input);
    if (!parsed) {
        return '';
    }

    const [fontSize, unit] = parsed;
    const fontSizePx = normalizeToPx(fontSize, unit);
    return `${fontSizePx}px`;
}

export function parseAllowedFontSize(input: string): string {
    const parsed = parseFontSize(input);
    if (!parsed) {
        return '';
    }

    const [fontSize, unit] = parsed;
    const fontSizePx = normalizeToPx(fontSize, unit);
    return isValidFontSize(fontSizePx) ? input : '';
}

export default function FontSize({
    selectionFontSize,
    disabled,
    editor
}: {
    selectionFontSize: string;
    disabled: boolean;
    editor: LexicalEditor;
}) {
    const [inputValue, setInputValue] = React.useState<string>(selectionFontSize);
    const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false);
    const [isMouseMode, setIsMouseMode] = React.useState(false);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const inputValueNumber = Number(inputValue);

        if (e.key === 'Tab') {
            return;
        }
        if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
            e.preventDefault();
            setInputValue('');
            return;
        }
        setInputChangeFlag(true);
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();

            updateFontSizeByInputValue(inputValueNumber, !isMouseMode);
        }
    };

    const handleInputBlur = () => {
        setIsMouseMode(false);

        if (inputValue !== '' && inputChangeFlag) {
            const inputValueNumber = Number(inputValue);
            updateFontSizeByInputValue(inputValueNumber);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        setIsMouseMode(true);
    };

    const updateFontSizeByInputValue = (
        inputValueNumber: number,
        skipRefocus: boolean = false,
    ) => {
        let updatedFontSize = inputValueNumber;
        if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
        } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
        }

        setInputValue(String(updatedFontSize));
        updateFontSizeInSelection(
            editor,
            String(updatedFontSize) + 'px',
            null,
            skipRefocus,
        );
        setInputChangeFlag(false);
    };

    return (
        <main>
            <div className={"flex items-center"}>
            <button
                type="button"
                disabled={
                    disabled ||
                    (selectionFontSize !== '' &&
                        Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)
                }
                onClick={(e) => {
                    updateFontSize(
                        editor,
                        UpdateFontSizeType.decrement,
                        inputValue,
                        isKeyboardInput(e),
                    );
                }}
                className="flex items-center justify-center p-0 mr-[3px] disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Decrease font size"
                title={`Decrease font size (${SHORTCUTS.DECREASE_FONT_SIZE})`}>
                <i className="format minus-icon" />

                <MinusIcon size={8} />
            </button>

            <input
                type="number"
                title="Font size"
                value={inputValue}
                disabled={disabled}
                className="toolbar-item font-size-input"
                min={MIN_ALLOWED_FONT_SIZE}
                max={MAX_ALLOWED_FONT_SIZE}
                onChange={(e) => setInputValue(e.target.value)}
                onClick={handleClick}
                onKeyDown={handleKeyPress}
                onBlur={handleInputBlur}
            />

            <button
                type="button"
                disabled={
                    disabled ||
                    (selectionFontSize !== '' &&
                        Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)
                }
                onClick={(e) => {
                    updateFontSize(
                        editor,
                        UpdateFontSizeType.increment,
                        inputValue,
                        isKeyboardInput(e),
                    );
                }}
                className="font-bold text-[14px] text-gray-500
          rounded-md border border-gray-400
          h-[20px] w-[40px]
          px-[4px] py-[2px]
          text-center
          appearance-none
          disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Increase font size"
                title={`Increase font size (${SHORTCUTS.INCREASE_FONT_SIZE})`}>
                <i className="flex items-center justify-center
          p-0 ml-[3px]
          disabled:opacity-20 disabled:cursor-not-allowed" />

                <PlusIcon size={8} />

            </button>

        </div>
        </main>
    )

}


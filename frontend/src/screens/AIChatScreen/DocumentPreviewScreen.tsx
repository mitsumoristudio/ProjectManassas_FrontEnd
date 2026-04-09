import React, { useEffect, useState } from "react";
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import ChatSideBar from "../../components/Layout/Graph & Tables/ChatSideBar";

import {
    $isTextNode,
    DOMConversionMap,
    DOMExportOutput,
    DOMExportOutputMap,
    isHTMLElement,
    Klass,
    LexicalEditor,
    LexicalNode,
    ParagraphNode,
    TextNode,
} from 'lexical';

import ToolbarPlugin from "../../lexical/plugins/ToolbarPlugin";
import ExampleTheme from "../../lexical/plugins/ExampleTheme";
import { parseAllowedFontSize, parseAllowedColor} from "../../lexical/styleConfig";

export default function DocumentPreviewScreen() {

    const enterSomeText = "Enter some text ..."

    const removeStylesExportDOM = (
        editor: LexicalEditor,
        target: LexicalNode
    ): DOMExportOutput => {
        const output = target.exportDOM(editor);
        if (output && isHTMLElement(output.element)) {
            // Remove all inline styles and classes if the element is an HTMLElement
            // Children are checked as well since TextNode can be nested
            // in i, b, and strong tags.
            // @ts-ignore
            for (const el of [
                output.element,
                ...output.element.querySelectorAll('[style],[class]'),
            ]) {
                el.removeAttribute('class');
                el.removeAttribute('style');
            }
        }
        return output;
    };

    const exportMap: DOMExportOutputMap = new Map<
        Klass<LexicalNode>,
        (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
    >([
        [ParagraphNode, removeStylesExportDOM],
        [TextNode, removeStylesExportDOM],
    ]);

    const getExtraStyles = (element: HTMLElement): string => {
        // Parse styles from pasted input, but only if they match exactly the
        // sort of styles that would be produced by exportDOM
        let extraStyles = '';
        const fontSize = parseAllowedFontSize(element.style.fontSize);
        const backgroundColor = parseAllowedColor(element.style.backgroundColor);
        const color = parseAllowedColor(element.style.color);
        if (fontSize !== '' && fontSize !== '15px') {
            extraStyles += `font-size: ${fontSize};`;
        }
        if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
            extraStyles += `background-color: ${backgroundColor};`;
        }
        if (color !== '' && color !== 'rgb(0, 0, 0)') {
            extraStyles += `color: ${color};`;
        }
        return extraStyles;
    };

    const constructImportMap = (): DOMConversionMap => {
        const importMap: DOMConversionMap = {};

        // Wrap all TextNode importers with a function that also imports
        // the custom styles implemented by the playground
        for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
            importMap[tag] = (importNode) => {
                const importer = fn(importNode);
                if (!importer) {
                    return null;
                }
                return {
                    ...importer,
                    conversion: (element) => {
                        const output = importer.conversion(element);
                        if (
                            output === null ||
                            output.forChild === undefined ||
                            output.after !== undefined ||
                            output.node !== null
                        ) {
                            return output;
                        }
                        const extraStyles = getExtraStyles(element);
                        if (extraStyles) {
                            const { forChild } = output;
                            return {
                                ...output,
                                forChild: (child, parent) => {
                                    const textNode = forChild(child, parent);
                                    if ($isTextNode(textNode)) {
                                        textNode.setStyle(textNode.getStyle() + extraStyles);
                                    }
                                    return textNode;
                                },
                            };
                        }
                        return output;
                    },
                };
            };
        }

        return importMap;
    };

    const editorConfig = {
        html: {
            export: exportMap,
            import: constructImportMap(),
        },
        namespace: 'Document Preview',
        nodes: [ParagraphNode, TextNode],
        onError(error: Error) {
            throw error;
        },
        theme: ExampleTheme,
    };

    return (
        <main>
            {/*Keep the h-screen to show the chat input. Do not change*/}
            <div className={" h-screen text-white font-sans flex"}>
                {/*<SideBar/>*/}
                <ChatSideBar/>

                <LexicalComposer initialConfig={editorConfig}>
                <div className={"w-3/4 px-6 py-4 text-black relative leading-5 font-normal text-left rounded-t-lg"}>
                    <ToolbarPlugin />
                    <div className={"bg-white relative border min-h-[800px] border-gray-400 rounded-2xl shadow-md"}>
                        <RichTextPlugin contentEditable={
                            <ContentEditable
                                aria-placeholder = {enterSomeText}
                                placeholder = {
                                    <div className={"absolute top-[15px] left-[10px] text-gray-400 text-[15px] pointer-events-none"}>{enterSomeText}</div>
                                }
                                className = {"w-3/4 min-h-[400px] text-[20px] px-6 py-4 outline-none caret-gray-700"}

                                 />
                        }
                                        ErrorBoundary={LexicalErrorBoundary}
                                        />
                        <HistoryPlugin delay={1000}/>
                    </div>

                </div>
            </LexicalComposer>

            </div>

        </main>
    )
}
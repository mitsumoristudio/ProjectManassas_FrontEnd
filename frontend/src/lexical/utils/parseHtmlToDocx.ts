import {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
    TextRun,
} from "docx";
import { saveAs } from "file-saver";

export default function parseHtmlToDocx(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const elements = [];

    doc.body.childNodes.forEach((node) => {
        const text = node.textContent?.trim();
        if (!text) return;

        switch (node.nodeName) {
            case "H1":
                elements.push(
                    new Paragraph({
                        text,
                        heading: HeadingLevel.HEADING_1,
                    })
                );
                break;

            case "H2":
                elements.push(
                    new Paragraph({
                        text,
                        heading: HeadingLevel.HEADING_2,
                    })
                );
                break;

            case "P":
                elements.push(
                    new Paragraph({
                        children: [new TextRun(text)],
                    })
                );
                break;

            case "UL":
                node.childNodes.forEach((li) => {
                    elements.push(
                        new Paragraph({
                            text: li.textContent,
                            bullet: { level: 0 },
                        })
                    );
                });
                break;

            case "OL":
                node.childNodes.forEach((li) => {
                    elements.push(
                        new Paragraph({
                            text: li.textContent,
                            numbering: {
                                reference: "numbered-list",
                                level: 0,
                            },
                        })
                    );
                });
                break;

            default:
                elements.push(new Paragraph(text));
        }
    });

    return elements;
}
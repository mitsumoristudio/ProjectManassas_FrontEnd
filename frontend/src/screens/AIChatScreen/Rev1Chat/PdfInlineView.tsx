// import { Document, Page, pdfjs} from "react-pdf";
// import { useLocation, useParams } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";
// import React from "react";
//
// // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// //     "pdfjs-dist/build/pdf.worker.min.js",
// //     import.meta.url
// // ).toString();
//
// export default function PDFInlineView({clause}) {
//     const { azureBlobUrl, sourcePage } = clause;
//
//     // console.log("PDF URL:", azureBlobUrl);
//
//     const [numPages, setNumPages] = useState(0);
//     const pageRefs = useRef({});
//
//     useEffect(() => {
//         if (!numPages) return;
//
//         const timeout = setTimeout(() => {
//             pageRefs.current[sourcePage]?.scrollIntoView({
//                 behavior: "smooth",
//                 block: "start"
//             });
//         }, 300);
//
//         return () => clearTimeout(timeout);
//
//     }, [sourcePage, numPages]);
//
//     return (
//         <main>
//             <div>
//                 <div className="text-sm font-semibold mb-2">
//                     Page {sourcePage}
//                 </div>
//
//                 <Document
//                     file={{
//                         url: encodeURI(azureBlobUrl),
//                     }}
//                     onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                     onLoadError={(err) => {
//                         console.error("PDF LOAD ERROR:", err);
//                     }}
//                     loading={<p>Loading PDF...</p>}
//                 >
//                    <Page pageNumber={numPages} />
//                 </Document>
//             </div>
//         </main>
//     )
// }
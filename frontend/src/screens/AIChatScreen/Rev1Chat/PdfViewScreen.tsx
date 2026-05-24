// import React from 'react';
// import { useState } from 'react';
// import { Document, Page } from 'react-pdf';
//
// export default function PdfViewScreen(props) {
//     const [numPages, setNumPages] = useState<number>();
//     const [pageNumber, setPageNumber] = useState<number>(1);
//
//     function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
//         setNumPages(numPages);
//     }
//
//     return (
//         <div>
//             <Document file="
// https://41026mori.blob.core.windows.net/41026mori/Town%20of%20Kernville%20Construction%20Agreement_0f96a477-e2cc-4e9a-874a-d33cf22482d4.pdf" onLoadSuccess={onDocumentLoadSuccess}>
//                 <Page pageNumber={pageNumber} />
//             </Document>
//             <p>
//                 Page {pageNumber} of {numPages}
//             </p>
//         </div>
//     );
// }
import {useParams} from "react-router-dom";
import {
    useDeleteEntirePdfMutation,
    useDeletePdfIngestedMutation,
    useGetPdfFromPlayWrightProjectIdQuery
} from "../../../../features/chatapiSlice";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {EllipsisIcon, FileText, Folder, SearchIcon, Trash2Icon} from "lucide-react";

export function PdfListTable() {

    const {id} = useParams();

    const {
        data: pdfs = [],
        isError: isPdfError,
        refetch,
    } = useGetPdfFromPlayWrightProjectIdQuery(id);


    const [searchTerms, setSearchTerm] = useState("");
    const filterByOriginalFileName = pdfs?.filter((item: any) => item.originalFileName.toLowerCase().includes(searchTerms.toLowerCase()));

    const [deleteEntirePdf] = useDeleteEntirePdfMutation();
    const [deletePdfEmbedding] = useDeletePdfIngestedMutation();
    const [activePdfMenu, setPdfActiveMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    // const [highlights, setHighlights] = useState([]);

    const [selectedFile, setSelectedFile] = useState<any | null>(null);
    const onPreviewPdf = (file: any) => {
        console.log("selectedFile", file);
        setSelectedFile(file)
    }

    // DeletePdfEmbedding && File
    const onPdfDeleteHandler = async (id: string) => {
        if (window.confirm(`Are you sure you want to delete this pdf`)) {
            try {
                await Promise.all([
                    deleteEntirePdf(id).unwrap(),
                    deletePdfEmbedding(id).unwrap()
                ]);

                refetch();
                toast.success("Pdf has been deleted!");
            } catch (error) {
                toast.error("Problem with deleting this pdf")
            }
        }
        setPdfActiveMenu(null);
    }

    const handlePdfSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const terms = e.target.value.toLowerCase();
        setSearchTerm(terms);
    }

    // when user click outside the ellipsis, the window closes
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setPdfActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium mb-3">PDF Files</h2>

                <div className={"flex flex-row gap-2"}>
                    <SearchIcon className={"my-2 relative left-10"} color={"gray"} size={24}/>
                    <input
                        type='text'
                        onChange={handlePdfSearch}
                        placeholder='Search...'
                        className='bg-gray-200 text-gray-700 text-sm placeholder-gray-400 rounded-lg pl-16 pr-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                </div>

            </div>

            <div className="bg-white rounded-2xl overflow-hidden border">
                <div className={"divide-y max-h-[240px] overflow-y-auto scroll-smooth cursor-pointer"}>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Type</th>
                            <th className="text-left p-3">Last modified</th>
                            <th className="text-left p-3">More</th>

                        </tr>
                        </thead>
                        <tbody>
                        {filterByOriginalFileName?.map((file: any, i: number) => (
                            <tr key={i} className="border-t hover:bg-gray-50 cursor-pointer"
                                onClick={() => onPreviewPdf(file)}>

                                <td className="p-3 flex items-center gap-2">
                                    {file.type === "Folder" ? (
                                        <Folder size={16}/>
                                    ) : (
                                        <FileText size={16}/>
                                    )}
                                    {file.originalFileName}
                                </td>
                                <td className="p-3">PDF</td>
                                <td className="p-3">{new Date(file.createdAt).toLocaleDateString(
                                    "en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                )}</td>
                                <td className="p-2"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPdfActiveMenu(prev => prev === file.id ? null : file.id)
                                        }}
                                    >
                                        <EllipsisIcon size={20}
                                                      className={"relative right-2 text-gray-800 hover:bg-gray-400 rounded-md mx-2 transition-colors mb-2"}/>
                                    </button>
                                </td>
                                {/* Edit Query Window */}
                                {activePdfMenu === file.id && (
                                    <div className="mt-4 z-40 bg-gray-500 rounded-lg shadow p-2">
                                        <button
                                            onClick={() => onPdfDeleteHandler(file.id)}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-300 rounded-md w-full"
                                        >
                                            <Trash2Icon size={20} color="blue"/>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </tr>

                        ))}

                        {isPdfError && (
                            <>
                                <span className="px-2 text-red-500 text-sm">Error Loading PDF</span>
                            </>
                        )}

                        </tbody>
                    </table>

                </div>

                {selectedFile && (
                    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">

                        {/* PANEL */}
                        <div className="w-[60%] h-full bg-white shadow-xl relative">

                            {/* CLOSE BUTTON */}
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="absolute top-4 right-4 z-10 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                ✕ Close
                            </button>

                            {/* PDF PREVIEW */}
                            <iframe
                                title={"AzureBlobURL"}
                                src={
                                    selectedFile.azureBlobUrl.includes("%")
                                        ? selectedFile.azureBlobUrl
                                        : encodeURI(selectedFile.azureBlobUrl)
                                }
                                width="100%"
                                height="100%"
                                className="border-0"
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
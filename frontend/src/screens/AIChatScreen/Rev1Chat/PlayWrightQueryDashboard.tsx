import {
    Folder,
    FileText,
    Share2,
    ArrowLeftFromLine,
    EllipsisIcon,
    ChevronDown, Trash2Icon, MailsIcon, SearchIcon
} from "lucide-react";
import React, {useEffect, useState, useRef, useMemo} from "react";
import SideBar from "../../../components/Layout/Graph & Tables/SideBar";
import {assets} from "../../../assets/assets";
import {useSelector } from "react-redux";
import PlayWrightChatInput from "./PlayWrightChatInput";
import {
    useGetPdfFromPlayWrightProjectIdQuery,
    useDeletePdfIngestedMutation,
    useDeleteEntirePdfMutation,
    useFetchExcelFilesQuery,
    useDeleteExcelIngestedFilesMutation, useGetColumnsBySheetIdQuery, useGetRowsBySheetIdQuery,
} from "../../../features/chatapiSlice";
import {
    useAddPlayWrightQueryMutation,
    useGetPlayWrightProjectbyIdQuery,
    useUpdatePlayWrightQueryMutation,
    useDeletePlayWrightQueryMutation,
    useGetPlayWrightQueryListQuery,
  } from "../../../features/playwrightApiSlice";

import {toast} from "react-toastify";
import {useParams, useNavigate, NavLink} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import {
    useBulkUpdateCellMutation,
    useDeleteCellMutation,
    useInsertRowMutation,
    useUpdateCellMutation
} from "../../../features/excelapiSlice";


// ================= Recent Queries =================
export function RecentQueries({data, tabularOrSingleQuery, refetch , isPlayWrightError}) {

    const {userInfo} = useSelector((state: any) => state.auth);
    const navigate = useNavigate();

    const [projectQueryTitle, setProjectQueryTitle] = useState<string>("");
    const [openQuery, setOpenQuery] = useState<boolean>(false);
    const [editQueryId, setEditQueryId] = useState<string | null>(null);
    const [updatePlayWrightQuery] = useUpdatePlayWrightQueryMutation();
    const [deletePlayWrightQuery] = useDeletePlayWrightQueryMutation();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [addQuery] = useAddPlayWrightQueryMutation();

    // Edit PlayWrightQuery
    const onSelectQueryEditHandler = (query: any) => {

        setEditQueryId(query?.id);
        setProjectQueryTitle(query.projectQueryTitle);
        setOpenQuery(true);
        setActiveMenu(null);

        refetch();
    }

    // Create new QueryTitle
    const onCreateQueryTitleHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userInfo) {
            toast.error("You must be logged in!");
            return;
        }
        try {
            if (editQueryId) {
                await updatePlayWrightQuery({
                    id: editQueryId,
                    projectQueryTitle: projectQueryTitle,
                }).unwrap();
                toast.success("Query has been updated!");
            } else {
                const newQuery = {
                    projectQueryTitle: projectQueryTitle,
                };
                await addQuery(newQuery).unwrap();

                toast.success("Query has been created successfully.!");
            }
            refetch();
            setProjectQueryTitle("");
            setEditQueryId(null);
            setActiveMenu(null);
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Delete PlayWrightQuery
    const onQueryDeleteHandler = async (id: string) => {
        if (window.confirm(`Are you sure you want to delete this query`)) {
            try {
                await deletePlayWrightQuery(id).unwrap();

                refetch();

                toast.success("Query was successfully deleted.");
            } catch (error) {
                toast.error("Problem with deleting this query")
            }
        }
        setActiveMenu(null);
    }

    // Share project
    const onSelectShare = (id: string) => {
        console.log("Share project:", id);
        setActiveMenu(null);
    }

    const EllipsisEdit = [
        {
            name: "Edit", icon: ChevronDown, color: "#6366f1", action: (q: any) => onSelectQueryEditHandler(q)
        },
        {
            name: "Delete", icon: Trash2Icon, color: "#6366f1", action: (q: any) => onQueryDeleteHandler(q.id)
        },
        {
            name: "Share", icon: MailsIcon, color: "#6366f1", action: (q: any) => onSelectShare(q.id)
        }
    ]

    // when user click outside the ellipsis, the window closes
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Recent queries</h2>

            <div className="bg-white rounded-2xl divide-y max-h-[300px] overflow-y-auto scroll-smooth cursor-pointer">
                {data?.map((q, i) => (

                    <div key={i}
                         className="flex justify-between p-4 text-sm text-gray-700 hover:bg-gray-200 rounded ease-in-out transition duration-700 font-sans"
                    >
                        <div onClick={() => {
                            const route =
                                q.singleTabular === "single-query-review"
                                    ? `/single-query-review/${q.id}`
                                    : q.singleTabular === "single-search"
                                        ? `/playWrightQuery/chatItem/${q.id}`
                                        : `/tabular-review/${q.id}`;

                            navigate(route);
                        }}>
                            {/* LEFT SIDE */}
                            <div className="flex flex-col">
                                <span className="font-medium">{q.projectQueryTitle}</span>
                                <span className="text-xs text-gray-500">
                                {new Date(q.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}
                            </span>
                            </div>

                        </div>


                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 relative">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {q.singleTabular}
                            </span>

                            <span>{userInfo?.email}</span>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(prev => prev === q.id ? null : q.id)
                                }}
                            >
                                <EllipsisIcon size={20}
                                              className={"relative text-gray-800 hover:bg-gray-400 rounded-md mx-2 transition-colors mb-2"}/>
                            </button>

                            {/* Edit Query Window */}
                            {activeMenu === q.id && (
                                <div className={"absolute right-0 top-full mt-2 z-30"}>
                                    <div
                                        ref={dropdownRef}
                                        className={"bg-gray-400 w-96 rounded-2xl shadow-xl p-1 w-48 cursor-pointer hover:bg-gray-300 transition-colors max-w-fit"}>

                                        {EllipsisEdit.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                onClick={() => item.action(q)}
                                                className="flex items-center p-4 text-md text-white font-medium rounded-lg hover:bg-gray-200 transition-colors mb-2"
                                            >
                                                <item.icon size={20} style={{color: item.color, minWidth: "20px"}}/>
                                                <AnimatePresence>
                                                    {activeMenu === q.id && (
                                                        <motion.span
                                                            key={index}
                                                            className="ml-4 whitespace-nowrap"
                                                            initial={{opacity: 0, width: 0}}
                                                            animate={{opacity: 1, width: "auto"}}
                                                            exit={{opacity: 0, width: 0}}
                                                            transition={{duration: 0.5, delay: 0.3}}
                                                        >
                                                            {item.name}
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>

                                </div>)}

                            {openQuery && (
                                <div className="fixed top-10 left-60 z-40">
                                    <div className={"bg-white rounded-2xl shadow-xl p-4 w-[350px]"}>
                                        <form className={"space-y-4"}
                                              onSubmit={onCreateQueryTitleHandler}>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Query Name:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={projectQueryTitle}
                                                    placeholder={""}
                                                    className={"mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"}
                                                    onChange={(e) => setProjectQueryTitle(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenQuery(false)}
                                                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 rounded-lg bg-purple-400 text-white hover:bg-purple-800"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isPlayWrightError && (
                <>
                    <span className="px-2 text-red-500 text-sm">Error Loading queries</span>
                </>
            )}
        </div>
    );
}

// ================= Files Table =================
export function FilesTable() {

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

// ================= Excel List Table =================
export function ExcelListTable() {

    const {id} = useParams();

    const [tableContext, setTableContext] = useState<{
        sheetId: string | null;
        tableName: string | null;
    }>({
        sheetId: null,
        tableName: null
    });

    const {
        data: excelFiles = [],
        isError: isExcelError,
        refetch,
    } = useFetchExcelFilesQuery(id);

    // Fetch Columns
    const {
        data: columnIndex = [],
        isLoading: isColumnLoading,
        refetch: columnRefetch,
    } = useGetColumnsBySheetIdQuery(tableContext.sheetId!, {
        skip: !tableContext.sheetId
    });

    // Fetch Rows
    const {
        data: rowIndex = [],
        isLoading: isRowLoading,
    } = useGetRowsBySheetIdQuery(tableContext.sheetId!, {
        skip: !tableContext.sheetId
    })

    const [searchTerms, setSearchTerm] = React.useState("");
    const filterByExcelFileName = excelFiles?.filter((item: any) => item.tableName.toLowerCase().includes(
        searchTerms.toLowerCase()
    ));

    const [deleteExcelFile] = useDeleteExcelIngestedFilesMutation();
    const [deleteCell] = useDeleteCellMutation();
    const [bulkUpdateCell] = useBulkUpdateCellMutation();
    const [updateCell] = useUpdateCellMutation();
    const [insertNewRow] = useInsertRowMutation();
    const [activeExcelMenu, setExcelActiveMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [selectedFile, setSelectedFile] = useState<any | null>(null);

    const onPreviewExcel = (file: any) => {

        setSelectedFile(file);

        setTableContext({
            sheetId: file.sheetId,
            tableName: file.tableName,
        });

        setSelectedRow(null);
    }

    const orderedColumns = useMemo(() => {

        return [...columnIndex].sort(
            (a, b) => a.columnIndex - b.columnIndex
        );

    }, [columnIndex]);

    // DeleteExcelFile
    const onDeleteExcelHandler = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this excel file?")) {

            try {
                await Promise.all([
                    deleteExcelFile(id).unwrap(),
                ]);

                refetch();
                toast.success("Excel deleted successfully");
            } catch (error) {
                toast.error("Problem deleting the excel file");
            }
        }
        setExcelActiveMenu(null);
    }

    const handleExcelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setExcelActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [numPages, setNumPages] = useState(null);

    const [gridColumns, setGridColumns] = useState<any[]>([]);
    const [gridRows, setGridRows] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const buildColumnHeaders = (columns: any[]) => {
        return [...columns]
            .sort((a, b) => a.columnIndex - b.columnIndex);
    };

    const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});

    const getColumnLetter = (index: number) => {
        let result = "";
        let i = index + 1;

        while (i > 0) {
            const rem = (i - 1) % 26;
            result = String.fromCharCode(65 + rem) + result;
            i = Math.floor((i - 1) / 26);
        }

        return result;
    };

    const buildColumnsFromSchema = (columns: any[]) => {
        return [...columns]
            .sort((a, b) => a.columnIndex - b.columnIndex)
            .map(col => ({
                headerName: col.columnName,
                field: col.ColumnName,
                editable: true,
                resizable: true,
                sortable: true,
                columnIndex: col.ColumnIndex,
            }));
    }

    const transformRows = (rows: any[]) => {

        return rows.map(row => {

            const values: Record<number, any> = {};

            row.cells.forEach((cell: any) => {

                values[cell.columnIndex] = cell;

            });

            return {
                ...row,
                values
            };
        });

    };
    // Resize ColumnWidth
    const startResize = (e: React.MouseEvent, columnIndex: number) => {
        const startX = e.clientX;
        const startWidth = columnWidths[columnIndex] || 150;

        const onMouseMove = (e: MouseEvent) => {
            const newWidth = startWidth + (e.clientX - startX);

            setColumnWidths(prev => ({
                ...prev,
                [columnIndex]: Math.max(80, newWidth)
            }));
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    useEffect(() => {
        if (!tableContext.sheetId) return;

        if (!columnIndex?.length || !rowIndex?.length) return;

        const cleanRows = rowIndex.filter(
            (row: any) => Array.isArray(row.cells) && row.cells.length > 0
        );

        const cols = buildColumnsFromSchema(columnIndex);
        const rows = transformRows(cleanRows);

        setGridColumns(prev => {
            if (JSON.stringify(prev) === JSON.stringify(cols)) return prev;
            return cols
        });

        setGridRows(prev => {
            if (JSON.stringify(prev) === JSON.stringify(cols)) return prev;
            return rows;
        });

        console.log("Row Index Data:", rowIndex)
        console.log("Column Index Data:", columnIndex)

    }, [tableContext.sheetId, columnIndex, rowIndex]);

    const handleCellChange = async (
        rowIndex: number,
        columnIndex: number,
        value: string
    ) => {
        if (!tableContext.sheetId) {
            toast.error("No sheet selected");
            return;
        }
        const payload = {
            sheetId: tableContext.sheetId,
            rowIndex,
            columnIndex,
            value
        };

        console.log("Sending Payload", payload);

        try {
            await updateCell(payload).unwrap();
            refetch();


        } catch (error: any) {
            toast.error(error?.data?.message || "Update failed");
        }
    };


    return (
        <main>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-medium mb-3">Excel Files</h2>

                    <div className={"flex flex-row gap-2"}>
                        <SearchIcon className={"my-2 relative left-10"} color={"gray"} size={24}/>
                        <input
                            type='text'
                            onChange={handleExcelSearch}
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
                            {filterByExcelFileName?.map((file: any, i: number) => (
                                <tr key={i} className="border-t hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onPreviewExcel(file)}>

                                    <td className="p-3 flex items-center gap-2">
                                        {file.type === "Folder" ? (
                                            <Folder size={16}/>
                                        ) : (
                                            <FileText size={16}/>
                                        )}
                                        {file.tableName}
                                    </td>
                                    <td className="p-3">Excel</td>
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
                                                setExcelActiveMenu(prev => prev === file.id ? null : file.id)
                                            }}
                                        >
                                            <EllipsisIcon size={20}
                                                          className={"relative right-2 text-gray-800 hover:bg-gray-400 rounded-md mx-2 transition-colors mb-2"}/>
                                        </button>
                                    </td>
                                    {/* Edit Query Window */}
                                    {activeExcelMenu === file.id && (
                                        <div className="mt-4 z-40 bg-gray-500 rounded-lg shadow p-2">
                                            <button
                                                onClick={() => onDeleteExcelHandler(file.id)}
                                                className="flex items-center gap-2 p-2 hover:bg-gray-300 rounded-md w-full"
                                            >
                                                <Trash2Icon size={20} color="blue"/>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </tr>

                            ))}

                            {isExcelError && (
                                <>
                                    <span className="px-2 text-red-500 text-sm">Error Loading Exel File</span>
                                </>
                            )}

                            </tbody>
                        </table>

                    </div>

                    {selectedFile && (
                        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">

                            {/* PANEL */}
                            <div className="w-full h-full bg-white shadow-xl flex flex-col">

                                <div className="flex justify-between items-center border-b p-4 bg-white">

                                    <h2 className="text-xl font-semibold">
                                        {tableContext.tableName}
                                    </h2>

                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                                    >
                                        X
                                    </button>

                                </div>


                                {/* Excel PREVIEW */}
                                <table
                                    className="border-collapse rounded-2xlu w-full scroll-m-2 table-fixed text-sm border-gray-600 border-2">

                                    {/* HEADER */}
                                    <thead>
                                    <tr className={"bg-blue-400 sticky top-0 z-30"}>
                                        <th className={"border w-12 sticky left-0 bg-blue-300 z-40"}></th>

                                        {orderedColumns.map((item: any) => (
                                            <th
                                                key={item.columnIndex}
                                                style={{width: columnWidths[item.columnIndex] || 150}}
                                                className={"border px-2 py-1 text-center font-semibold text-gray-700 hover:bg-blue-300"}
                                            >
                                                {getColumnLetter(item.columnIndex)}

                                            </th>

                                        ))}
                                    </tr>

                                    <tr className="bg-blue-300 sticky top-[32px] z-20 ">

                                        <th className="border px-2 py-1 w-12 text-blue-900 sticky left-0 bg-blue-300 z-30">#</th>

                                        {orderedColumns.map((col) => (
                                            <th key={col.columnIndex}
                                                className="border px-2 py-2 font-semibold text-blue-900 relative">
                                                {col.columnName}

                                                <div className={"absolute right-0 top-0 h-full cursor-col-resize bg-blue-300 hover:bg-blue-600"}
                                                     onMouseDown={(e) => startResize(e, col.columnIndex)}
                                                />


                                            </th>
                                        ))}


                                    </tr>
                                    </thead>

                                    {/* BODY */}
                                    <tbody className="cursor-pointer hover:transition duration-200">
                                    {rowIndex.map((row: any) => (
                                        <tr key={row.rowIndex}
                                            onClick={() => setSelectedRow(row)}
                                            className={`cursor-pointer ${
                                                selectedRow?.rowIndex === row.rowIndex
                                                    ? "bg-gray-200"
                                                    : "hover:bg-gray-300 bg-gray-100"
                                            }`}
                                        >

                                            {/* Row Index */}
                                            <td className="border px-2 text-center text-black sticky left-0 bg-white z-10 cursor-pointer">
                                                {row.rowIndex + 1}
                                            </td>

                                            {orderedColumns.map((col) => {
                                                const cell = row.cells?.find(
                                                    (c: any) => c.columnIndex === col.columnIndex
                                                );

                                                return (
                                                    <td key={col.columnIndex}
                                                        style={{width: columnWidths[col.columnIndex] || 150}}
                                                        className={"border px-1 text-black"}>

                                                        <input
                                                            className="w-full bg-transparent outline-none"
                                                            value={cell?.value ?? ""}
                                                            onChange={(e) =>
                                                                handleCellChange(
                                                                    row.rowIndex,
                                                                    col.columnIndex,
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    )}

                </div>
            </div>


        </main>
    )
}


// ================= Main DashBoard =================
export function PlayWrightQueryDashboard() {

    const textRef = useRef<HTMLHeadingElement>(null);
    const {userInfo} = useSelector((state: any) => state.auth);
    const [inputValue, setInputValue] = useState("");

    const {id} = useParams();
    const projectId = String(id);
    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId);

    const {
        data: playWrightQuery,
        isLoading: isPlayWrightLoading,
        isError: isPlayWrightError,
        refetch,
    } = useGetPlayWrightQueryListQuery(projectId);

    const [showSlideIn, setShowSlideIn] = useState(false);

    useEffect(() => {
        setShowSlideIn(true);
    }, []);


    const onSubmitHandler = (message: string) => {
        console.log("message", message);
        setInputValue("");
    }

    const [tabularOrSingleQuery, setTabularOrSingleQuery] =
        useState<"tabular-review" | "single-query-review" | "single-search">(
            "tabular-review"
        );

    // @ts-ignore
    // @ts-ignore
    return (
        <main>
            <div className="flex h-screen font-sans">

                {/*================= SideBar ================= */}
                <SideBar/>

                <div className="flex-1 p-6 overflow-y-auto">

                    {/*================= Header ================= */}
                    <div className="flex flex-1 items-center py-1 cursor-pointer hover:bg-gray-200 rounded-lg w-56">
                        <NavLink
                            to="/playbookProject"
                            className="flex items-center gap-4 text-gray-700 font-sans"
                        >
                            <ArrowLeftFromLine size={20} />
                            <span>PlayWright Project /</span>
                        </NavLink>
                    </div>

                    <div className="flex justify-between items-center mb-6">

                        <div>
                            <h1 className="text-2xl font-semibold">{projectData?.projectName || "Project Not Found"}</h1>
                            <p className="text-sm text-gray-500">
                                {playWrightQuery?.length ?? "None:"} Total Queries
                            </p>
                        </div>

                        <button className="flex items-center gap-2 border px-3 py-2 rounded-xl">
                            <Share2 size={16} /> Share
                        </button>
                    </div>

                    {/*================= ChatInput ================= */}
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="flex-col items-center w-full max-w-4xl relative px-0 xl:px-8">

                                {/*Header & UserName*/}
                                <div className={`flex flex-row transform transition-all duration-1000 ease-out ${showSlideIn ? "translate-x-0 opacity-100" : "translate-x-full opacity-0" } gap-x-4 items-center justify-center mb-1 space-y-1`}>
                                    <img
                                        alt=""
                                        src={assets.mori_solution_logo2}
                                        className="h-12 w-12 rounded-3xl shadow-md"
                                    />

                                    <h1
                                        ref={textRef}
                                        className="text-4xl font-serif font-light text-gray-900 text-center "
                                    >
                                        Hello, {userInfo?.userName?.split(' ')[0]}
                                    </h1>
                                </div>

                                {/* Chat Input */}
                                <PlayWrightChatInput
                                    onSend={onSubmitHandler}
                                    value={inputValue}
                                    onChange={setInputValue}
                                    onQueryTypeChange={setTabularOrSingleQuery}
                                />

                                <div className="text-center">
                                    <p className="text-sm py-3 mb-3 text-gray-500">
                                        AI can make mistakes. Answers are for the purpose of construction compliance.
                                    </p>
                                </div>
                            </div>

                    </div>
                    {/*================= Recent Query ================= */}
                    <RecentQueries data={playWrightQuery} refetch={refetch}
                                   tabularOrSingleQuery={tabularOrSingleQuery}
                                   isPlayWrightError={isPlayWrightError} />

                    {isPlayWrightLoading && (
                        <>
                            <div className="flex space-x-2 gap-x-1 justify-center items-center bg-white">
                                <span className="sr-only text-black">Loading...</span>
                                <div
                                    className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div
                                    className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-1 w-1 bg-blue-600 rounded-full animate-bounce"></div>
                            </div>
                        </>
                    )}

                    {/*================= Ingested PDF Files ================= */}
                    <FilesTable  />

                    {/*================= Ingested Excel Files ================= */}
                    <div className={"gap-y-2 p-2 mx-auto"}>
                        <ExcelListTable />
                    </div>

                </div>
            </div>
        </main>
    )
}


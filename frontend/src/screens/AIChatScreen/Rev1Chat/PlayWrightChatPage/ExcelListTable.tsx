import {useParams} from "react-router-dom";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    useDeleteExcelIngestedFilesMutation,
    useFetchExcelFilesQuery,
    useGetColumnsBySheetIdQuery,
    useGetRowsBySheetIdQuery
} from "../../../../features/chatapiSlice";
import {
    useBulkUpdateCellMutation,
    useDeleteCellMutation,
    useInsertRowMutation,
    useUpdateCellMutation
} from "../../../../features/excelapiSlice";
import {toast} from "react-toastify";
import {EllipsisIcon, FileText, Folder, SearchIcon, Trash2Icon} from "lucide-react";

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
  //  const [deleteCell] = useDeleteCellMutation();
  //  const [bulkUpdateCell] = useBulkUpdateCellMutation();
    const [updateCell] = useUpdateCellMutation();
  //  const [insertNewRow] = useInsertRowMutation();
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
                                <div className={"flex-1 overflow-auto"}>

                                    <table
                                        className="border-collapse rounded-2xl min-w-max text-sm border-gray-600 border-2">

                                        {/* HEADER */}
                                        <thead>
                                        <tr className={"bg-blue-600 sticky top-0 z-30"}>
                                            <th className={"border w-12 sticky left-0 bg-blue-600 z-40"}></th>

                                            {orderedColumns.map((item: any) => (
                                                <th
                                                    key={item.columnIndex}
                                                    style={{width: columnWidths[item.columnIndex] || 150}}
                                                    className={"border px-2 py-1 text-center font-semibold text-white hover:bg-blue-200"}
                                                >
                                                    {getColumnLetter(item.columnIndex)}

                                                </th>

                                            ))}
                                        </tr>

                                        <tr className="bg-blue-400 sticky top-[32px] z-20 ">

                                            <th className="border px-2 py-1 w-12 text-blue-900 sticky left-0 bg-blue-400 z-30">#</th>

                                            {orderedColumns.map((col) => (
                                                <th key={col.columnIndex}
                                                    className="border px-2 py-2 font-semibold text-black hover:bg-blue-200 relative">
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
                        </div>
                    )}

                </div>
            </div>


        </main>
    )
}
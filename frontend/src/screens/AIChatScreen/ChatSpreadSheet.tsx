import React, {useState, useEffect} from "react";
import CustomLoaderSmall from "../../components/Layout/CustomLoaderSmall";
import ChatSideBar from "../../components/Layout/Graph & Tables/ChatSideBar";
import {AnimatePresence, motion} from "framer-motion";
import {toast} from "react-toastify";
import {Helmet} from "react-helmet";
import ChatInput from "./ChatInput";
import {
    useGetExcelIngestedFilesQuery,
    useSendAIExcelMessageMutation,
    useUpdateExcelCellMutation,
    useGetColumnsBySheetIdQuery,
    useGetRowsBySheetIdQuery
} from "../../features/chatapiSlice";
import {
    useBulkUpdateCellMutation,
    useDeleteCellMutation,
    useInsertRowMutation,
    useUpdateCellMutation
} from "../../features/excelapiSlice"
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    FileEditIcon,
    BookPlusIcon,
    BetweenHorizonalStartIcon,
    MessageCircle,
    Trash2Icon,
    DownloadIcon
} from "lucide-react";

import {useAzureTextToSpeech} from "../../screens/AIChatScreen/useAzureTextToSpeech";
import {sanitizeTextForTTS} from "../../screens/AIChatScreen/sanitizeTextForTTS";
import ExcelMessageList from "../../screens/AIChatScreen/ExcelMessageList";

export function ChatSpreadSheet() {

    const [tableContext, setTableContext] = useState<{
        sheetId: string | null;
        tableName: string | null;
    }>({
        sheetId: null,
        tableName: null
    });

    const [gridColumns, setGridColumns] = useState<any[]>([]);
    const [gridRows, setGridRows] = useState<any[]>([]);
    const {userInfo} = useSelector((state: any) => state.auth);

    const [messages, setMessages] = useState<any[]>([]);
    const [inProgressMessage, setInProgressMessage] = useState<any>(null);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [selectedTableName, setSelectedTableName] = useState<string | null>(null);
    const [selectedModelId, setSelectedModelId] = useState("tabular data-ai");
    const [isDocumentMode, setIsDocumentMode] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Use Azure Speech Service with sanitize Asterisk in conversation BOT
    const {
        speak: speakSpeech,
        stopSpeech: stopTheSpeech,
        resumeSpeech,
        pauseSpeech,
        isPaused,
        isPlaying
    } = useAzureTextToSpeech();

    const handleAssistantAzureMessageHandler = (text: string) => {
        if (!text?.trim()) return;

        const cleanText = sanitizeTextForTTS(text);

        speakSpeech(cleanText);
    }

    // Confirm if the user exists
    const requireAuth = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }
        callback();
    }

    const [openExcelEditor, setOpenExcelEditor] = useState<boolean>(false);
    const [openChatOverlay, setOpenChatOverlay] = useState<boolean>(false);
    const [sendAIExcelMessage] = useSendAIExcelMessageMutation();

    // ExcelTable List collection
    const {
        data: excelTables = [],
        isLoading: isExcelTableLoading,
        isError: isExcelTableError,
    } = useGetExcelIngestedFilesQuery({});

    // Fetch Columns
    const {
        data: columnIndex = [],
        isLoading: isColumnLoading,
        refetch
    } = useGetColumnsBySheetIdQuery(tableContext.sheetId!, {
        skip: !tableContext.sheetId
    });

    // Fetch Rows
    const {
        data: rowIndex = [],
        isLoading: isRowLoading,
    } = useGetRowsBySheetIdQuery(tableContext.sheetId!, {
        skip: !tableContext.sheetId
    });

    const [deleteCell] = useDeleteCellMutation();
    const [bulkUpdateCell] = useBulkUpdateCellMutation();
    const [updateCell] = useUpdateCellMutation();
    const [insertNewRow] = useInsertRowMutation();
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});

    const handleEditRow = (row: any) => {
        setEditingRow(row.rowIndex);
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
        if (!Array.isArray(rows)) {
            return [];
        }

        return rows.map((row: any) => {
            const obj: any = {};

            if (!row || !Array.isArray(row.cells)) {
                return obj;
            }

            rows?.cells?.forEach((cell: any) => {
                if (!cell) return;

                obj[cell.columnName] = cell.value;
            });

            return obj;
        })
    }

    const buildColumnHeaders = (columns: any[]) => {
        return [...columns]
            .sort((a, b) => a.columnIndex - b.columnIndex);
    };

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

    const buildInsertValues = (row: any) => {
        const values: Record<number, string> = {};

        row.cells.forEach((cell: any) => {
            values[cell.columnName] = cell.value ?? "";
        })

        return values;
    }

    const onhandleInsertRow = async (row: any) => {
        if (!tableContext.sheetId) {
            toast.error("No sheet selected");
            return;
        }
        const values = buildInsertValues(row);

        try {
            await insertNewRow({
                sheetId: tableContext.sheetId,
                values
            }).unwrap();

            refetch();

            toast.success("Row inserted");

        } catch (error) {
            toast.error("Inserting new row has failed")
        }
    }

    const onHandleExcelDeleteRow = async (row: any) => {
        try {
            for (const cell of row.cells) {
                await deleteCell({
                    sheetId: tableContext.sheetId,
                    rowIndex: row.rowIndex,
                    columnIndex: cell.columnIndex,
                }).unwrap();
            }
            toast.success("Row has been deleted.");
        } catch (error) {
            toast.error("Deleting row faild")
        }
    };

    const onHandleExcelBulkUpdateRow = async (row: any) => {
        if (!tableContext.sheetId) {
            toast.error("No row or column index was found");
            return;
        }

        try {

            const updates = row.cells.map((cell: any) => ({
                rowIndex: row.rowIndex,
                columnIndex: cell.columnIndex,
                value: cell.value
            }));

            await bulkUpdateCell({
                sheetId: tableContext.sheetId,
                updates: updates,
            }).unwrap();
            toast.success("Row has been updated.");

        } catch (error) {
            toast.error("Bulk update row failed.");
        }

    }

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

    const handleExcelDataMessageHandler = async (snippet: string) => {
        if (!snippet.trim()) return;

        if (!tableContext.sheetId) {
            toast.warning("Please select an Excel Table first.")
            return;
        }

        const userMessage = {
            role: "user",
            messageContent: snippet,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInProgressMessage({role: "assistant", messageContent: "..."});

        const payload = {
            sheetId: tableContext.sheetId,
            question: snippet,
            chatSession: {
                sessionId: tableContext.sheetId,
                title: selectedTableName ?? "Excel Dataset",
                messages: [userMessage],
            },
        };

        try {
            const response: any = await sendAIExcelMessage(payload).unwrap();

            console.log("📄 Full Tabular AI Response:", response);
            console.log("🔗 Sources:", response.sources);

            if (response?.messageContent) {
                const assistantMessage = {
                    sessionId: tableContext.sheetId,
                    role: "assistant",
                    messageContent: response.messageContent,
                    createdAt: response.createdAt,
                    // sources: response.sources,
                };
                setMessages((prev) => [...prev, assistantMessage]);
                //   setSources(response.sources);
            }
        } catch (err) {
            console.error("❌ Error sending excel AI message:", err);
        } finally {
            setInProgressMessage(null);
        }
    }

    const onDownloadhander =  () => {

    }

    const handleAISendBasedOnModel = async (text: string) => {

        switch (selectedModelId) {

            case "tabular data-ai":
                await handleExcelDataMessageHandler(`${text}`);
                break;

            default:
                await handleExcelDataMessageHandler(text);
                break;
        }
    }

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

    // Excel Edit RowList
    const ExcelEditIcons = [
        {name: "InsertRow", icon: BetweenHorizonalStartIcon, color: "#968686", action: (row: any) => onhandleInsertRow(row)},
        {name: "Edit", icon: FileEditIcon, color: "#968686", action: (row: any) => handleEditRow(row)},
        {name: "Delete", icon: Trash2Icon, color: "#968686", action: (row: any) => onHandleExcelDeleteRow(row)},
        {name: "Download",icon: DownloadIcon, color: "#968686", action: () => onDownloadhander},
        {
            name: "UpdateBulk",
            icon: BookPlusIcon,
            color: "#968686",
            action: (row: any) => onHandleExcelBulkUpdateRow(row)
        },
    ]

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

    // ✅ Handles toggle change
    const handleSwitch = (enabled: boolean) => {
        setIsDocumentMode(enabled);
    };

    return (
        <main>
            <Helmet>
                <title>AI Spreadsheet</title>
                <meta name="spreadsheet" content="Spreadsheet"/>
            </Helmet>

            {isExcelTableLoading ? (
                <div className={"items-start justify-items-start py-20"}>
                    <CustomLoaderSmall/>
                </div>
            ) : (
                <motion.div
                    initial={{opacity: 0, y: 60}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                >
                    {/*Keep the h-screen to show the chat input. Do not change*/}
                    <div className={"bg-[#f7f7f7] h-screen text-white font-sans flex"}>
                        <ChatSideBar/>

                        {/*Header*/}
                        <div className={"flex-1 flex flex-col min-w-1"}>
                            <div
                                className={"h-14 border-b border-border px-4 my-2 flex items-center justify-between flex-shrink-0"}>
                                <div className={"flex flex-1 justify-items-start mx-1 px-2 gap-x-4"}>
                                    <div className={"flex items-center gap-2 mt-2"}>
                                        <label className={"text-sm font-medium text-gray-800"}>
                                            Select Table
                                        </label>

                                        <select
                                            className={"border rounded-md px-2 py-2 text-md bg-gray-500 min-w-[220px]"}
                                            value={tableContext.sheetId ?? ""}
                                            onChange={(e) => {
                                                const sheetId = e.target.value;
                                                const table = excelTables.find((t: any) => t.sheetId === sheetId);

                                                setTableContext(({
                                                    sheetId,
                                                    tableName: table?.tableName ?? null,
                                                }))
                                            }}>
                                            <option value={""} disabled>
                                                Select Table
                                            </option>

                                            {isExcelTableLoading && (
                                                <option disabled>Loading Tables...</option>
                                            )}

                                            {isExcelTableError && (
                                                <option disabled>Error with table...</option>
                                            )}

                                            {excelTables.map((table: any) => (
                                                <option key={table.sheetId} value={table.sheetId}>

                                                    📄 {table.tableName}
                                                </option>
                                            ))}
                                        </select>

                                        {!tableContext.sheetId && (
                                            <span className={"text-sm text-gray-700"}>
                                                    <strong>Please select a table to begin</strong>
                                                </span>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* TableGrid*/}
                            {tableContext.sheetId && (
                                <div className={"flex-1 p-2"}>
                                    {isColumnLoading || isRowLoading ? (
                                            <CustomLoaderSmall/>
                                        ) :
                                        (
                                            <div className="flex-1 overflow-auto p-1">
                                                <div
                                                    className={"flex gap-2 mb-3 p-1 bg-white border rounded-md shadow-sm"}>
                                                    {ExcelEditIcons.map((item, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={
                                                                () => {
                                                                    if (!selectedRow) {
                                                                        toast.warning("Select a row first")
                                                                        return;
                                                                    }
                                                                    item.action(selectedRow);
                                                                }}
                                                            disabled={!selectedRow}
                                                            className={"flex items-center text-black gap-2 px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded" +
                                                                `${!selectedRow ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
                                                        >
                                                            <item.icon size={18}/>
                                                            <span>{item.name}</span>
                                                        </button>
                                                    ))}
                                                </div>


                                                <table
                                                    className="border-collapse w-full table-fixed text-sm border-gray-600 border-2">

                                                    {/* HEADER */}
                                                    <thead>
                                                    <tr className={"bg-blue-400 sticky top-0 z-30"}>
                                                        <th className={"border w-12 sticky left-0 bg-blue-300 z-40"}></th>

                                                        {buildColumnHeaders(columnIndex).map((item: any) => (
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

                                                        {buildColumnHeaders(columnIndex).map((col) => (
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

                                                            {buildColumnHeaders(columnIndex).map((col) => {
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
                                                {/* Chat Overlay */}
                                                {/* Floating Chat Button */}
                                                <div className="fixed bottom-6 right-6 z-40">
                                                    <button
                                                        onClick={() => setOpenChatOverlay(true)}
                                                        className="bg-white rounded-full p-4 shadow-xl hover:scale-125 transition"
                                                    >
                                                        <MessageCircle size={28} className="text-pink-800"/>
                                                    </button>

                                                    {openChatOverlay && (
                                                        <>
                                                            {/* BACKDROP */}
                                                            <div
                                                                onClick={() => setOpenChatOverlay(false)}
                                                                className="fixed inset-0 bg-black/40 z-50"
                                                            />

                                                            {/* CHAT PANEL */}
                                                            <div
                                                                className="
                                                                            fixed bottom-6 right-6
                                                                            w-[460px] h-[700px]
                                                                            bg-white rounded-2xl shadow-2xl
                                                                            z-50 flex flex-col
                                                                            border
                                                                    "
                                                            >
                                                                {/* Header */}
                                                                <div
                                                                    className="flex justify-between items-center p-3 border-b">
                                                                    <h2 className="text-sm font-semibold text-gray-700">
                                                                        Tabular Data Chat
                                                                    </h2>

                                                                    <button
                                                                        onClick={() => setOpenChatOverlay(false)}
                                                                        className="text-gray-500 hover:text-gray-800"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>

                                                                {/* Messages */}
                                                                <div className="flex-1 overflow-y-auto p-3">
                                                                    <ExcelMessageList
                                                                        messages={messages}
                                                                        inProgressMessage={inProgressMessage}
                                                                        showSources={false}
                                                                        noMessagesContent="Ask about your spreadsheet..."
                                                                        onSpeakHandler={handleAssistantAzureMessageHandler}
                                                                        onPause={pauseSpeech}
                                                                        onStop={stopTheSpeech}
                                                                        onResume={resumeSpeech}
                                                                        isPlaying={isPlaying}
                                                                        isPaused={isPaused}
                                                                    />
                                                                </div>

                                                                {/*Chat Input */}
                                                                <div className="p-3 border-t">
                                                                    <ChatInput
                                                                        onSend={(text: string) => handleAISendBasedOnModel(text)}
                                                                        disabled={isExcelTableLoading}
                                                                        value={inputValue}
                                                                        onChange={setInputValue}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}s
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

        </main>
    )
}
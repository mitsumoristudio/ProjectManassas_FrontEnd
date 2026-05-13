import React, {useEffect, useState, useRef} from "react";
import {
    Search,
    Folder,
    FileText,
    Clock,
    Plus,
    Share2,
    MoreHorizontal,
    Users,
    Database,
    Filter,
    Columns,
    Download,
    Settings,
    ArrowLeftFromLine
} from "lucide-react"
import SideBar from "../../../components/Layout/Graph & Tables/SideBar";
import {assets} from "../../../assets/assets";
import {useSelector, useDispatch, } from "react-redux";
import {useParams, useNavigate, NavLink} from "react-router-dom";
import {
    useGetPlayWrightProjectbyIdQuery,
    useGetPlayWrightQuerybyIdQuery, useGetPlayWrightQueryListQuery,
} from "../../../features/playwrightApiSlice";

// ================= Sidebar =================

// ================= Top Toolbar =================
function DataToolbar() {
    return (
        <div className="flex items-center justify-between border-b px-4 py-2 bg-white">
            <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1"><Search size={14}/> Ask Mori</button>
                <button className="flex items-center gap-1"><Filter size={14}/> Filter</button>
                <button className="flex items-center gap-1"><Columns size={14}/> Manage columns</button>
            </div>

            <div className="flex items-center gap-3">
                <button className="border px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Share2 size={14}/> Share</button>
                <button className="border px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Download size={14}/> Export</button>
            </div>
        </div>
    );
}

// ================= Table - Mock Data =================
function DataTable({rows}) {


    return(
        <>
            <div className="overflow-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b">
                    <tr>
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Change of Control Provision</th>
                        <th className="p-2 text-left">Party(ies) Restricted</th>
                        <th className="p-2 text-left">Definition</th>
                        <th className="p-2 text-left">Trigger</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="p-2">{i + 1}</td>
                            <td className="p-2 flex items-center gap-2">
                                <FileText size={14}/> {r.name}
                            </td>
                            <td className="p-2">{r.provision}</td>
                            <td className="p-2">{r.party}</td>
                            <td className="p-2 truncate max-w-xs">{r.definition}</td>
                            <td className="p-2 truncate max-w-xs">{r.trigger}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
        )

}

// ================= Table =================

function PlayWrightTable({rows}) {
    const [selectedClause, setSelectedClause] = useState(null);

    const { id } = useParams();

    const getClause = (clauses, key) => {
        return clauses.find((c) => c.clauseKey === key);
    };

    // 🔑 central config (no more hardcoding columns everywhere)
    const columnsAnalyst = [
        { key: "change_of_control_provision", label: "Change of Control Provision" },
        { key: "scope_of_work", label: "Scope Of Work" },
        { key: "indemnification", label: "Indemnification" },
        { key: "timeline", label: "TimeLine" },
        { key: "change_order", label: "Change Order" },
        { key: "liability", label: "Liability" },
        { key: "warranties", label: "Warranties" },
        { key: "parties_involved", label: "Parties Involved" },
        { key: "red_flag", label: "Red Flags" },
        { key: "termination_conditions", label: "Termination Condition" },
        { key: "payment_terms", label: "Payment Terms" },
    ];

    // ✅ reusable cell (this is the key part)
    const ClauseCell = ({ clause }) => (
        <td className="p-2 align-top">
            <div className="h-28 overflow-hidden line-clamp-4 text-sm leading-snug"
                onClick={() => setSelectedClause(clause)}>
                {clause?.summaryShort || "-"}
            </div>
        </td>
    );

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-max table-fixed border-separate border-spacing-y-2 text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b text-gray-700 border-r">
                <tr className={"bg-white border-b border-gray-200 border-r border-gray-200 hover"}>
                    <th className="p-2 text-left whitespace-nowrap w-10">#</th>
                    <th className="p-2 text-left whitespace-nowrap w-48">File Name</th>
                    <th className="p-2 text-left whitespace-nowrap w-48">Prompt</th>

                    {columnsAnalyst.map((col) => (
                        <th key={col.key} className="p-2 text-left w-56 whitespace-nowrap">
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {rows?.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-gray-300 duration-700 rounded-xl cursor-pointer">
                        <td className="p-2">{i + 1}</td>

                        <td className="p-1 flex items-center gap-2">
                            <FileText size={14} />
                            {r.originalFileName}
                        </td>

                        <td className={"p-1"}>{r.projectQueryTitle}</td>

                        {columnsAnalyst.map((col) => {
                            const clause = getClause(r.clauses, col.key);

                            return (
                                <ClauseCell
                                    key={col.key}
                                    clause={clause}
                                />
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedClause && (
                <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl opacity-95 border-l z-50 transform transition-transform duration-300 ${
                    selectedClause ? "translate-x-0" : "translate-x-full"
                }`}>

                    {/* Header */}
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold text-lg">
                            {selectedClause.clauseName}
                        </h2>
                        <button
                            onClick={() => setSelectedClause(null)}
                            className="text-gray-600 hover:text-black"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto">
                        <h2 className={"font-semibold font-serif text-2xl py-2 text-black"}>Short:</h2>
                        <p className="text-sm leading-relaxed">
                            {selectedClause.summaryShort}
                        </p>

                        <h2 className={"font-semibold font-serif text-2xl py-2 text-black"}>Long:</h2>
                        <p className="text-sm leading-relaxed">
                            {selectedClause.summaryLong}
                        </p>

                        <p className="font-semibold font-serif text-xl py-2 text-black capitalize">
                            <strong className={"gap-x-1"}>Risk:</strong> {selectedClause.riskLevel}
                        </p>

                        <p className="font-medium font-serif text-xl py-2 text-black ">
                            <strong className={"gap-x-1"}>Source Page:</strong> {selectedClause.sourcePage}
                        </p>

                    </div>
                </div>
            )}

        </div>
    );
}

// ================= Page =================
export default function PlaybookTableScreen() {

    const {id} = useParams();

    const {playWrightQueryId} = useParams();

    const {data: queryData} = useGetPlayWrightQuerybyIdQuery<any>(id);

    const projectId = queryData?.playWrightProjectId;

    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId, {
        skip: !projectId,
    });

    const {data: playWrightQueryData} = useGetPlayWrightQueryListQuery<any>(playWrightQueryId);

    const rows = [
        {
            name: "Agilent Supply Agreement.pdf",
            provision: "Yes",
            party: "Supplier",
            definition: "Change of Control means acquisition...",
            trigger: "Acquisition or consolidation",
        },
        {
            name: "AIG License Agreement.pdf",
            provision: "No",
            party: "-",
            definition: "-",
            trigger: "-",
        },
        {
            name: "Alcoa License Agreement.pdf",
            provision: "Yes",
            party: "Both Parties",
            definition: "Change of Control shall have meaning...",
            trigger: "Merger or transfer",
        },
    ];

    return (
        <>
            <div className="flex h-screen bg-gray-50 font-sans">
                {/*================= SideBar ================= */}
                <SideBar/>

                <div className="flex-1 p-6 overflow-y-auto">

                    {/*================= Navigation Header ================= */}
                    <div className="flex flex-1 items-center py-1 cursor-pointer hover:bg-gray-200 rounded-lg w-56">
                        <NavLink
                            to={`/playbookProject/playWrightQuery/${projectId}}`}
                            className="flex items-center gap-4 text-gray-700 font-sans"
                        >
                            <ArrowLeftFromLine size={20} />
                            <span>PlayWright Query/</span>
                        </NavLink>
                    </div>

                    {/*================= Sub Header ================= */}
                    <div className="px-4 py-3 border-b bg-white">
                        <h1 className="text-2xl font-semibold">{projectData?.projectName || "Project Not Found"}</h1>
                    </div>
                    {/*================= Feature ================= */}
                    <div className="flex items-center justify-between border-b px-4 py-2 bg-white">
                        <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1"><Search size={14}/> Ask Mori</button>
                            <button className="flex items-center gap-1"><Filter size={14}/> Filter</button>
                            <button className="flex items-center gap-1"><Columns size={14}/> Manage columns</button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="border px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Share2 size={14}/> Share</button>
                            <button className="border px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Download size={14}/> Export</button>
                        </div>
                    </div>

                    <PlayWrightTable rows={playWrightQueryData} />

                    {/*<DataTable rows={rows} />*/}
                </div>
            </div>
        </>
    )
}
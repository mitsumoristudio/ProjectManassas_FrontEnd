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
   useGetPlayWrightQuerybyIdQuery,
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

// ================= Table =================
function DataTable({ rows }) {
    return (
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
    );
}

// ================= Page =================
export default function PlaybookTableScreen() {

    const {id} = useParams();
    const {keyword} = useParams();
    const projectId = String(id);
    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId);
    const {data: queryData} = useGetPlayWrightQuerybyIdQuery<any>(keyword);

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
                            to="/playbookProject"
                            className="flex items-center gap-4 text-gray-700 font-sans"
                        >
                            <ArrowLeftFromLine size={20} />
                            <span>PlayWright Query /</span>
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

                    <DataTable rows={rows} />
                </div>
            </div>
        </>
    )
}
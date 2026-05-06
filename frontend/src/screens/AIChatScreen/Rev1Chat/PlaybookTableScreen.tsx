import React from "react";
import { Search, Folder, FileText, Clock, Plus, Share2, MoreHorizontal, Users, Database, Filter, Columns, Download, Settings } from "lucide-react"

// ================= Sidebar =================
function Sidebar() {
    return (
        <aside className="w-16 bg-white border-r flex flex-col items-center py-4 gap-4">
            <div className="w-8 h-8 bg-gray-900 rounded-md" />
            <button className="p-2 hover:bg-gray-100 rounded-lg"><Plus size={16} /></button>
            <button className="p-2 bg-gray-100 rounded-lg"><Folder size={16} /></button>
            <button className="p-2 hover:bg-gray-100 rounded-lg"><Clock size={16} /></button>
        </aside>
    );
}

// ================= Top Toolbar =================
function DataToolbar() {
    return (
        <div className="flex items-center justify-between border-b px-4 py-2 bg-white">
            <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1"><Search size={14}/> Ask Harvey</button>
                <button className="flex items-center gap-1"><Filter size={14}/> Filter</button>
                <button className="flex items-center gap-1"><Columns size={14}/> Manage columns</button>
            </div>

            <div className="flex items-center gap-3">
                <button className="border px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Share2 size={14}/> Share</button>
                <button className="border px-3 py-1 rounded-lg text-sm">Open in Assistant</button>
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
            <div className="flex h-screen bg-gray-50">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <div className="px-4 py-3 border-b bg-white">
                        <h1 className="text-lg font-semibold">Analyze Change of Control Provisions</h1>
                    </div>

                    <DataToolbar />
                    <DataTable rows={rows} />
                </div>
            </div>
        </>
    )
}
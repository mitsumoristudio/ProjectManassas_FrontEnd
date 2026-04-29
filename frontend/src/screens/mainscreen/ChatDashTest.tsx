import { Search, Folder, FileText, Clock, Plus, Share2 } from "lucide-react";
import React from "react";

// ================= Sidebar =================
export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r p-4 flex flex-col gap-4">
            <div className="font-semibold text-lg">Whitford Lane</div>

            <button className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-xl">
                <Plus size={16} /> Create
            </button>

            <nav className="flex flex-col gap-2 text-sm">
                <div className="font-medium">Assistant</div>
                <div className="bg-gray-100 p-2 rounded-lg">Vault</div>
                <div className="text-gray-500">Statements (A&W)</div>
                <div className="text-gray-500">Delta Supply</div>
                <div className="text-gray-500">Supply Agreements</div>
            </nav>

            <div className="mt-auto flex flex-col gap-2 text-sm text-gray-500">
                <div>Workflows</div>
                <div>History</div>
                <div>Library</div>
                <div>Guidance</div>
            </div>
        </aside>
    );
}

// ================= Header =================
export function Header() {
    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-semibold">Commercial Contracts</h1>
                <p className="text-sm text-gray-500">
                    100,000 files (98.72GB) · 122 queries
                </p>
            </div>

            <button className="flex items-center gap-2 border px-3 py-2 rounded-xl">
                <Share2 size={16} /> Share
            </button>
        </div>
    );
}

// ================= Search Box =================
export function SearchBox() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
                <Search size={18} className="text-gray-400" />
                <input
                    className="flex-1 outline-none"
                    placeholder="Ask Harvey anything..."
                />
            </div>

            <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm">
                    Create a draft document
                </button>
                <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm">
                    Create a review table
                </button>
            </div>
        </div>
    );
}

// ================= Recent Queries =================
export function RecentQueries({ data }) {
    return (
        <div className="mb-6">
            <h2 className="text-sm font-medium mb-3">Recent queries</h2>
            <div className="bg-white rounded-2xl divide-y">
                {data.map((q, i) => (
                    <div key={i} className="flex justify-between p-4 text-sm">
                        <div>
                            <div className="font-medium">{q.title}</div>
                            <div className="text-gray-500">{q.type}</div>
                        </div>
                        <div className="text-right text-gray-500">
                            <div>{q.user}</div>
                            <div className="flex items-center gap-1 justify-end">
                                <Clock size={14} /> {q.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ================= Files Table =================
export function FilesTable({ files }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-medium">Project files</h2>
                <input
                    className="border px-3 py-1 rounded-lg text-sm"
                    placeholder="Search"
                />
            </div>

            <div className="bg-white rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Last modified</th>
                        <th className="text-left p-3">Size</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map((file, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-3 flex items-center gap-2">
                                {file.type === "Folder" ? (
                                    <Folder size={16} />
                                ) : (
                                    <FileText size={16} />
                                )}
                                {file.name}
                            </td>
                            <td className="p-3">{file.type}</td>
                            <td className="p-3">{file.date}</td>
                            <td className="p-3">{file.size}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function ChatDashboard() {

    const recentQueries = [
        {
            title: "Contracts with Change of Control Provisions",
            type: "Review table",
            user: "akumar@whitfordlane.com",
            time: "10 minutes ago",
        },
        {
            title: "Commercial Contract Review",
            type: "Review table",
            user: "jsmith@whitfordlane.com",
            time: "4 hours ago",
        },
        {
            title: "Clarification on Effective Date Inquiry",
            type: "Review table",
            user: "rwilliams@whitfordlane.com",
            time: "12 hours ago",
        },
    ];

    const files = [
        { name: "A Contracts", type: "Folder", size: "412 MB", date: "Oct 20, 2025" },
        { name: "Documents for Review", type: "Folder", size: "690 MB", date: "Oct 16, 2025" },
        { name: "Non-Compete Impacted", type: "Folder", size: "243 MB", date: "Oct 02, 2025" },
        { name: "Style Guide", type: "Folder", size: "705 MB", date: "Sep 29, 2025" },
        { name: "Agilent Supply Agreement.pdf", type: "File", size: "309 MB", date: "Sep 29, 2025" },
        { name: "AIG License Agreement.pdf", type: "File", size: "247 MB", date: "Sep 27, 2025" },
    ];
    return (
        <>
            <div className="flex h-screen bg-gray-50 text-gray-900">
                <Sidebar />

                <main className="flex-1 p-6 overflow-y-auto">
                    <Header />
                    <SearchBox />
                    <RecentQueries data={recentQueries} />
                    <FilesTable files={files} />
                </main>
            </div>
        </>
    )
}


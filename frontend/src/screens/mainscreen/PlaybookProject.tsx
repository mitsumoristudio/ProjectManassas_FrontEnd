import React from "react";
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
    LucideHome,
    MessageCircleMoreIcon, BarChart2Icon, DollarSign, TrendingUp, BarChart4Icon, MenuSquare, Sidebar
} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {useLogoutMutation} from "../../features/userApiSlice";
import {AnimatePresence, motion} from "framer-motion";
import SideBar from "../../components/Layout/Graph & Tables/SideBar";


function PlayWrightHeader() {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-semibold">PlayWright</h1>
            <p className="text-sm text-gray-500">
                Upload, store and review hundreds of PDF documents
            </p>
        </div>
    );
}

function PlayWrightActions() {
    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm cursor-pointer hover:bg-gray-400 transition-colors ease-in-out mb-2">
                <div className="p-3 bg-gray-100 rounded-xl">
                    <Database size={20} />
                </div>
                <div>
                    <div className="font-medium">Create Project</div>
                    <div className="text-sm text-gray-500">
                        Upload a new collection of files.
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm cursor-pointer hover:bg-gray-400 transition-colors ease-in-out mb-2">
                <div className="p-3 bg-gray-100 rounded-xl">
                    <Search size={20} />
                </div>
                <div>
                    <div className="font-medium">Create Knowledge Base</div>
                    <div className="text-sm text-gray-500">
                        Distribute a repository of files to your organization.
                    </div>
                </div>
            </div>
        </div>
    );
}

// ================= Tabs =================
function Tabs() {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 text-sm">
                <button className="font-medium">All projects</button>
                <button className="text-gray-500">Your Projects</button>
                <button className="text-gray-500">Shared with you</button>
            </div>

            <input
                className="border px-3 py-1 rounded-lg text-sm"
                placeholder="Search"
            />
        </div>
    );
}

// ================= Project Card =================
function ProjectCard({ project }) {
    return (
        <div className="bg-white p-4 rounded-2xl hover:bg-gray-200 transition-colors mb-2 cursor-pointer">
            <div className="flex justify-between mb-6">
                <div className="p-4 bg-gray-100 rounded-xl">
                    {project.shared ? <Users size={20} /> : <Folder size={20} />}
                </div>
                <MoreHorizontal size={16} className="text-gray-400" />
            </div>

            <div className="font-medium text-sm">{project.name}</div>
            <div className="text-xs text-gray-500 mt-1">
                {project.files} files · {project.type}
            </div>
        </div>
    );
}

// ================= Project Grid =================
function ProjectGrid({ projects }) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {projects.map((p, i) => (
                <ProjectCard key={i} project={p} />
            ))}
        </div>
    );
}

export default function PlaybookProject() {

    const projects = [
        { name: "M&A (US)", files: "26,593", type: "Knowledge base" },
        { name: "Cross-Border Tax Strategies", files: "14,977", type: "Knowledge base" },
        { name: "Avenor AI - Series B Financing", files: "8,201", type: "Shared", shared: true },
        { name: "Amend v Delta IP Litigation", files: "36,897", type: "Shared", shared: true },
        { name: "Northbridge Holdings", files: "4,065", type: "Vault" },
        { name: "Commercial Contracts", files: "92,841", type: "Vault" },
    ];

    return (
        <>
            <div className="flex h-screen bg-gray-50">
                <SideBar />

                <main className="flex-1 p-6 overflow-y-auto bg-gray-50 text-gray-900">
                    <PlayWrightHeader />
                    <PlayWrightActions />
                    <Tabs />
                    <ProjectGrid projects={projects} />
                </main>
            </div>

        </>
    )
}
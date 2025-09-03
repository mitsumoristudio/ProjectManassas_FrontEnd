import React, { useState, useEffect } from "react";
import { Plus, ZapIcon, DollarSignIcon, CalendarIcon, FileBarChart, MoreVertical } from "lucide-react";
import SideBar from "./Layout/SideBar";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetAllProjectsQuery } from "../features/projectApiSlice";
import StackCard from "./Layout/StackCard";

export function ProjectFilters() {
    const { userInfo } = useSelector((state: any) => state.auth);


    // @ts-ignore
    const { data: projects } = useGetAllProjectsQuery<any>();
    const projectItems = projects?.items || [];

    // Filters
    const [filters, setFilters] = useState({
        projectName: "",
        projectEstimate: "",
        created: "",
        contractor: "",
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search & filter
    const filteredProjects = projectItems
        .filter((p: any) =>
            p.projectname.toLowerCase().includes(filters.projectName.toLowerCase())
        )
        .filter((p: any) =>
            filters.projectEstimate ? p.projectestimate >= +filters.projectEstimate : true
        )
        .filter((p: any) =>
            filters.created ? new Date(p.createdAt).toDateString() === new Date(filters.created).toDateString() : true
        )
        .filter((p: any) =>
            filters.contractor ? p.contractor === filters.contractor : true
        );

    // Pagination calculations
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

    // Reset filters
    const resetFilters = () => {
        setFilters({ projectName: "", projectEstimate: "", created: "", contractor: "" });
        setCurrentPage(1);
    };

    useEffect(() => {
        setCurrentPage(1); // Reset page if filters change
    }, [filters]);

    return (
        <div className="bg-[#0A0A0A] text-white min-h-screen flex">
            <SideBar />

            <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 container mx-auto">
                {/* Header Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StackCard icon={ZapIcon} name="Total Projects" value={projectItems.length} color="#6366F1" />
                    <StackCard icon={DollarSignIcon} name="Total Estimate" value={projectItems.reduce((acc : any, p: any) => acc + p.projectestimate, 0)} color="#8B5CF6" />
                    <StackCard icon={CalendarIcon} name="Projects This Month" value={projectItems.filter((p: any) => {
                        const d = new Date(p.createdAt);
                        const now = new Date();
                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                    }).length} color="#8B5CF6" />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Project Name"
                        className="border rounded-md px-3 py-2 text-black"
                        value={filters.projectName}
                        onChange={(e) => setFilters({ ...filters, projectName: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Min Estimate"
                        className="border rounded-md px-3 py-2 text-black"
                        value={filters.projectEstimate}
                        onChange={(e) => setFilters({ ...filters, projectEstimate: e.target.value })}
                    />
                    <input
                        type="date"
                        className="border rounded-md px-3 py-2 text-black"
                        value={filters.created}
                        onChange={(e) => setFilters({ ...filters, created: e.target.value })}
                    />
                    <select
                        className="border rounded-md px-3 py-2 text-black"
                        value={filters.contractor}
                        onChange={(e) => setFilters({ ...filters, contractor: e.target.value })}
                    >
                        <option value="">All Contractors</option>
                        {Array.from(new Set(projectItems.map((p: any) => p.contractor))).map((c: any) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <button
                        onClick={resetFilters}
                        className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Table */}
                <div className="bg-[#101010] border border-gray-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-400">Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Number</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Estimate</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Location</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Contractor</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Created</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentProjects.map((project: any, index: number) => (
                                <tr key={project.id || index} className="border-t border-gray-800 hover:bg-gray-900/50 transition-colors">
                                    <td className="p-4 text-white font-medium">{project.projectname}</td>
                                    <td className="p-4 text-gray-300">{project.projectnumber}</td>
                                    <td className="p-4 text-gray-300">${project.projectestimate}</td>
                                    <td className="p-4 text-gray-300">{project.location}</td>
                                    <td className="p-4 text-gray-300">{project.contractor}</td>
                                    <td className="p-4 text-gray-300">{new Date(project.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-300">{project.status}</td>
                                    <td className="p-4 text-right">
                                        <MoreVertical size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center space-x-2 mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-700 text-white hover:bg-gray-600"}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

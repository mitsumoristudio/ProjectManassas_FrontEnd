import React, {useEffect, useState} from 'react';
import { Plus, MoreVertical, Search, Bell, ZapIcon, DollarSignIcon, CalendarIcon, FileBarChart } from 'lucide-react';
import SideBar from "../components/SideBar";
import {useNavigate, NavLink, useParams} from "react-router-dom";
import {useGetAllProjectsQuery, useCreateProjectMutation} from "../features/projectApiSlice";
import StackCard from "../components/StackCard";
import {CiSearch} from "react-icons/ci";
import {logout} from "../features/authSlice";
import {useLogoutMutation} from "../features/userApiSlice";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";
import {ProjectFilters} from "../components/ProjectFilters";



export function ProjectsScreen() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const {keyword} = useParams();

    const {userInfo} = useSelector((state: any) => state.auth);
    const userId = userInfo?.id;
    console.log(userId)

    const [createProject] = useCreateProjectMutation();
    const [logoutApiCall] = useLogoutMutation();

    const [openEdit, setOpenEdit] = useState(false);
    const [projectName, setProjectName] = useState<string>("");
    const [projectNumber, setProjectNumber] = useState<string>("");
    const [estimate, setEstimate] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [contractor, setContractor] = useState<string>("");
    const [projectManager, setProjectManager] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const newId = uuidv4();

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const parsedValue = newValue === "" ? "" : parseFloat(newValue)

        if (!isNaN(parsedValue as number) || newValue === "") {
            // @ts-ignore
            setEstimate(newValue as number);
        }
    }


    const requireAuth = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }
        callback();
    }

    const onCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }

        try {
            const newProject = {
                id: newId,
                projectName,
                projectNumber,
                projectestimate: parseFloat(estimate),
                location: location,
                contractor: contractor,
                projectManager: projectManager,
                description: description,
                userId: userId,
            };
            await createProject(newProject).unwrap();
            toast.success("Project created successfully.");

            // Reset & Close
            setProjectName("");
            setProjectNumber("");
            setEstimate("");
            setLocation("");
            setContractor("");
            setProjectManager("");
            setDescription("");

            setOpenEdit(false);

        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create a project");
        }
    };

    const logoutHandler = async () => {
        try {
            // @ts-ignore
            await logoutApiCall().unwrap()
            // @ts-ignore
            dispatch(logout())
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    const {data: projects} = useGetAllProjectsQuery<any>({keyword});
    const totalProjects = projects?.items?.length || 0;
    const totalEstimate = projects?.items?.reduce((acc: any, item: any) => acc + item.projectestimate, 0) || 0;
    // console.log("Project Response", projects);

    const totalProjectsThisMonth = projects?.items?.filter((p: any) => {
        const projectDate = new Date(p.createdAt);
        const now = new Date();
        return (
            projectDate.getMonth() === now.getMonth() &&
            projectDate.getFullYear() === now.getFullYear()
        );
    }).length || 0;

    const projectItems = projects?.items;
    const [filteredProjects, setFilteredProjects] = useState(projectItems);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleProjectSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = projects?.items.filter((p: any) => {
            return p.projectname.toLowerCase().includes(term);
        });

        setFilteredProjects(filtered);
    }

    useEffect(() => {
        if (projectItems) {
            const filtered = searchTerm ? projectItems.filter((p: any) => p.projectname.toLowerCase().includes(searchTerm.toLowerCase())) : projectItems;
            setFilteredProjects(filtered);
        }
    }, [projectItems, searchTerm, projectItems, searchTerm]);

    const downloadCSV_File = () => {
        if (!projects?.items?.length) {
            return;
        }
        // Define CSV Headers
        const csvHeader = [
            "Project Name",
            "Project Number",
            "Estimate",
            "Location",
            "Contractor",
            "Project Manager",
            "Created At",
            "Status",
        ];
        // Map project data to CSV rows
        const csvRows = projects?.items?.map((row: any) => [
            row.projectname,
            row.projectnumber,
            row.projectestimate,
            row.location,
            row.contractor,
            row.projectmanager,
            new Date(row.createdAt).toLocaleDateString(),
            row.status || "Pending",
        ]);
        // Combine header and rows into CSV string
        const csvConstant = [csvHeader, ...csvRows].map((row: any) => row.join(",")).join('\n');

        // Create a blob and trigger download
        const blob = new Blob([csvConstant], {type: "text/csv;charset=utf-8"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "projects.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="bg-[#0A0A0A] text-white font-sans min-h-screen flex">
                {/* Sidebar */}
                <SideBar/>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="bg-[#101010]/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setSidebarOpen(!isSidebarOpen)}
                                            className="md:hidden mr-4 text-gray-400 hover:text-white">
                                        {/*<GanttChartSquare size={24}/>*/}
                                    </button>

                                    <NavLink to={"/"} className={"flex items-center gap-2 hover:text-white"}>
                                        <svg width="26" height="26" viewBox="0 0 96 96" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M48 0C21.49 0 0 21.49 0 48C0 74.51 21.49 96 48 96C74.51 96 96 74.51 96 48C96 21.49 74.51 0 48 0ZM48 88C26.021 88 8 69.979 8 48C8 26.021 26.021 8 48 8C69.979 8 88 26.021 88 48C88 69.979 69.979 88 48 88ZM68 48L48 68L28 48L48 28L68 48Z"
                                                  fill="#30E0A5"/>
                                        </svg>
                                        <h1 className="text-2xl font-semibold">Manassas</h1>
                                    </NavLink>

                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="text-gray-400 hover:text-white">
                                        <Search size={20}/>
                                    </button>
                                    <button className="text-gray-400 hover:text-white">
                                        <Bell size={20}/>
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        {userInfo ? (
                                            <div
                                                className='items-center  group gap-2 relative flex flex-row'>
                                                <div
                                                    className="w-8 h-8 bg-purple-600 rounded-full items-center py-1 text-white text-center">{userInfo?.userName?.charAt(0)}</div>
                                                <span
                                                    className="hidden sm:inline text-sm">{userInfo?.email}</span>


                                            </div>
                                        ) : (
                                            <div className={"hidden md:flex items-center space-x-4"}>
                                                <NavLink to={"/login"}
                                                         className={"text-md font-semibold text-center px-4 py-1 text-gray-900  h-8 hover:text-white  bg-[#30E0A5] rounded-md hover:bg-opacity-90 transition-colors"}>Log
                                                    in</NavLink>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className=" p-4 sm:p-6 flex-shrink-0 lg:p-8 container mx-auto">
                        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-2 gap-4"}>
                            <StackCard icon={ZapIcon} name={"Total Projects"} value={totalProjects} color={"#6366F1"}/>
                            <StackCard icon={DollarSignIcon} name={"Total Estimate"} value={totalEstimate}
                                       color={"#8B5CF6"}/>
                            <StackCard icon={CalendarIcon} name={"Project this month"} value={totalProjectsThisMonth}
                                       color={"#8B5CF6"}/>
                        </div>


                        <div
                            className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:items-center mb-6">

                            <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Current Projects</h2>
                            <div className='relative'>
                                <input
                                    type='text'
                                    onChange={handleProjectSearch}
                                    placeholder='Search...'
                                    className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-16 pr-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                <CiSearch className='absolute left-3 top-2.5 text-gray-400' size={18}/>
                            </div>

                            {/* Add Projects */}
                            <button
                                onClick={() => requireAuth(() => setOpenEdit(true))}
                                className="flex items-center justify-center px-4 py-2 bg-[#30E0A5] text-black hover:text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                                <Plus size={18} className="mr-2"/>
                                New Project
                            </button>

                            {/* Opening create project. Add requireAuth and wrap around setOpenEdit if there is no user logged in */}
                            {openEdit && userInfo && (
                                <div
                                    className={"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"}>
                                    <div className={"bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"}>
                                        <h2 className={"text-2xl font-semibold text-gray-900 mb-4"}>New Project</h2>
                                        <form className={"space-y-4"}
                                                onSubmit={onCreateSubmit}>
                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Project Name:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={projectName}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Project"
                                                    onChange={(e) => setProjectName(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Project Number:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={projectNumber}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="#10000"
                                                    onChange={(e) => setProjectNumber(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Estimate:
                                                </label>
                                                <input
                                                    type="number"
                                                    required={true}
                                                    value={estimate}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={"Enter value"}
                                                    onChange={handleNumberChange}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Location:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={location}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="City, State"
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Contractor:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={contractor}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="General Contractor"
                                                    onChange={(e) => setContractor(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Project Manager:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={projectManager}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Project Manager"
                                                    onChange={(e) => setProjectManager(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label data-cy={"description_headline"}
                                                       htmlFor="message"
                                                       className="block text-lg font-medium text-gray-700 mb-1">
                                                    Description
                                                </label>
                                                <textarea
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    id="description"
                                                    name="description"
                                                    value={description}
                                                    rows={5}
                                                    data-cy={"description"}
                                                    data-cx={"input_description"}
                                                    placeholder="Your message here..."
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 placeholder-gray-500 resize-y"
                                                ></textarea>
                                            </div>

                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenEdit(false)}
                                                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Download CSV file */}
                            <button
                                onClick={() => requireAuth(() => downloadCSV_File())}
                                className="flex items-center justify-center px-4 py-2 bg-[#30E0A5] text-black hover:text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                                <FileBarChart size={18} className="mr-2"/>
                                Download CSV
                            </button>
                        </div>

                        {/* Projects Table */}
                        <div className="bg-[#101010] border border-gray-800 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">

                                <table className="w-full text-left">
                                    <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-gray-400">Name</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400">Project Number</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400">Estimate</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400">Location</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400">Contractor</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400">Project Manager</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400">Created</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/*{projects?.items?.map((project: any, index: number) => (*/}
                                    {filteredProjects?.map((project: any, index: number) => (
                                        <tr key={`${project}-${index}`}
                                            className="border-t border-gray-800 hover:bg-gray-900/50 transition-colors">
                                            <td className="p-4 text-white font-medium">{project.projectname}</td>
                                            <td className="p-4 text-gray-300">{project.projectnumber}</td>
                                            <td className="p-4 text-gray-300">${project.projectestimate}</td>
                                            <td className="p-4 text-gray-300">{project.location}</td>
                                            <td className="p-4 text-gray-300">{project.contractor}</td>
                                            <td className="p-4 text-gray-300">{project.projectmanager}</td>
                                            <td className="p-4 text-gray-300">{new Date(project.createdAt).toLocaleDateString(
                                                "en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                }
                                            )}</td>
                                            <td className="p-4 text-gray-300">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-gray-400 hover:text-white">
                                                    <MoreVertical size={20}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}


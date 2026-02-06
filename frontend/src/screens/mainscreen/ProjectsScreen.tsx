import React, {useEffect, useState} from 'react';
import {
    Plus,
    SquarePenIcon,
    ZapIcon,
    DollarSignIcon,
    CalendarIcon,
    TrashIcon,
    NotebookTabs,
    MessageCircle,
    XCircle, XCircleIcon
} from 'lucide-react';
import SideBar from "../../components/Layout/Graph & Tables/SideBar";
import {useNavigate, useParams} from "react-router-dom";
import {useGetAllProjectsQuery, useCreateProjectMutation, useDeleteProjectMutation} from "../../features/projectApiSlice";
import StackCard from "../../components/Layout/StackCard";
import {CiSearch} from "react-icons/ci";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";
import DownloadProjectCSVbutton from "../../components/Layout/Graph & Tables/DownloadProjectCSVbutton";
import CustomLoader from "../../components/Layout/CustomLoader";
import {Helmet} from "react-helmet";
import { motion } from 'framer-motion';
import SignalRProvider from "../../SignalRProvider/SignalRProvider";
import {useSwipeable} from "react-swipeable";
import DashMobileHeader from "../../components/Layout/DashMobileHeader";

export function ProjectsScreen() {

    const navigate = useNavigate();
    const {keyword} = useParams();

    const {userInfo} = useSelector((state: any) => state.auth);
    const userId = userInfo?.id;
   // console.log(userId)

    const [createProject] = useCreateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();

    const [openEdit, setOpenEdit] = useState(false);
    const [activeDescriptionId, setActiveDescriptionId] = useState<string | boolean>(null);
    const [projectName, setProjectName] = useState<string>("");
    const [projectNumber, setProjectNumber] = useState<string>("");
    const [estimate, setEstimate] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [contractor, setContractor] = useState<string>("");
    const [projectManager, setProjectManager] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [openChatMessage, setOpenChatMessage] = useState(false);
    const newId = uuidv4();

    // Pass a number in textfield
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const parsedValue = newValue === "" ? "" : parseFloat(newValue)

        if (!isNaN(parsedValue as number) || newValue === "") {
            // @ts-ignore
            setEstimate(newValue as number);
        }
    }

    // Confirm if the user exists
    const requireAuth = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }
        callback();
    }

    const requireAuthDescription = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to see the description");
            return;
        }
        callback();
    }

    // Add New Project Handler
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
                projectEstimate: parseFloat(estimate),
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

    // Get data from Reduxs
    const {data: projects, refetch, isLoading} = useGetAllProjectsQuery<any>({keyword});
    const totalProjects = projects?.items.length || 0;
    const totalEstimate = projects?.items?.reduce((acc: any, item: any) => acc + item.projectEstimate, 0) || 0;
    // console.log("Project Response", projects);

    const filteredUserProjectId = projects?.items?.filter((project: {userId: string}) => project.userId  === userId);

    // Confirm if the UserID is equal to Project UserID or User is Admin
    const requirefilteredUser = (callback: () => void) => {
        const isAssigned = filteredUserProjectId && filteredUserProjectId.length > 0;

        if (!userInfo?.isAdmin && !isAssigned) {
            toast.error("You must be assigned to project to edit");
            return;
        }
        callback();
    }

    const totalProjectsThisMonth = projects?.items?.filter((p: any) => {
        const projectDate = new Date(p.createdAt);
        const now = new Date();
        return (
            projectDate.getMonth() === now.getMonth() &&
            projectDate.getFullYear() === now.getFullYear()
        );
    }).length || 0;

    const projectItems = projects?.items;

    const [searchTerm, setSearchTerm] = useState<string>("");

    {/* Pagination */}
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 7;

    const filterProjects = projectItems?.filter((item: any) => item?.projectName?.toLowerCase().includes(searchTerm.toLowerCase()));

    // Pagination Calculation
    const totalPages = Math.ceil(projectItems?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProjects = filterProjects?.slice(indexOfFirstItem, indexOfLastItem);

    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrentPage((p) => Math.min(p+1, totalPages)),
        onSwipedRight: () => setCurrentPage((p) => Math.max(p-1, 1)),
        trackMouse: true
    });

    // Handle Project Search
    const handleProjectSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    }

    useEffect(() => {
        // if (projectItems) {
        //     const filtered = searchTerm ? projectItems.filter((p: any) => p.projectname.toLowerCase().includes(searchTerm.toLowerCase())) : projectItems;
        //     setFilteredProjects(filtered);
        // }
        setCurrentPage(1); // Reset Page if filter changes
    }, [projectItems, searchTerm]);

    // Delete Project
    const deleteProjectHandler = async (id: any) => {
        if (window.confirm("Are you sure you want to delete this product now?")) {
            try {
                await deleteProject(id);
                refetch();

                toast.success("Product deleted successfully.");
                navigate("/")
            } catch (error) {
                toast.error("Problem with deleting this product now!");
            }
        }
    }

    return (
        <>
            <Helmet>
                <title>Projects </title>
                    <meta name="description" content="Projects page" />
            </Helmet>
            {isLoading ? (
                <CustomLoader/>
            )  : (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                >
                    <div className="bg-[#0A0A0A] text-white font-sans min-h-screen flex">
                        {/* Sidebar hide on small screens, provides hamburger to open overlay*/}
                        <div className={"hidden md:block"}>
                            <SideBar/>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col">

                            {/* Header */}
                            <DashMobileHeader />

                            {/* Page Content */}
                            <main className=" p-4 sm:p-6 flex-shrink-0 lg:p-8 container mx-auto">
                                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"}>
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
                                            <div className={"bg-white rounded-2xl shadow-xl p-4 w-full max-w-md"}>

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
                                                            data-cy={"error-project"}
                                                            data-cx={"input-project"}
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
                                                            data-cy={"error-projectnumber"}
                                                            data-cx={"input-projectnumber"}
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
                                                            data-cy={"error-estimate"}
                                                            data-cx={"input-estimate"}
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
                                                            data-cy={"error-location"}
                                                            data-cx={"input-location"}
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
                                                            data-cy={"error-contractor"}
                                                            data-cx={"input-contractor"}
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
                                                            data-cy={"error-projectmanager"}
                                                            data-cx={"input-projectmanager"}
                                                            onChange={(e) => setProjectManager(e.target.value)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label data-cy={"description_headline"}
                                                               htmlFor="message"
                                                               className="block text-lg font-medium text-gray-700 mb-1"
                                                        >
                                                            Description
                                                        </label>
                                                        <textarea
                                                            onChange={(e) => setDescription(e.target.value)}
                                                            id="description"
                                                            name="description"
                                                            value={description}
                                                            rows={3}
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
                                    <DownloadProjectCSVbutton />
                                </div>

                                {/* Projects Table (hidden on small screens) */}
                                <div className="hidden sm:block bg-[#101010] border border-gray-800 rounded-lg overflow-hidden">
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
                                                <th className="p-4 text-sm font-semibold text-gray-400">Info</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {/*{projects?.items?.map((project: any, index: number) => (*/}
                                            {currentProjects?.map((project: any, index: number) => (
                                                <tr key={`${project}-${index}`}
                                                    className="border-t border-gray-800 hover:bg-gray-900/50 transition-colors">
                                                    <td className="p-4 text-white font-medium">{project.projectName}</td>
                                                    <td className="p-4 text-gray-300">{project.projectNumber}</td>
                                                    <td className="p-4 text-gray-300">${project.projectEstimate}</td>
                                                    <td className="p-4 text-gray-300">{project.location}</td>
                                                    <td className="p-4 text-gray-300">{project.contractor}</td>
                                                    <td className="p-4 text-gray-300">{project.projectManager}</td>
                                                    <td className="p-4 text-gray-300">{new Date(project.createdAt).toLocaleDateString(
                                                        "en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric"
                                                        }
                                                    )}</td>
                                                    <td className="p-4 text-gray-300">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full bg-green-400`}>
                                                    {project.status}
                                                </span>
                                                    </td>
                                                    <td className="p-4 text-right">

                                                        {/* Open Project Edit page */}
                                                        <button onClick={() => requireAuth(() => requirefilteredUser(() => navigate(`/projects/${project.id}`)))}
                                                                className="text-gray-400 py-1 hover:text-white">
                                                            <SquarePenIcon size={20}/>
                                                        </button>

                                                        {(userInfo?.isAdmin || filteredUserProjectId) && (
                                                            <>
                                                                <button onClick={() => deleteProjectHandler(project.id)}
                                                                    className={"flex flex-row text-gray-400 mx-auto hover:text-white"}>
                                                                    <TrashIcon size={20}/>
                                                                </button>

                                                            </>
                                                        )}
                                                    </td>

                                                    {/* Open Project description page */}
                                                    <div className="flex flex-1 mx-auto my-2 px-2">
                                                        <button
                                                            onClick={() =>
                                                                requireAuthDescription(() => setActiveDescriptionId(
                                                                    activeDescriptionId === project.id ? null : project.id
                                                                ))
                                                            }
                                                            className="text-gray-400 hover:text-white my-4 flex items-center"
                                                        >
                                                            <NotebookTabs size={20} className="mr-2" />
                                                            {activeDescriptionId === project.id ? "Hide" : "Show"}
                                                        </button>

                                                        {activeDescriptionId === project.id&& (
                                                            <div className=" fixed bottom-6 right-3
                                                            w-[465px] h-[580px]
                                                            bg-[#1A1A1A] text-gray-800
                                                            rounded-2xl shadow-2xl border border-gray-600
                                                            z-50 p-4
                                                            animate-slide-up
                                                            flex flex-col">
                                                                <div className={"bg-white p-2 h-full rounded-2xl"}>
                                                                    <div className={"flex flex-row justify-between"}>
                                                                        <h2 className={"text-2xl font-semibold text-gray-900 mb-4"}>Project Description</h2>

                                                                        <button onClick={() => setActiveDescriptionId((prev) => !prev)}
                                                                                className={"hover:scale-110 transition duration-200 ease-in-out"}>
                                                                            <XCircleIcon size={32}/>
                                                                        </button>
                                                                    </div>
                                                                    {activeDescriptionId === project.id && (
                                                                        <h3 className="text-gray-800 font-medium text-center">
                                                                            {project.description}
                                                                        </h3>
                                                                    )}

                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                                {/* MOBILE CARD LIST */}
                                <div className="sm:hidden space-y-4">
                                    {currentProjects?.map((project: any, index: number) => (
                                        <div
                                            key={project.id}
                                            className="bg-[#111] border border-gray-800 rounded-xl p-4 shadow-lg"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-semibold text-white">
                                                    {project.projectName}
                                                </h3>

                                                <button
                                                    onClick={() =>
                                                        requireAuth(() => requirefilteredUser(() => navigate(`/projects/${project.id}`)))
                                                    }
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    <SquarePenIcon size={20} />
                                                </button>
                                            </div>

                                            <p className="text-gray-400 text-sm mt-2">{project.description}</p>

                                            <div className="mt-4 space-y-1 text-gray-300 text-sm">
                                                <p><b>Project #:</b> {project.projectNumber}</p>
                                                <p><b>Estimate:</b> ${project.projectEstimate}</p>
                                                <p><b>Location:</b> {project.location}</p>
                                                <p><b>Contractor:</b> {project.contractor}</p>
                                                <p><b>Manager:</b> {project.projectManager}</p>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                        <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-black font-semibold">
                                                          {project.status}
                                                        </span>

                                                <button
                                                    onClick={() => deleteProjectHandler(project.id)}
                                                    className="text-gray-400 hover:text-red-400"
                                                >
                                                    <TrashIcon size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Pagination Button */}
                                <div className={"flex justify-center space-x-2 mt-4"}>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev -1, 1))}
                                        className={"px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-600 "}
                                        disabled={currentPage === 1}>
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

                                    <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            className={"px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-600"}
                                            disabled={currentPage === totalPages}>
                                        Next
                                    </button>

                                </div>
                                {/* Floating Chat Button */}
                                <div className="fixed bottom-6 right-6 z-40">
                                    <button
                                        className="bg-white rounded-full p-3 shadow-xl hover:scale-125 transition"
                                        onClick={() => requireAuth(() => setOpenChatMessage(true))}
                                    >
                                        <MessageCircle size={40} color="#EC4899" />
                                    </button>
                                </div>

                                {/* Chat Overlay */}
                                {openChatMessage && (
                                    <>
                                        {/* BACKDROP */}
                                        <div
                                            onClick={() => setOpenChatMessage(false)}
                                            className="fixed inset-0 bg-black/50 items-center justify-end backdrop-blur-sm z-50"
                                        />

                                        {/* CHAT PANEL */}
                                        <div
                                            className="
                                                        fixed bottom-6 right-3
                                                        w-[465px] h-[680px]
                                                        bg-[#1A1A1A] text-gray-800
                                                        rounded-2xl shadow-2xl border border-gray-600
                                                        z-50 p-4
                                                        animate-slide-up
                                                        flex flex-col
            "
                                        >
                                            {/* Close button */}
                                            <button
                                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                                onClick={() => setOpenChatMessage(false)}
                                            >
                                                <XCircle size={32} />
                                            </button>

                                            {/* Your SignalR chat system */}
                                            <SignalRProvider />
                                        </div>
                                    </>
                                )}


                            </main>
                        </div>
                    </div>

                </motion.div>
            )}

        </>
    )
}


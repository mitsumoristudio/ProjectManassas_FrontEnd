import React, {useState, useRef, useEffect } from "react";
import {NavLink, useParams} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {Folder, FolderPlus, ChevronDown, ChevronRight, Ellipsis, Plus, Trash2Icon, MailsIcon} from "lucide-react";
import {useListAllProjectsQuery,
        useGetProjectIdQuery,
        useUpdateProjectChatMutation,
        useDeleteProjectChatMutation,
        useCreateProjectChatMutation} from "../../../features/conversationapiSlice"
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

interface sideBarProps {
    isSidebarOpen: boolean;
}

export default function ProjectSideDropdown({ isSidebarOpen}: sideBarProps) {
    const [projectsOpen, setProjectsOpen] = useState(false);
    const [openCreateProject, setopenCreateProject] = useState(false);
    const [projectName, setProjectName] = useState<string>("");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const {userInfo} = useSelector((state: any) => state.auth);

    const firstMessage = "Insert First Message";
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const [updateProject] = useUpdateProjectChatMutation();
    const [deleteProject] = useDeleteProjectChatMutation();
    const { id } = useParams();
    const projectId = String(id);
    const {data: projectData, fetch} = useGetProjectIdQuery<any>(projectId);

    useEffect(() => {
        if (projectData) {
            setProjectName(projectData?.chatProjectTitle)
        }
    }, [projectData]);

    const onSelectProjectDelete = async (id: string) => {
        if (window.confirm("This will permanently delete this conversation?")) {
            try {
                await deleteProject(id).unwrap();
                refetch();

                toast.success("Project deleted successfully.");

            } catch (error) {
                toast.error("Problem with deleting this project now!");

            }
        }
        setActiveMenu(null);
    }

    const onSelectShare = (id: string) => {
        console.log("Share project:", id);
        setActiveMenu(null);
    }

    // when user click outside the ellipsis, the window closes
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onSelectProjectEdit = (id: string) => {
        const project = projects?.find((p: any) => p.id === id);

        if (!project) {
            toast.error("Project not found!");
            return;
        }

        setEditingProjectId(id);
        setProjectName(project.chatProjectTitle);
        setopenCreateProject(true);
        setActiveMenu(null);

        refetch();
    };

    const EllipsisEdit = [
        {name: "Edit", icon: ChevronDown, color: "#6366f1", action: onSelectProjectEdit},
        {name: "Delete", icon: Trash2Icon, color: "#6366f1", action: onSelectProjectDelete},
        {name: "Share", icon: MailsIcon, color: "#6366f1", action: onSelectShare}
    ]

    // Confirm if the user exists
    const requireAuth = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }
        callback();
    }

    const [createProjectChat] = useCreateProjectChatMutation();

    const {
        data: projects,
        isLoading: isProjectLoading,
        isError: isProjectError,
        refetch,
    } = useListAllProjectsQuery({});

    // Add Create Project Handler
    const onCreateProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }

        try {
            if (editingProjectId) {
                await updateProject({
                    id: editingProjectId,
                    chatProjectTitle: projectName,
                }).unwrap();

                toast.success("Project updated!");
            } else {
                const newProject = {
                    conversationProjectTitle: projectName,
                    firstMessage: firstMessage
                };
                await createProjectChat(newProject).unwrap();
                toast.success("Created new project successfully.");


            }


            refetch();

            // Reset & Close
            setProjectName("");
            setEditingProjectId(null);
            setopenCreateProject(false);

        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create a project");
        }
    }

    // @ts-ignore
    return (
        <main>
            <div className="mb-2">

                {/* Top Level Projects Button */}
                <div
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-700 cursor-pointer"
                    onClick={() => requireAuth(() => setProjectsOpen(prev => !prev))}
                >

                    {/* Opening create project. Add requireAuth and wrap around setOpenEdit if there is no user logged in */}

                    <div className="flex items-center">
                        <Folder size={20} className="text-purple-400" />

                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    className="text-white ml-2 text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Projects
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    {isSidebarOpen && (
                        projectsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}

                </div>


                {/* Projects List */}

                <AnimatePresence>

                    {projectsOpen && isSidebarOpen && (

                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-6 max-h-64 overflow-y-auto pr-2"
                        >
                            <button onClick={() => setopenCreateProject(true)}
                                    className={"w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded-md"}>

                                <div className={"flex items-center gap-x-2"}>
                                    <FolderPlus size={20} className={"text-cyan-400"}/>
                                    <h3 className={"text-white text-sm"}>New Project</h3>
                                </div>

                                <Plus size={16} className={"text-gray-400"}/>
                            </button>

                            {/* Opening create project. Add requireAuth and wrap around setOpenEdit if there is no user logged in */}
                            {openCreateProject && userInfo && (
                                <div className={"fixed inset-12 w-96 flex items-baseline mx-40 z-50"}>
                                    <div className={"bg-white rounded-2xl shadow-xl p-4 w-full max-w-md"}>
                                        <form className={"space-y-4"}
                                              onSubmit={onCreateProjectSubmit}>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Project Name:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={projectName}
                                                    placeholder={""}
                                                    className={"mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"}
                                                    onChange={(e) => setProjectName(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setopenCreateProject(false)}
                                                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 rounded-lg bg-purple-400 text-white hover:bg-purple-800"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {isProjectLoading && <p className="text-gray-500">Loading Chat project...</p>}
                            {isProjectError && <p className="text-red-500">Failed to load projects</p>}

                            {/* Project Folder */}
                            {projects?.map(chatProject => (

                                <div key={chatProject.id} className={"flex flex-row mx-auto gap-x-1.5"}>
                                    <NavLink
                                        to={`/chat/${chatProject.id}`}
                                        className={({ isActive }) =>
                                            `flex items-center p-2 rounded-md ${
                                                isActive
                                                    ? "bg-gray-700 border-l-4 border-purple-200 text-white text-sm"
                                                    : "text-gray-300 hover:bg-gray-700 text-sm"
                                            }`
                                        }
                                    >
                                        {chatProject.chatProjectTitle}

                                    </NavLink>

                                    {/* Edit Delete Name */}

                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(prev => prev === chatProject.id ? null : chatProject.id);
                                        }}
                                        >
                                            <Ellipsis size={14}/>
                                        </button>

                                    {/* Edit Project Window */}
                                    {activeMenu === chatProject.id && (
                                        <div className={"fixed inset-12 w-96 flex items-baseline mx-40 z-50"}>
                                            <div
                                                ref={dropdownRef}
                                                className={"bg-gray-800 rounded-2xl shadow-xl p-1 w-48 cursor-pointer hover:bg-gray-400 transition-colors max-w-fit"}>

                                            {EllipsisEdit.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    onClick={() => item.action(chatProject.id)}
                                                    className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
                                                >
                                                    <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                                    <AnimatePresence>
                                                        {activeMenu === chatProject.id && (
                                                            <motion.span
                                                                key={index}
                                                                className="ml-4 whitespace-nowrap"
                                                                initial={{ opacity: 0, width: 0 }}
                                                                animate={{ opacity: 1, width: "auto" }}
                                                                exit={{ opacity: 0, width: 0 }}
                                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                            >
                                                                {item.name}
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </div>

                                        </div>)}
                                </div>

                            ))}

                        </motion.div>

                    )}

                </AnimatePresence>

            </div>
        </main>
    )
}
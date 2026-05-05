import React, {useState, useRef, useEffect} from "react";
import {Search, Folder, MoreHorizontal, Users, Database, ChevronDown, Trash2Icon, MailsIcon} from "lucide-react";

import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import {useCreatePlayWrightProjectMutation,
        useGetPlayWrightProjectbyIdQuery,
        useGetPlayWrightProjectListQuery,
        useUpdatePlayWrightProjectMutation,
        useDeletePlayWrightProjectMutation} from "../../features/playwrightApiSlice";


import SideBar from "../../components/Layout/Graph & Tables/SideBar";

export default function PlaybookProject() {
    const [openProject, setOpenProject] = useState(false);
    const [projectName, setProjectName] = useState<string>("");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const {userInfo} = useSelector((state: any) => state.auth);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [createProject] = useCreatePlayWrightProjectMutation();
    const [updateProject] = useUpdatePlayWrightProjectMutation();
    const [deleteProject] = useDeletePlayWrightProjectMutation();
    const {id} = useParams();
    const {keyword} = useParams();
    const projectId = String(id);
    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId);

    const {
        data: playWrightProject,
        isLoading: isProjectLoading,
        isError: isProjectError,
        refetch,
    } = useGetPlayWrightProjectListQuery({keyword})

    const onSelectShare = (id: string) => {
        console.log("Share project:", id);
        setActiveMenu(null);
    }

    // Confirm if the user exists
    const requireAuth = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }
        callback();
    }

    useEffect(() => {
        if (projectData) {
            setProjectName(projectData?.projectName);
        }
    }, [projectData]);

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

    // Edit Project
    const onSelectProjectEdit = (project: any) => {

        setEditingProjectId(project?.id);
        setProjectName(project.projectName);
        setOpenProject(true);
        setActiveMenu(null);

        refetch();
    };

    // Delete Project
    const onSelectProjectDelete = async (id: string) => {
        if (window.confirm("This will permanently delete the project")) {
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

    const EllipsisEdit = [
        {name: "Edit", icon: ChevronDown, color: "#6366f1", action: onSelectProjectEdit},
        {name: "Delete", icon: Trash2Icon, color: "#6366f1", action: onSelectProjectDelete},
        {name: "Share", icon: MailsIcon, color: "#6366f1", action: onSelectShare}
    ]

    // Create ProjectHandler
    const onCreateProjectHander = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }

        try {
            if (editingProjectId) {
                await updateProject({
                    id: editingProjectId,
                    projectName: projectName,
                }).unwrap();
                toast.success("Project has been updated successfully.");
            } else {
                const newProject = {
                    projectName: projectName,
                };
                await createProject(newProject).unwrap();
                toast.success("Project has been created successfully.");
            }
            refetch();
            setProjectName("");
            setEditingProjectId(null);
            setActiveMenu(null);

        } catch (err: any) {
            toast.error("Failed to create a project!");
        }
    }

    return (
        <>
            <div className="flex h-screen bg-gray-50">
                <SideBar />

                {/* Header */}
                <main className="flex-1 p-6 overflow-y-auto bg-gray-50 text-gray-900">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">PlayWright</h1>
                        <p className="text-sm text-gray-500">
                            Upload, store and review hundreds of PDF documents
                        </p>
                    </div>

                    {/* Action- Create Project */}
                    <div className="grid grid-cols-2 gap-4 mb-6">

                        <button className="bg-white  p-4 rounded-2xl flex items-center gap-4 shadow-sm cursor-pointer hover:bg-gray-400 transition-colors ease-in-out mb-2"
                                onClick={() => requireAuth(() => setOpenProject(true))}>

                            <div className="p-3 bg-gray-100 rounded-xl">
                                <Database size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-lg items-start">Create Project</div>
                                <div className="text-sm text-gray-500">
                                    Upload a new collection of files.
                                </div>
                            </div>
                        </button>

                        <button className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm cursor-pointer hover:bg-gray-400 transition-colors ease-in-out mb-2">
                            <div className="p-3 bg-gray-100 rounded-xl">
                                <Search size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-lg items-start">Create Knowledge Base</div>
                                <div className="text-sm text-gray-500">
                                    Distribute a repository of files to your organization.
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Tab Item */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-4 text-sm">
                            <button className="font-medium">All projects</button>
                            <button className="text-gray-500">Your Projects</button>
                            <button className="text-gray-500">Shared with you</button>
                        </div>

                        <input
                            className="border border-r px-8 py-2 rounded-lg text-md font-semibold "
                            placeholder="Search"
                        />
                    </div>

                    {/* Project Card Lists */}
                    <div className="grid grid-cols-4 gap-4 min-h-56">
                        {playWrightProject?.map((pro, i) => (
                            <div className="bg-white p-6 rounded-2xl hover:bg-gray-200 transition-colors mb-2 cursor-pointer"
                            key={i.id}>

                                <NavLink to={`playWrightQuery/${pro.id}`}
                                        className={"block p-6"}>

                                    <div className="flex justify-center mb-6">
                                        <div className="p-12 bg-gray-100 rounded-xl">
                                            {pro.projectName ? <Folder size={28} color={"gray"}/> : <Users size={20} />}
                                        </div>
                                    </div>

                                    <div className="font-medium text-sm">{pro.projectName}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {pro.files} files · {pro.type}
                                    </div>

                                </NavLink>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenu(prev => prev === pro.id ? null : pro.id);
                                    }}>
                                    <MoreHorizontal size={20} className="relative right-2 text-gray-800 hover:bg-gray-400 rounded-md mx-2 transition-colors mb-2"/>
                                </button>


                                {/* Edit Project Window */}
                                {activeMenu === pro.id && (
                                    <div className={"fixed z-60"}>
                                        <div
                                            ref={dropdownRef}
                                            className={"bg-gray-400 w-96 rounded-2xl shadow-xl p-1 w-48 cursor-pointer hover:bg-gray-300 transition-colors max-w-fit"}>

                                            {EllipsisEdit.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    onClick={() => item.action(pro)}
                                                    className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors mb-2"
                                                >
                                                    <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                                    <AnimatePresence>
                                                        {activeMenu === pro.id && (
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
                    </div>

                    {/* Opening create project. Add requireAuth and wrap around setOpenEdit if there is no user logged in */}
                    {openProject && (
                        <div className="fixed top-10 left-60 z-40">
                            <div className={"bg-white rounded-2xl shadow-xl p-4 w-[350px]"}>
                                <form className={"space-y-4"}
                                      onSubmit={onCreateProjectHander}>

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
                                            onClick={() => setOpenProject(false)}
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
                </main>
            </div>

        </>
    )
}



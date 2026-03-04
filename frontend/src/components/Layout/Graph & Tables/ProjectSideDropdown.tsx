import React, {useState} from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FolderPlus, ChevronDown, ChevronRight } from "lucide-react";

interface sideBarProps {
    isSidebarOpen: boolean;
}

const PROJECT_FOLDERS = [
    {
        id: "project1",
        name: "Bridge Renovation",
        chats: [
            { id: "chat1", name: "Blueprint Analysis" },
            { id: "chat2", name: "Material Estimation" }
        ]
    },
    {
        id: "project2",
        name: "Hospital Expansion",
        chats: [
            { id: "chat3", name: "Structural Review" },
            { id: "chat4", name: "HVAC Layout" }
        ]
    }
];

export default function ProjectSideDropdown({ isSidebarOpen}: sideBarProps) {
    const [openProjectFolder, setOpenProjectFolder] = useState<string | null>(null);
    const [projectsOpen, setProjectsOpen] = useState(false);


    return (
        <main>
            <div className="mb-2">

                {/* Top Level Projects Button */}
                <div
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-700 cursor-pointer"
                    onClick={() => setProjectsOpen(!projectsOpen)}
                >

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
                            className="ml-6"
                        >
                            <button>
                                <div className={"flex items-center gap-x-2 justify-between p-2 hover:bg-gray-700 rounded-md cursor-pointer"}>
                                    <Folder size={20} className={"text-white"}/>
                                    <h3 className={"text-white text-sm"}>Create Chat Project</h3>
                                </div>
                            </button>


                            {PROJECT_FOLDERS.map(project => (

                                <div key={project.id}>

                                    {/* Project Folder */}

                                    <div
                                        className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                                        onClick={() =>
                                            setOpenProjectFolder(
                                                openProjectFolder === project.id
                                                    ? null
                                                    : project.id
                                            )
                                        }
                                    >

                                    <span className="text-sm text-white">
                                        {project.name}
                                    </span>

                                        {openProjectFolder === project.id
                                            ? <ChevronDown size={14}/>
                                            : <ChevronRight size={14}/>
                                        }

                                    </div>


                                    {/* Nested Chats */}

                                    <AnimatePresence>

                                        {openProjectFolder === project.id && (

                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="ml-4"
                                            >

                                                {project.chats.map(chat => (

                                                    <Link
                                                        key={chat.id}
                                                        to={`/chat/${chat.id}`}
                                                        className="block text-sm text-gray-400 hover:text-white p-2 rounded-md"
                                                    >
                                                        {chat.name}
                                                    </Link>

                                                ))}

                                            </motion.div>

                                        )}

                                    </AnimatePresence>

                                </div>

                            ))}

                        </motion.div>

                    )}

                </AnimatePresence>

            </div>
        </main>
    )
}
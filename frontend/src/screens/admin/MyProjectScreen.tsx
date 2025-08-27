import React, {useState, useEffect} from "react";
import {Plus, MoreVertical, ZapIcon, DollarSignIcon, CalendarIcon, TrashIcon} from 'lucide-react';
import SideBar from "../../components/SideBar";
import {useNavigate, useParams} from "react-router-dom";
import StackCard from "../../components/StackCard";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import DashboardHeader from "../../components/DashBoardHeader";
import CustomLoader from "../../components/CustomLoader";
import {Helmet} from "react-helmet";
import {motion} from "framer-motion";
import {useGetMyProjectQuery, useDeleteProjectMutation} from "../../features/projectApiSlice";
import {CiSearch} from "react-icons/ci";
import DownloadProjectCSVbutton from "../../components/DownloadProjectCSVbutton";

export default function MyProjectScreen() {
    const navigate = useNavigate();
    const {id} = useParams();
    const {userInfo} = useSelector((state: any) => state.auth);
    const userId = userInfo?.id;

    const {data: projects, isLoading, isError, refetch} = useGetMyProjectQuery<any>(id);
    const [deleteProject] = useDeleteProjectMutation();
    const projectItems = projects?.items;
    const [filteredProjects, setFilteredProjects] = useState(projectItems);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Handle Project Search
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
     //   setCurrentPage(1); // Reset Page if filter changes
    }, [projectItems, searchTerm, ]);

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

    const myTotalProjects = projects?.items?.filter((project: {userId:string}) => project.userId === userId);

    const myTotalEstimate = projects?.items?.filter((projects: any)=> projects.userId === userId)
        .reduce((acc: any, item:any) => acc + item.projectestimate, 0) || 0;

    return (
        <>
            <Helmet>
                <title>My Project Table</title>
                <meta name="description" content="My Project Table page" />
            </Helmet>
            {isLoading ? (
                <CustomLoader />
            ) : isError ? (
                <div className={"text-red-600"}>Error Loading Project Data</div>
            ) : (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                    >
                    <div className={"bg-[#0A0A0A] text-white font-sans min-h-screen flex"}>
                        {/* Sidebar */}
                        <SideBar/>

                        {/* Main Content */}
                        <div className={"flex-1 flex flex-col"}>
                            {/* Header */}
                            <DashboardHeader />

                            {/* Page Content */}
                            <main className={"p-4 sm:p-6 flex-shrink-0 lg:p-8 container mx-auto"}>
                                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"}>
                                    <StackCard icon={ZapIcon} name={"Total Projects"} value={myTotalProjects} color={"#6366F1"}/>
                                    <StackCard icon={DollarSignIcon} name={"Total Estimate"} value={myTotalEstimate}
                                               color={"#8B5CF6"}/>
                                </div>

                                <div className={"flex flex-col sm:flex-row justify-between items-center gap-4 sm:items-center mb-6"}>
                                    <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Current Projects</h2>
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            onChange={handleProjectSearch}
                                            placeholder='Search...'
                                            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-16 pr-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                        <CiSearch className='absolute left-3 top-2.5 text-gray-400' size={18}/>

                                        {/* Download CSV file */}
                                        <DownloadProjectCSVbutton />
                                    </div>
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
                                            {projectItems?.map((project: any, index: number) => (
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
                                                    className={`px-2 py-1 text-xs font-medium rounded-full bg-green-400`}>
                                                    {project.status}
                                                </span>
                                                    </td>
                                                    {}
                                                    <td className="p-4 text-right">

                                                        {/* Open Project Edit page add edit button */}
                                                        <button
                                                                className="text-gray-400 hover:text-white">
                                                            <MoreVertical size={20}/>
                                                        </button>

                                                        {userInfo?.isAdmin && (
                                                            <>
                                                                <button onClick={() => deleteProjectHandler(project.id)}
                                                                        className={"flex flex-row text-gray-400 hover:text-white"}>
                                                                    <TrashIcon size={20}/>
                                                                </button>

                                                            </>
                                                        )}

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
                </motion.div>
            )}
        </>
    )
}
import React, {useState, useEffect} from "react";
import { MoreVertical, ZapIcon, DollarSignIcon, TrashIcon} from 'lucide-react';
import SideBar from "../../components/Layout/Graph & Tables/SideBar";
import  {useParams} from "react-router-dom";
import StackCard from "../../components/Layout/StackCard";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import DashboardHeader from "../../components/Layout/DashBoardHeader";
import CustomLoader from "../../components/Layout/CustomLoader";
import {Helmet} from "react-helmet";
import {motion} from "framer-motion";
import {useGetMyEquipmentsQuery, useDeleteEquipmentMutation} from "../../features/equipmentApiSlice";
import {CiSearch} from "react-icons/ci";
import {DownloadEquipmentCSVbutton} from "../../components/Layout/Graph & Tables/DownloadEquipmentCSVbutton";

export default function MyEquipmentScreen() {
    const {id}= useParams();
    const {userInfo} = useSelector((state: any) => state.auth);
    const userId = userInfo?.id;

    const {data: equipments, isLoading, isError, refetch} = useGetMyEquipmentsQuery<any>(id);
    const [deleteEquipment] = useDeleteEquipmentMutation();

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 7;

    // Pagination Calculation
    const totalPages = Math.ceil(equipments?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const [searchTerm, setSearchTerm] = useState<string>("");

    const filterTheEquipments = equipments?.filter((item: any) => item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Pagination
    const currentEquipments = filterTheEquipments?.slice(indexOfFirstItem, indexOfLastItem);
    const [filterEquipments, setFilterEquipments] = useState(currentEquipments);

    // Handle Equipment Search
    const handleEquipmentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = equipments.filter((p: any) => {
            return p.equipmentName.toLowerCase().includes(term);
        });
        setFilterEquipments(filtered);
    }

    // Delete Equipment
    const deleteEquipmentHandler = async (id: any) => {
        if (window.confirm("Are you sure you want to delete this product now?")) {
            try {
                await deleteEquipment(id);
                refetch();

                toast.success("Product deleted successfully.");

            } catch (error) {
                toast.error("Problem with deleting this product now!");
            }
        }
    }

    // Calculate total equipment for User
    const myTotalEquipments = equipments?.filter((equipment: {userId:string}) => equipment.userId === userId).length || 0;

    // Calculate total equipment monthly cost for User
    const myMonthlyEstimate = equipments?.filter((p: any)=> p.userId === userId)
    .reduce((acc: number, item:any) => acc + (item.monthlyCost|| 0), 0) || 0;

    useEffect(() => {
        if (equipments) {
            const filtered = searchTerm ? equipments?.filter((p: any) => p.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())) : equipments;
            setFilterEquipments(filtered);
        }
        setCurrentPage(1); // Reset Page if filter changes
    }, [equipments, searchTerm]);

    return (
        <>
            <Helmet>
                <title>My Equipment Table</title>
                <meta name="description" content="My Equipment Table page" />
            </Helmet>
            {isLoading ? (
                <CustomLoader />
            ) : isError ? (
                <div className={"text-red-600"}>Error Loading Equipment Data</div>
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
                                    <StackCard icon={ZapIcon} name={"Total Equipment Acquired"} value={myTotalEquipments} color={"#6366F1"}/>
                                    <StackCard icon={DollarSignIcon} name={"Overall Equipment Cost"} value={myMonthlyEstimate}
                                               color={"#8B5CF6"}/>
                                </div>

                                <div className={"flex flex-1 sm:flex-row justify-items-end items-center gap-4 sm:items-center mb-6"}>
                                    <h2 className={"text-2xl font-bold text-white mb-4 sm:mb-0"}>My Equipment</h2>

                                    <div className='relative flex flex-row gap-6'>
                                        {/* add todo for search*/}
                                        <input
                                            type='text'
                                            onChange={handleEquipmentSearch}
                                            placeholder='Search...'
                                            className='bg-gray-700 text-white mx-2 placeholder-gray-400 rounded-lg pl-16 pr-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                        <CiSearch className='absolute left-3 top-2.5 text-gray-400' size={18}/>

                                        {/* Download CSV file */}
                                        <DownloadEquipmentCSVbutton />
                                    </div>
                                </div>

                                {/* Equipment Table */}
                                <div className={"bg-[#101010] border border-gray-800 rounded-lg overflow-hidden"}>
                                    <div className={"overflow-x-auto"}>
                                        <table className={"w-full text-left"}>
                                            <thead className={"bg-gray-900/50"}>
                                            <tr>
                                                <th className="p-4 text-sm font-semibold text-gray-400">Equipment Name</th>
                                                <th className="p-4 text-sm font-semibold text-gray-400">Equipment Number</th>
                                                <th className="p-4 text-sm font-semibold text-gray-400">Supplier</th>
                                                <th className="p-4 text-sm font-semibold text-gray-400">External/Internal</th>
                                                <th className="p-4 text-sm font-semibold text-gray-400">Category</th>
                                                <th className="p-4 text-sm font-semibold text-gray-400">Monthly Cost</th>
                                                <th className="p-4 text-sm font-semibold text-gray-400">Project </th>
                                                <th className="p-4 text-sm font-semibold text-gray-400">Created At</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {currentEquipments?.map((equipment: any, index: number) => (
                                                <tr key={`${equipment}- ${index}`}
                                                    className={"border-t border-gray-800 hover:bg-gray-900/50 transition-colors"}>
                                                    <td className={"p-4 text-gray-300 font-medium"}>{equipment.equipmentName}</td>
                                                    <td className={"p-4 text-gray-300 font-medium"}>{equipment.equipmentNumber}</td>
                                                    <td className={"p-4 text-gray-300 font-medium"}>{equipment.supplier}</td>
                                                    <td className={"p-4 text-gray-300 font-medium"}>{equipment.internalExternal}</td>
                                                    <td className={"p-4 text-gray-300 font-medium"}>{equipment.equipmentType}</td>
                                                    <td className={"p-4 text-gray-300 font-medium"}>${equipment.monthlyCost}</td>
                                                    <td className={"p-4 text-gray-300 font-medium"}>{equipment.projectName}</td>
                                                    <td className="p-4 text-gray-300">{new Date(equipment.createdAt).toLocaleDateString(
                                                        "en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric"
                                                        }
                                                    )}</td>

                                                    <td className="p-4 text-gray-300">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${equipment.projectId === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {equipment.projectId}
                                                </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button className="text-gray-400 hover:text-white">
                                                            <MoreVertical size={20}/>
                                                        </button>

                                                        {userInfo?.isAdmin && (
                                                            <>
                                                                <button onClick={() => deleteEquipmentHandler(equipment.id)}
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

                                {/* Pagination Button */}
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


                            </main>



                        </div>

                    </div>


                </motion.div>
            )}
        </>
    )
}
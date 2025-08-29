import React, {useEffect, useState} from 'react';
import {
    Plus,
    MoreVertical,
    ZapIcon,
    DollarSignIcon,
    CalendarIcon,
    FileBarChart,
    ChevronDownIcon
} from 'lucide-react';
import SideBar from "../components/Layout/Graph & Tables/SideBar";
import {useNavigate, NavLink, useParams} from "react-router-dom";
import {useGetAllEquipmentsQuery, useCreateEquipmentMutation} from "../features/equipmentApiSlice";
import {useGetAllProjectsQuery} from "../features/projectApiSlice";
import StackCard from "../components/Layout/StackCard";
import {CiSearch} from "react-icons/ci";
import {logout} from "../features/authSlice";
import {useLogoutMutation} from "../features/userApiSlice";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";
import DashboardHeader from "../components/Layout/DashBoardHeader";
import {DownloadEquipmentCSVbutton} from "../components/Layout/Graph & Tables/DownloadEquipmentCSVbutton";


export default function EquipmentScreen() {
    const navigate = useNavigate();
    const {keyword} = useParams();
    const {userInfo} = useSelector((state: any) => state.auth);
    const userId = userInfo?.id;
    console.log(userId)

    const [createEquipment] = useCreateEquipmentMutation();
    const [logoutApiCall] = useLogoutMutation();
    const {data: projects} = useGetAllProjectsQuery<any>({keyword});
    const projectItems = projects?.items || [];

    const [openEdit, setOpenEdit] = useState(false);
    const [equipmentName, setEquipmentName] = useState<string>("");
    const [equipmentNumber, setEquipmentNumber] = useState<string>("");
    const [supplier, setSupplier] = useState<string>("");
    const [equipmentType, setEquipmentType] = useState<string>("");
    const [internalExternal, setInternalExternal] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [projectName, setProjectName] = useState<string>("");
    const [monthlyCost, setMonthlyCost] = useState<string>("");
    const newId = uuidv4();

    // Get data from Redux
    const {data: equipments} = useGetAllEquipmentsQuery<any>({keyword});
    const totalEquipments = equipments?.items?.length || 0;
    const totalEstimate = equipments?.items?.reduce((acc: any, item: any) => acc + Number(item.monthlyCost), 0) || 0;

    const totalEquipmentsThisMonth = equipments?.items?.filter((p: any) => {
        const equipmentDate = new Date(p.createdAt);
        const now = new Date();
        return (
            equipmentDate.getMonth() === now.getMonth() &&
            equipmentDate.getFullYear() === now.getFullYear()
        );
    }).length || 0;

    const equipmentItems = equipments?.items;
    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;

    const [searchTerm, setSearchTerm] = useState<string>("");


    const filterTheEquipments = equipmentItems?.filter((item: any) => item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Pagination Calculation
    const totalPages = Math.ceil(equipmentItems?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEquipments =  filterTheEquipments?.slice(indexOfFirstItem, indexOfLastItem);

    const [filterEquipments, setFilterEquipments] = useState(currentEquipments);

    // Handle Equipment Search
    const handleEquipmentSearch = (e: React.ChangeEvent<HTMLInputElement>)=> {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = equipmentItems?.filter((item: any) => {
            return item.equipmentName.toLowerCase().includes(term)
        });
        setFilterEquipments(filtered);
    }

    useEffect(() => {
        if (equipmentItems) {
            const filtered = searchTerm ? equipmentItems.filter((item: any) => item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())) : equipmentItems;
            setFilterEquipments(filtered);
        }
        setCurrentPage(1); // Reset Page if filter changes

    }, [equipmentItems, searchTerm]);

    // Pass a number in textfield
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const parsedValue = newValue === "" ? "" : parseFloat(newValue)

        if (!isNaN(parsedValue as number) || newValue === "") {
            // @ts-ignore
            setMonthlyCost(newValue as number);
        }
    }
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
    };

    // Add New Equipment
    const onCreateSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!userInfo) {
            toast.error("You must be logged in to list an Equipment");
            return;
        }

        try {
            // Create equipment JSON object
            const newEquipment = {
                id: newId,
                equipmentName: equipmentName,
                equipmentNumber: equipmentNumber,
                supplier: supplier,
                equipmentType: equipmentType,
                internalExternal: internalExternal,
                description: description,
                projectName: projectName,
                monthlyCost: parseInt(monthlyCost),
                userId: userId,
                createdAt: new Date().toISOString(),

            };
            await createEquipment(newEquipment).unwrap();
            toast.success("You successfully created Equipment");

            // Reset && Close
            setEquipmentName("");
            setEquipmentNumber("");
            setEquipmentType("");
            setSupplier("");
            setEquipmentType("");
            setInternalExternal("");
            setDescription("");
            setProjectName("");
            setMonthlyCost("");

            setOpenEdit(false);

        } catch (error: any) {
            toast.error(error.message || "Failed to create equipment");
        }

    };

    // Confirm if the user exists
    const requireAuth = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to create a equipment");
            return;
        }
        callback();
    };

    return (
        <>
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
                            <StackCard icon={ZapIcon} name={"Total Equipment Acquired"} value={totalEquipments} color={"#6366F1"}/>
                            <StackCard icon={DollarSignIcon} name={"Overall Equipment Cost"} value={totalEstimate}
                                       color={"#8B5CF6"}/>
                            <StackCard icon={CalendarIcon} name={"Equipment Added This Month"} value={totalEquipmentsThisMonth}
                                       color={"#8B5CF6"}/>
                        </div>

                        <div className={"flex flex-col sm:flex-row justify-between items-center gap-4 sm:items-center mb-6"}>
                            <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Equipment Stack</h2>
                            <div className='relative'>
                                {/* add todo for search*/}
                                <input
                                    type='text'
                                    onChange={handleEquipmentSearch}
                                    placeholder='Search...'
                                    className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-16 pr-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                <CiSearch className='absolute left-3 top-2.5 text-gray-400' size={18}/>
                            </div>

                            {/* Equipments */}
                            <button
                                onClick={() => requireAuth(() => setOpenEdit(true))}
                                className="flex items-center justify-center px-4 py-2 bg-[#30E0A5] text-black hover:text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                                <Plus size={18} className="mr-2"/>
                                Add Equipment
                            </button>

                            {/* Opening create equipment. Add requireAuth and wrap around setOpenEdit if there is no user logged in */}
                            {openEdit && userInfo && (
                                <div className={"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"}>
                                    <div className={"bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"}>
                                        <h2 className={"text-2xl font-semibold text-gray-900 mb-4"}>New Project</h2>
                                        <form className={"space-y-4"}
                                                onSubmit={onCreateSubmitHandler}>
                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Equipment Name:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={equipmentName}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Name"
                                                    onChange={(e) => setEquipmentName(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Equipment Number:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={equipmentNumber}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="#Equipment Number"
                                                    onChange={(e) => setEquipmentNumber(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Supplier:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={supplier}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Supplier"
                                                    onChange={(e) => setSupplier(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Monthly Cost:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={monthlyCost}
                                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Montly Fee"
                                                    onChange={handleNumberChange}
                                                />
                                            </div>

                                            <div>
                                                <label className={"block text-sm/6 font-medium text-gray-800"}>
                                                    Equipment Category
                                                </label>
                                                <div className={"mt-2 grid grid-cols-1"}>
                                                    <select
                                                            name={"equipmentType"}
                                                            value={equipmentType}
                                                            required={false}
                                                            onChange={(e) => setEquipmentType(e.target.value)}
                                                            className={"col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-800 outline outline-1 " +
                                                                "-outline-offset-1 outline-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-800 sm:text-sm/6"}
                                                    >
                                                        <option>--Select--</option>
                                                        <option>ForkLifts</option>
                                                        <option>Heavy Equipment</option>
                                                        <option>Excavators</option>
                                                        <option>Aerial Lifts & Boom Lifts</option>
                                                        <option>Mobile Office</option>
                                                        <option>Power Generation Equipment</option>
                                                        <option>Air Compressors && Air Tools</option>
                                                        <option>Drilling Equipment</option>
                                                        <option>Bobcat</option>
                                                        <option>Loader & Aid Steers</option>
                                                        <option>Telehandlers</option>
                                                        <option>Welder & Welding Equipment</option>

                                                    </select>
                                                    <ChevronDownIcon
                                                        aria-hidden={true}
                                                        className={"pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end text-gray-600 sm:size-5"}/>
                                                </div>
                                            </div>

                                            <div>
                                                <label className={"block text-sm/6 font-medium text-gray-800"}>
                                                    Internal or External Equipment
                                                </label>
                                                <div className={"mt-2 grid grid-cols-1"}>
                                                    <select
                                                        name={"internalExternal"}

                                                        value={internalExternal}
                                                        required={true}
                                                        onChange={(e) => setInternalExternal(e.target.value)}
                                                        className={"col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-800 outline outline-1 " +
                                                            "-outline-offset-1 outline-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-800 sm:text-sm/6"}
                                                    >
                                                        <option>--Select--</option>
                                                        <option>Internal</option>
                                                        <option>External</option>

                                                    </select>
                                                    <ChevronDownIcon
                                                        aria-hidden={true}
                                                        className={"pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end text-gray-600 sm:size-5"}/>
                                                </div>
                                            </div>

                                            <div>
                                                <label className={"block text-sm/6 font-medium text-gray-800"}>
                                                    Select Project
                                                </label>
                                                <div className={"mt-2 relative"}>
                                                    <select
                                                        name={"projectName"}
                                                        value={projectName}
                                                        onChange={(e) => setProjectName(e.target.value)}
                                                        className={"w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-800 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-800" }>
                                                        <option value={""}>Select a Project</option>
                                                        {projectItems?.map((project: any) => (
                                                            <option key={project.id} value={project.projectname}>
                                                                {project.projectname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDownIcon
                                                        aria-hidden={true}
                                                        className="pointer-events-none absolute right-2 top-2.5 size-5 text-gray-600"
                                                    />
                                                </div>

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
                            <DownloadEquipmentCSVbutton />

                        </div>

                        {/* Projects Table */}
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
                                            </td>


                                        </tr>
                                    ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination Button */}
                        <div className={"flex justify-center space-x-2 mt-4"}>
                            <button onClick={() => setCurrentPage((prev) => Math.max(prev -1, 1))}
                                className={"px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-600"}
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
        </>
    )
}
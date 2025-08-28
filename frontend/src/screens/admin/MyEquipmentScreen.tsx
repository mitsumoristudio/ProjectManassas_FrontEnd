import React, {useState, useEffect} from "react";
import { MoreVertical, ZapIcon, DollarSignIcon, TrashIcon} from 'lucide-react';
import SideBar from "../../components/SideBar";
import {useNavigate, useParams} from "react-router-dom";
import StackCard from "../../components/StackCard";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import DashboardHeader from "../../components/DashBoardHeader";
import CustomLoader from "../../components/CustomLoader";
import {Helmet} from "react-helmet";
import {motion} from "framer-motion";
import {useGetEquipmentByIdQuery, useDeleteEquipmentMutation} from "../../features/equipmentApiSlice";
import {CiSearch} from "react-icons/ci";
import DownloadProjectCSVbutton from "../../components/DownloadProjectCSVbutton";

export default function MyEquipmentScreen() {
    const {id}= useParams();
    const {userInfo} = useSelector((state: any) => state.auth);
    const userId = userInfo?.id;

    const {data: equipments, isLoading, isError, refetch} = useGetEquipmentByIdQuery<any>(id);
    const [deleteEquipment] = useDeleteEquipmentMutation();


    const [filterEquipments, setFilterEquipments] = useState(equipments);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Handle Equipment Search
    const handleEquipmentSearch = (value: string) => {
        const term = value.trim().toLowerCase();
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


                </motion.div>
            )}
        </>
    )
}
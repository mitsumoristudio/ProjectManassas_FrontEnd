
import {useGetAllEquipmentsQuery} from "../../../features/equipmentApiSlice";
import {useParams} from "react-router-dom";
import {FileBarChart} from "lucide-react";
import React from "react";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

export const DownloadEquipmentCSVbutton = () => {
    const {keyword} = useParams();
    const {data: equipments} = useGetAllEquipmentsQuery<any>({keyword});
    const {userInfo} = useSelector((state: any) => state.auth);

    // Confirm if the user exists
    const requireAuth = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }
        callback();
    }

    // Download CSV File
    const downloadCSV_File = () => {
        if (!equipments?.items?.length) {
            return;
        }
        // Define CSV Headers
        const csvHeader = [
            "Equipment Name",
            "Equipment Number",
            "Supplier",
            "External/Internal",
            "Category",
            "Monthly Cost",
            "Project",
            "Created At",
        ];
        // Map project data to CSV rows
        const csvRows = equipments?.items?.map((row: any) => [
            row.equipmentName,
            row.equipmentNumber,
            row.supplier,
            row.internalExternal,
            row.equipmentType,
            row.monthlyCost,
            row.projectName,
            new Date(row.createdAt).toLocaleDateString(),
        ]);
        // Combine header and rows into CSV string
        const csvConstant = [csvHeader, ...csvRows].map((row: any) => row.join(",")).join('\n');

        // Create a blob and trigger download
        const blob = new Blob([csvConstant], {type: "text/csv;charset=utf-8"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "equipments.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            {/* Download CSV file */}
            <button
                onClick={() => requireAuth(() => downloadCSV_File())}
                className="flex items-center justify-center px-4 py-2 bg-[#30E0A5] text-black hover:text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                <FileBarChart size={18} className="mr-2"/>
                Download CSV
            </button>
        </>
    )
}
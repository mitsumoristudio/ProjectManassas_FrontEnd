
import {useGetAllProjectsQuery} from "../../../features/projectApiSlice";
import {useParams } from "react-router-dom";
import {FileBarChart} from "lucide-react";
import React from "react";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

const DownloadProjectCSVbutton = () => {
    const {keyword} = useParams();
    const {data: projects} = useGetAllProjectsQuery<any>({keyword});
    const {userInfo} = useSelector((state: any) => state.auth);

    // Download CSV File
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

    // Confirm if the user exists
    const requireAuth = (callback: () => void) => {
        if (!userInfo) {
            toast.error("You must be logged in to create a project");
            return;
        }
        callback();
    }

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

export default DownloadProjectCSVbutton;

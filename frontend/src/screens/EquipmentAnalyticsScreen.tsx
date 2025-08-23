
import {
    Plus,
    FileBarChart,
    DollarSignIcon,
    ShoppingCartIcon, ZapIcon,
} from "lucide-react";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import StackCard from "../components/StackCard";
import {useNavigate, useParams} from "react-router-dom";
import {useGetAllEquipmentsQuery} from "../features/equipmentApiSlice";
import {useSelector} from "react-redux";

import DashboardHeader from "../components/DashBoardHeader";
import PieChartComponent from "../components/PieChartComponent";

export default function EquipmentAnalyticsScreen() {
    const navigate = useNavigate();
    const {keyword} = useParams();
    const {data: equipments} = useGetAllEquipmentsQuery<any>({keyword});

    // Calculated Equipment Cost
    const totalEquipments = equipments?.items?.length || 0;
    const totalEstimate = equipments?.items?.reduce((acc: any, item: any) => acc + Number(item.monthlyCost), 0) || 0;

    // Prepare Pie Chart data set for Equipment Category breakdown
    const pieCategoryData = equipments?.items?.reduce((acc : any[], item: any) => {
        const existingData = acc.find((e) => e.name === item.equipmentType);
        if (existingData) {
            existingData.value += 1;
        } else {
            acc.push({name: item.equipmentType || "Unknown Category", value: 1});
        }
        return acc;
    }, [])

    // PieChart to calculate monthly cost per category
    const pieMonthlyCost = equipments?.items?.reduce((acc: any[], item: any) => {
        const existingData = acc.find((e: any) => e.name === item.equipmentType);
        if (existingData) {
            existingData.value += item.monthlyCost || 0;
        } else {
            acc.push({name: item.equipmentType, value: item.monthlyCost || 0 });
        }
        return acc;
    }, [])


    // Internal vs External Pie Chart Data
    const pieInternalExternalData = equipments?.items?.reduce((acc : any[], item: any) => {
        const existingData = acc.find((e: any) => e.name === item.internalExternal);
        if (existingData) {
            existingData.value += 1;
        } else {
            acc.push({name: item.internalExternal || "Unknown Category", value: 1});
        }
        return acc;
    }, [])

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
                            <StackCard icon={ZapIcon} name={"Total Equipment"} value={totalEquipments} color={"#6366F1"}/>
                            <StackCard icon={DollarSignIcon} name={"Overall Equipment Cost"} value={totalEstimate}
                                       color={"#8B5CF6"}/>
                        </div>



                        <div className={"grid grid-cols-2 md:grid-cols-2 gap-6 mb-8 p-6 py-3"}>
                            <div className={"p-6 bg-[#101010] rounded-lg border border-gray-800"}>
                                <h2 className={"text-lg font-semibold text-gray-300 mb-4"}>Equipment Count By Category</h2>

                                <PieChartComponent data={pieCategoryData} />

                            </div>

                            <div className={"p-4 bg-[#101010] rounded-lg border border-gray-800"}>
                                <h2 className={"text-lg font-semibold text-gray-300 mb-4"}>Monthly Equipment Cost</h2>

                                <PieChartComponent data={pieMonthlyCost} />

                            </div>


                        </div>

                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"}>

                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}
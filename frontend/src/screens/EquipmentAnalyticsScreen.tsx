
import {
    DollarSignIcon,
     ZapIcon,
} from "lucide-react";

import React from "react";
import SideBar from "../components/SideBar";
import StackCard from "../components/StackCard";
import {useNavigate, useParams} from "react-router-dom";
import {useGetAllEquipmentsQuery} from "../features/equipmentApiSlice";


import DashboardHeader from "../components/DashBoardHeader";
import PieChartComponent from "../components/PieChartComponent";
import {LineChartComponent} from "../components/LineChartComponent";

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

    // LineChart monthly cost
    const monthlyCostMap = new Map<string, { date: Date; value: number }>();

    equipments?.items?.forEach((item: any) => {
        const date = new Date(item.createdAt);

        // Normalize to year + month index (YYYY-MM)
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        const current = monthlyCostMap?.get(monthKey)?.value || 0;
        monthlyCostMap?.set(monthKey, {
            date: new Date(date.getFullYear(), date.getMonth(), 1), // always first day of month
            value: current + (item.monthlyCost || 0),
        });
    });

// Convert Map → Array
    let monthlyCostData = Array.from(monthlyCostMap, ([, { date, value }]) => ({
        name: date.toLocaleString("default", { month: "short", year: "numeric" }),
        value,
        date, // keep real date for sorting
    }));

// Sort by real Date
    monthlyCostData?.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Internal vs External Pie Chart Data
    // const pieInternalExternalData = equipments?.items?.reduce((acc : any[], item: any) => {
    //     const existingData = acc.find((e: any) => e.name === item.internalExternal);
    //     if (existingData) {
    //         existingData.value += 1;
    //     } else {
    //         acc.push({name: item.internalExternal || "Unknown Category", value: 1});
    //     }
    //     return acc;
    // }, [])

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

                                <PieChartComponent data={pieCategoryData || []} />

                            </div>

                            <div className={"p-4 bg-[#101010] rounded-lg border border-gray-800"}>
                                <h2 className={"text-lg font-semibold text-gray-300 mb-4"}>Monthly Equipment Cost</h2>

                                <PieChartComponent data={pieMonthlyCost || []} />

                            </div>
                        </div>

                        <div className={"p-6 mx-auto py-2"}>
                            <div className={"p-4 bg-[#101010] rounded-lg border border-gray-800 mb-8"}>
                                <h2 className={"text-lg font-semibold text-white mb-2"}>Monthly Cost Trend</h2>
                                <LineChartComponent data={monthlyCostData || []} color={"#10b981"}/>
                            </div>

                        </div>




                    </main>

                </div>
            </div>
        </>
    )
}
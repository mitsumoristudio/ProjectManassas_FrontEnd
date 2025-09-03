
import React from "react";
import {Helmet} from "react-helmet";
import SideBar from "../components/Layout/SideBar";
import {useParams} from "react-router-dom";
import DashboardHeader from "../components/Layout/DashBoardHeader";
import {BarChartGraph} from "../components/Layout/Graph & Tables/BarChartGraph";
import {useGetAllProjectsQuery} from "../features/projectApiSlice";
import CustomLoader from "../components/Layout/CustomLoader";
import {motion} from "framer-motion";


export default function ProjectAnalyticsScreen() {
    const {keyword} = useParams();
    const {data: projects, isLoading, isError} = useGetAllProjectsQuery<any>({keyword});
    const projectItems = projects?.items;

    const chartData = projectItems?.map((p: any) => ({
        name: p.projectname,
        estimate: p.projectestimate,
    })) || [];

    return (
        <>
            <Helmet>
                <title>Project Analytic</title>
                <meta name="description" content="Project Analytics Page" />
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
                            <DashboardHeader/>

                            <div className={"p-6 mx-auto py-2 w-full"}>
                                <div className={"p-4 bg-[#101010] rounded-lg border h-full border-gray-800 mb-8"}>
                                    <h2 className={"text-lg font-semibold text-white mb-2"}>Project Scope</h2>
                                    <BarChartGraph data={chartData} title={"Project Estimates"} />

                                </div>

                            </div>


                        </div>
                    </div>

                </motion.div>
            )}
        </>
    )
}
import {
    Share2,
    ArrowLeftFromLine,
} from "lucide-react";
import React, {useEffect, useState, useRef} from "react";
import SideBar from "../../../../components/Layout/Graph & Tables/SideBar";
import {assets} from "../../../../assets/assets";
import {useSelector } from "react-redux";
import PlayWrightChatInput from "../PlayWrightQueryChat/PlayWrightChatInput";

import {
    useGetPlayWrightProjectbyIdQuery,
    useGetPlayWrightQueryListQuery,
  } from "../../../../features/playwrightApiSlice";

import {useParams, NavLink} from "react-router-dom";


import {PdfListTable} from "./PdfListTable";
import {RecentQueries} from "./RecentQueries";
import {ExcelListTable} from "./ExcelListTable";

// ================= Main DashBoard =================
export function PlayWrightQueryDashboard() {

    const textRef = useRef<HTMLHeadingElement>(null);
    const {userInfo} = useSelector((state: any) => state.auth);
    const [inputValue, setInputValue] = useState("");

    const {id} = useParams();
    const projectId = String(id);
    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId);

    const {
        data: playWrightQuery,
        isLoading: isPlayWrightLoading,
        isError: isPlayWrightError,
        refetch,
    } = useGetPlayWrightQueryListQuery(projectId);

    const [showSlideIn, setShowSlideIn] = useState(false);

    useEffect(() => {
        setShowSlideIn(true);
    }, []);


    const onSubmitHandler = (message: string) => {
        console.log("message", message);
        setInputValue("");
    }

    const [tabularOrSingleQuery, setTabularOrSingleQuery] =
        useState<"tabular-review" | "single-query-review" | "single-search" | "Excel-Review">(
            "tabular-review"
        );

    // @ts-ignore
    return (
        <main>
            <div className="flex h-screen font-sans">

                {/*================= SideBar ================= */}
                <SideBar/>

                <div className="flex-1 p-6 overflow-y-auto">

                    {/*================= Header ================= */}
                    <div className="flex flex-1 items-center py-1 cursor-pointer hover:bg-gray-200 rounded-lg w-56">
                        <NavLink
                            to="/playbookProject"
                            className="flex items-center gap-4 text-gray-700 font-sans"
                        >
                            <ArrowLeftFromLine size={20} />
                            <span>PlayWright Project /</span>
                        </NavLink>
                    </div>

                    <div className="flex justify-between items-center mb-6">

                        <div>
                            <h1 className="text-2xl font-semibold">{projectData?.projectName || "Project Not Found"}</h1>
                            <p className="text-sm text-gray-500">
                                {playWrightQuery?.length ?? "None:"} Total Queries
                            </p>
                        </div>

                        <button className="flex items-center gap-2 border px-3 py-2 rounded-xl">
                            <Share2 size={16} /> Share
                        </button>
                    </div>

                    {/*================= ChatInput ================= */}
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="flex-col items-center w-full max-w-4xl relative px-0 xl:px-8">

                                {/*Header & UserName*/}
                                <div className={`flex flex-row transform transition-all duration-1000 ease-out ${showSlideIn ? "translate-x-0 opacity-100" : "translate-x-full opacity-0" } gap-x-4 items-center justify-center mb-1 space-y-1`}>
                                    <img
                                        alt=""
                                        src={assets.mori_solution_logo2}
                                        className="h-12 w-12 rounded-3xl shadow-md"
                                    />

                                    <h1
                                        ref={textRef}
                                        className="text-4xl font-serif font-light text-gray-900 text-center "
                                    >
                                        Hello, {userInfo?.userName?.split(' ')[0]}
                                    </h1>
                                </div>

                                {/* Chat Input */}
                                <PlayWrightChatInput
                                    onSend={onSubmitHandler}
                                    value={inputValue}
                                    onChange={setInputValue}
                                    onQueryTypeChange={setTabularOrSingleQuery}
                                />

                                <div className="text-center">
                                    <p className="text-sm py-3 mb-3 text-gray-500">
                                        AI can make mistakes. Answers are for the purpose of construction compliance.
                                    </p>
                                </div>
                            </div>

                    </div>
                    {/*================= Recent Query ================= */}
                    <RecentQueries data={playWrightQuery} refetch={refetch}
                                   tabularOrSingleQuery={tabularOrSingleQuery}
                                   isPlayWrightError={isPlayWrightError} />

                    {isPlayWrightLoading && (
                        <>
                            <div className="flex space-x-2 gap-x-1 justify-center items-center bg-white">
                                <span className="sr-only text-black">Loading...</span>
                                <div
                                    className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div
                                    className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-1 w-1 bg-blue-600 rounded-full animate-bounce"></div>
                            </div>
                        </>
                    )}

                    {/*================= Ingested PDF Files ================= */}
                    <PdfListTable  />

                    {/*================= Ingested Excel Files ================= */}
                    <div className={"gap-y-2 p-2 mx-auto"}>
                        <ExcelListTable />
                    </div>

                </div>
            </div>
        </main>
    )
}


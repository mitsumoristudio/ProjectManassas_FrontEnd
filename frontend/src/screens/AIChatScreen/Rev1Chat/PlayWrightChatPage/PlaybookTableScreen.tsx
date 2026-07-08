import React from "react";
import {
    Search,
    Share2,
    Filter,
    Columns,
    Download,
    ArrowLeftFromLine
} from "lucide-react"
import SideBar from "../../../../components/Layout/Graph & Tables/SideBar";
import {useParams, NavLink} from "react-router-dom";
import {
    useFetchPlayWrightQueryListByIdQuery,
    useGetPlayWrightProjectbyIdQuery,
    useGetPlayWrightQuerybyIdQuery,
} from "../../../../features/playwrightApiSlice";

import {useSelector} from "react-redux";
import PlayWrightTable from "../../../AIChatScreen/Rev1Chat/PlayWrightChatPage/PlayWrightTable";


// ================= Table =================

export default function PlaybookTableScreen() {

    const {id} = useParams();

    const {data: queryData} = useGetPlayWrightQuerybyIdQuery<any>(id);

    const projectId = queryData?.playWrightProjectId;

    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId, {
        skip: !projectId,
    });

    const {userInfo} = useSelector((state: any) => state.auth);

    const {data: playWrightQueryData} = useFetchPlayWrightQueryListByIdQuery<any>(userInfo?.id);

    return (
        <>
            <div className="flex h-screen bg-gray-50 font-sans">
                {/*================= SideBar ================= */}
                <SideBar/>

                <div className="flex-1 p-6 overflow-y-auto">

                    {/*================= Navigation Header ================= */}
                    <div className="flex flex-1 items-center py-1 cursor-pointer hover:bg-gray-200 rounded-lg w-56">
                        <NavLink
                            to={`/playbookProject/playWrightQuery/${projectId}`}
                            className="flex items-center gap-4 text-gray-700 font-sans"
                        >
                            <ArrowLeftFromLine size={20} />
                            <span>PlayWright Query/</span>
                        </NavLink>
                    </div>

                    {/*================= Sub Header ================= */}
                    <div className="px-4 py-3 border-b bg-white">
                        <h1 className="text-2xl font-semibold">{projectData?.projectName || "Project Not Found"}</h1>
                    </div>
                    {/*================= Feature ================= */}
                    <div className="flex items-center justify-between border-b px-4 py-2 bg-white">
                        <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1"><Search size={14}/> Ask Mori</button>
                            <button className="flex items-center gap-1"><Filter size={14}/> Filter</button>
                            <button className="flex items-center gap-1"><Columns size={14}/> Manage columns</button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="border px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Share2 size={14}/> Share</button>
                            <button className="border px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Download size={14}/> Export</button>
                        </div>
                    </div>

                    <PlayWrightTable rows={playWrightQueryData}  />

                </div>
            </div>
        </>
    )
}
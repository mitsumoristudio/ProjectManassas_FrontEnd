import { Search, Folder, FileText, Clock, Plus, Share2, ArrowLeftFromLine, EllipsisIcon } from "lucide-react";
import React, {useEffect, useState, useRef} from "react";
import SideBar from "../../../components/Layout/Graph & Tables/SideBar";
import {assets} from "../../../assets/assets";
import {useSelector, useDispatch, } from "react-redux";

import PlayWrightChatInput from "./PlayWrightChatInput";
import {useSendDocumentEmbeddingMutation,
    useGetPdfIngestedQuery
} from "../../../features/chatapiSlice";
import {
    useGetPlayWrightProjectbyIdQuery,
  } from "../../../features/playwrightApiSlice";
import {
    useGetPlayWrightQueryListQuery,
    useAddPlayWrightQueryMutation,
    useDeletePlayWrightQueryMutation,
} from "../../../features/playwrightApiSlice";

import {useParams, useNavigate, NavLink} from "react-router-dom";


// ================= Recent Queries =================
export function RecentQueries({ data }) {

    const {userInfo} = useSelector((state: any) => state.auth);

    return (
        <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Recent queries</h2>
            <div className="bg-white rounded-2xl divide-y">
                {data?.map((q, i) => (
                    <div key={i} className="flex justify-between p-4 text-sm text-gray-700 hover:bg-gray-200 rounded ease-in-out transition duration-700 font-sans">
                        <div className={"flex items-center cursor-pointer"}>
                            <div className="font-medium">{q.projectQueryTitle}</div>

                        </div>
                                <div className={"font-sans text-gray-700 text-sm"}>Tabular Review</div>

                        <div className="text-right text-gray-500">
                            <div>{userInfo?.email}</div>
                            <div className="flex items-center gap-1 justify-end">
                                <Clock size={14} /> {new Date(q.createdAt).toLocaleDateString(
                                "en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ================= Files Table =================
export function FilesTable() {
    const {keyword} = useParams();

    const {
        data: pdfs = [],
        isLoading: isPdfLoading,
        isError: isPdfError,
        refetch
    } = useGetPdfIngestedQuery({keyword});

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium mb-3">Project files</h2>
                <input
                    className="border px-3 py-1 rounded-lg text-sm"
                    placeholder="Search"
                />
            </div>

            <div className="bg-white rounded-2xl overflow-hidden">
                <table className="w-full text-sm scroll-auto">
                    <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Last modified</th>
                        <th className="text-left p-3">More</th>

                    </tr>
                    </thead>
                    <tbody>
                    {pdfs?.map((file: any, i: number) => (
                        <tr key={i} className="border-t hover:bg-gray-50 cursor-pointer">
                            <td className="p-3 flex items-center gap-2">
                                {file.type === "Folder" ? (
                                    <Folder size={16} />
                                ) : (
                                    <FileText size={16} />
                                )}
                                {file.originalFileName}
                            </td>
                            <td className="p-3">PDF</td>
                            <td className="p-3">{new Date(file.createdAt).toLocaleDateString(
                                "en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            )}</td>
                            <td className="p-3">
                                <EllipsisIcon size={12} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function PlayWrightQueryDashboard() {

    const textRef = useRef<HTMLHeadingElement>(null);
    const {userInfo} = useSelector((state: any) => state.auth);
    const [inputValue, setInputValue] = useState("");

    const {id} = useParams();
    const {keyword} = useParams();
    const projectId = String(id);
    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId);

    const {
        data: playWrightQuery,
        isLoading: isPlayWrightLoading,
        isError: isPlayWrightError,
        refetch,
    } = useGetPlayWrightQueryListQuery({keyword});


    const onSubmitHandler = (message: string) => {
        console.log("message", message);
        setInputValue("");
    }

    const recentQueries = [
        {
            title: "Contracts with Change of Control Provisions",
            type: "Review table",
            user: "akumar@whitfordlane.com",
            time: "10 minutes ago",
        },
        {
            title: "Commercial Contract Review",
            type: "Review table",
            user: "jsmith@whitfordlane.com",
            time: "4 hours ago",
        },
        {
            title: "Clarification on Effective Date Inquiry",
            type: "Review table",
            user: "rwilliams@whitfordlane.com",
            time: "12 hours ago",
        },
    ];

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
                            <h1 className="text-2xl font-semibold">{projectData?.projectName || "Commercial Construction Contract"}</h1>
                            <p className="text-sm text-gray-500">
                                100 queries
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
                                <div className="flex flex-row gap-x-4 items-center justify-center mb-1 space-y-1">
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
                                />

                                <div className="text-center">
                                    <p className="text-sm py-3 mb-3 text-gray-500">
                                        AI can make mistakes. Answers are for the purpose of construction compliance.
                                    </p>
                                </div>
                            </div>


                    </div>
                    {/*================= Recent Query ================= */}
                    <RecentQueries data={playWrightQuery} />





                    {/*================= Ingested Files ================= */}
                    <FilesTable  />
                </div>
            </div>
        </main>
    )
}


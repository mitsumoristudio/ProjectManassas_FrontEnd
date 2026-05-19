import React, { useRef, useState } from "react";
import SideBar from "../../../components/Layout/Graph & Tables/SideBar";
import {useSelector, useDispatch, } from "react-redux";
import {useParams, useNavigate, NavLink} from "react-router-dom";
import {
    useGetPlayWrightProjectbyIdQuery,
    useGetPlayWrightQuerybyIdQuery,
} from "../../../features/playwrightApiSlice";
import {ArrowLeftFromLine} from "lucide-react";

export default function SinglePlayQueryScreen() {
    const {id} = useParams();
    const [selectedClause, setSelectedClause] = useState(null);

    const {data: queryData,
                isLoading,
                isError,
                refetch} = useGetPlayWrightQuerybyIdQuery<any>(id);


    const projectId = queryData?.playWrightProjectId;

    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId, {
        skip: !projectId,
    });

    const riskStyles = {
        low: "bg-green-100 text-green-700 border-green-200",
        medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
        high: "bg-red-100 text-red-700 border-red-200",
    };

    const RiskBadge = ({ level }) => {
        if (!level) return null;

        const style = riskStyles[level.toLowerCase()] || "bg-gray-100 text-gray-600";

        return (
            <span className={`px-2 py-2 text-lg rounded-md border font-medium ${style}`}>
      {level}
    </span>
        );
    };

    return (
        <main>
            <div className={"flex h-screen bg-gray-50 font-sans"}>
                {/*================= SideBar ================= */}
                <SideBar/>

                <div className={"flex-1 p-6 overflow-y-auto"}>


                    <div className={"flex flex-1 items-center py-1 cursor-pointer hover:bg-gray-200 rounded-lg w-56"}>
                        <NavLink
                            to={`/playbookProject/playWrightQuery/${projectId}`}
                            className="flex items-center gap-4 text-gray-700 font-sans"
                        >
                            <ArrowLeftFromLine size={20} />
                            <span>PlayWright Query/</span>
                        </NavLink>
                    </div>


                        <section>
                            {queryData && (
                                <div>
                                    <h2 className={"text-3xl mx-auto py-1 font-medium"}>Response: {queryData.analysisType} </h2>

                                    <div className={`flex flex-1 items-center py-1`}>

                                        {/* Content */}
                                        <div className="p-4 overflow-y-auto">
                                            {queryData?.clauses.map((item, i) => (
                                                <div key={i}>
                                                    <h2 className={"font-semibold underline font-serif text-2xl py-2 text-black"}>{item.clauseName}</h2>

                                                    <h2 className={"font-sans text-2xl py-2 text-gray-800"}>Short:</h2>

                                                    <p className="text-sm leading-relaxed">
                                                        * {item.summaryShort}
                                                    </p>

                                                    <h2 className={"font-sans text-2xl py-2 text-gray-800"}>Long:</h2>

                                                    <p className="text-sm leading-relaxed">
                                                        * {item.summaryLong}
                                                    </p>

                                                    <p className="font-semibold font-serif text-2xl py-2 text-black capitalize">
                                                        <strong className={"px-1"}>Risk:</strong>

                                                        <RiskBadge level={item.riskLevel} />
                                                    </p>

                                                    <p className="font-sans text-1xl py-2 text-gray-800">
                                                        <strong className={"gap-x-1"}>Source Page:</strong> {item.sourcePage}
                                                    </p>

                                                </div>
                                            ))}




                                        </div>
                                    </div>
                                </div>
                            )}

                        </section>
                </div>

            </div>

        </main>
    )
}
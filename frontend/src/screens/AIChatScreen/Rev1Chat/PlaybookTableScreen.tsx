import React, {useEffect, useState, useRef} from "react";
import {
    Search,
    FileText,
    Share2,
    Filter,
    Columns,
    Download,
    ArrowLeftFromLine
} from "lucide-react"
import SideBar from "../../../components/Layout/Graph & Tables/SideBar";
import {assets} from "../../../assets/assets";
import {useSelector, useDispatch, } from "react-redux";
import {useParams, useNavigate, NavLink} from "react-router-dom";
import {
    useGetPlayWrightProjectbyIdQuery,
    useGetPlayWrightQuerybyIdQuery, useGetPlayWrightQueryListQuery,
} from "../../../features/playwrightApiSlice";

// ================= Sidebar =================

// ================= Top Toolbar =================
function DataToolbar() {
    return (
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
    );
}

// ================= Table =================

function PlayWrightTable({rows}) {
    const [selectedClause, setSelectedClause] = useState(null);

    const { id } = useParams();

    const getClause = (clauses, key) => {
        return clauses.find((c) => c.clauseKey === key);
    };

    const [activeType, setActiveType] = useState("Project Analysis");

    const filterRows = rows?.filter(r => r.analysisType == activeType);

    // 🔑 central config (no more hardcoding columns everywhere)
    const columnsAnalyst = [
        { key: "change_of_control_provision", label: "Change of Control Provision" },
        { key: "scope_of_work", label: "Scope Of Work" },
        { key: "indemnification", label: "Indemnification" },
        { key: "timeline", label: "TimeLine" },
        { key: "change_order", label: "Change Order" },
        { key: "liability", label: "Liability" },
        { key: "warranties", label: "Warranties" },
        { key: "parties_involved", label: "Parties Involved" },
        { key: "red_flag", label: "Red Flags" },
        { key: "termination_conditions", label: "Termination Condition" },
        { key: "payment_terms", label: "Payment Terms" },
    ];

    const columnsByToolType = {
        "Project Analysis": [
            { key: "change_of_control_provision", label: "Change of Control Provision" },
            { key: "scope_of_work", label: "Scope Of Work" },
            { key: "indemnification", label: "Indemnification" },
            { key: "timeline", label: "TimeLine" },
            { key: "change_order", label: "Change Order" },
            { key: "liability", label: "Liability" },
            { key: "warranties", label: "Warranties" },
            { key: "parties_involved", label: "Parties Involved" },
            { key: "red_flag", label: "Red Flags" },
            { key: "termination_conditions", label: "Termination Condition" },
            { key: "payment_terms", label: "Payment Terms" },],

        "Specification Review": [
            { key: "closeout_requirements", label: "Closeout Requirements" },
            { key: "delay_notice_requirements", label: "Delay Notice Requirements" },
            { key: "claims_and_damage_handling", label: "Claims And Damage Handling" },
            { key: "submittal_requirements", label: "Submittal Requirements" },
            { key: "approved_materials_and_substitutions", label: "Approved Materials And Substitutions" },
            { key: "site_conditions_risk", label: "Site Conditions Risk" },
            { key: "installation_requirements", label: "Installation Requirements" },
            { key: "safety_requirements", label: "Safety Requirements" },
            { key: "repair_and_correction_obligations", label: "Repair And Correction Obligations" },
            { key: "quality_requirements", label: "Quality Requirements" },
            { key: "quantity_and_payment_risk", label: "Quantity And Payment Risk" },
            { key: "integration_responsibilities", label: "Integration Responsibilities" },
            { key: "traffic_and_access_requirements", label: "Traffic And Access Requirements" },
            { key: "temporary_works_and_facilities", label: "Temporary Works And Facilities" },
            { key: "testing_and_commissioning", label: "Testing And Commissioning" },
            { key: "contractor_obligations", label: "Contractor Obligations" },
        ],
        "Project Advisor": [
            { key: "labor_assumptions", label: "Labor Assumptions" },
            { key: "unit_price_reasonableness", label: "Unit Price Reasonableness" },
            { key: "risk_allocation_contingency", label: "Risk Allocation Contingency" },
            { key: "scope_completeness", label: "Scope Completeness" },
            { key: "bid_strategy", label: "Bid Strategy" },
            { key: "cost_structure_transparency", label: "Cost Structure Transparency" },
            { key: "schedule_feasibility", label: "Schedule Feasibility" },
            { key: "subcontractor_coverage", label: "Subcontractor Coverage" },
            { key: "contract_terms", label: "Contracts Terms" },
            { key: "material_pricing", label: "Material Pricing" },
        ],
    };

    const columnsPicker = columnsByToolType[activeType] || [];

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


    // ✅ reusable cell (this is the key part)
    const ClauseCell = ({ clause }) => (
        <td className="p-2 max-w-[220px] align-top">
            <div className="h-28 overflow-hidden line-clamp-4 break-words whitespace-normal"
                onClick={() => setSelectedClause(clause)}>
                {clause?.summaryShort || "-"}
            </div>
        </td>
    );

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex gap-2 mb-4">
                {Object.keys(columnsByToolType).map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-3 py-1 rounded-md text-sm border transition
        ${activeType === type
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <table className="min-w-[1200px] table-fixed border-separate border-spacing-y-2 text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b text-gray-700 border-r">
                <tr className={"bg-white border-b border-gray-200 border-r border-gray-200 hover"}>
                    <th className="p-2 text-left whitespace-nowrap w-10">#</th>
                    <th className="p-2 text-left whitespace-nowrap w-48">File Name</th>
                    <th className="p-2 text-left whitespace-nowrap w-48">Prompt</th>

                    {columnsPicker?.map((col) => (
                        <th key={col.key} className="p-2 text-left w-56 whitespace-nowrap">
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {filterRows?.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-gray-300 duration-700 rounded-xl cursor-pointer">
                        <td className="p-2 max-w-[220px]">{i + 1}</td>

                        <td className="p-1 flex items-center gap-2">
                            <FileText size={14} />
                            {r.originalFileName}
                        </td>

                        <td className={"p-1 max-w-[220px]"}>{r.projectQueryTitle}</td>

                        {columnsPicker?.map((col) => {
                            const clause = getClause(r.clauses, col.key);

                            return (
                                <ClauseCell
                                    key={col.key}
                                    clause={clause}
                                />
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedClause && (
                <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl opacity-95 border-l z-50 transform transition-transform duration-300 ${
                    selectedClause ? "translate-x-0" : "translate-x-full"
                }`}>

                    {/* Header */}
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold text-lg">
                            {selectedClause.clauseName}
                        </h2>
                        <button
                            onClick={() => setSelectedClause(null)}
                            className="text-gray-600 hover:text-black"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto">
                        <h2 className={"font-semibold font-serif text-2xl py-2 text-black"}>Short:</h2>
                        <p className="text-sm leading-relaxed">
                            {selectedClause.summaryShort}
                        </p>

                        <h2 className={"font-semibold font-serif text-2xl py-2 text-black"}>Long:</h2>
                        <p className="text-sm leading-relaxed">
                            {selectedClause.summaryLong}
                        </p>

                        <p className="font-semibold font-serif text-2xl py-2 text-black capitalize">
                            <strong className={"px-1"}>Risk:</strong>

                            <RiskBadge level={selectedClause.riskLevel} />

                        </p>

                        <p className="font-medium font-serif text-2xl py-2 text-black ">
                            <strong className={"gap-x-1"}>Source Page:</strong> {selectedClause.sourcePage}
                        </p>

                    </div>
                </div>
            )}

        </div>
    );
}

// ================= Page =================
export default function PlaybookTableScreen() {

    const {id} = useParams();

    const {playWrightQueryId} = useParams();

    const {data: queryData} = useGetPlayWrightQuerybyIdQuery<any>(id);

    const projectId = queryData?.playWrightProjectId;

    const {data: projectData} = useGetPlayWrightProjectbyIdQuery<any>(projectId, {
        skip: !projectId,
    });

    const {data: playWrightQueryData} = useGetPlayWrightQueryListQuery<any>(playWrightQueryId);

    return (
        <>
            <div className="flex h-screen bg-gray-50 font-sans">
                {/*================= SideBar ================= */}
                <SideBar/>

                <div className="flex-1 p-6 overflow-y-auto">

                    {/*================= Navigation Header ================= */}
                    <div className="flex flex-1 items-center py-1 cursor-pointer hover:bg-gray-200 rounded-lg w-56">
                        <NavLink
                            to={`/playbookProject/playWrightQuery/${projectId}}`}
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

                    <PlayWrightTable rows={playWrightQueryData} />

                    {/*<DataTable rows={rows} />*/}
                </div>
            </div>
        </>
    )
}
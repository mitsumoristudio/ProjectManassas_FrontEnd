
import React, { useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useGetExcelIngestedFilesQuery, useDeleteExcelIngestedFilesMutation} from "../../src/features/chatapiSlice";
import {toast} from "react-toastify";


export function ExcelCard() {

    const { keyword } = useParams<{ keyword?: string }>();
    const navigate = useNavigate();

    const {
        data: excels = [],
        isLoading: isExcelLoading,
        isError: isExcelError,
    } = useGetExcelIngestedFilesQuery({keyword});

    const [deleteExcelFile, {isloading: isDeleting}] = useDeleteExcelIngestedFilesMutation();

    // Delete Excel File
    const deleteExcelHandler = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this Excel document now?")) {
            try {
                await deleteExcelFile(id).unwrap();

                toast.success("Excel document deleted successfully.");

            } catch (error) {
                toast.error("Problem with deleting this Excel document.");
            }
        }
    }

    return (
        <main>
            <div className={"fixed inset-0 z-50 flex items-center justify-center bg-black/40"}>
                <div className={"bg-white rounded-2xl shadow-xl w-full max-w-md p-6 scroll-auto"}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Imported Excel Files
                        </h2>
                        <button
                            onClick={() => navigate("/chat")}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>
                    </div>

                    {isExcelLoading && <p className="text-gray-500">Loading Excel Files...</p>}
                    {isExcelError && <p className="text-red-500">Failed to load Excel Files</p>}

                    {!isExcelLoading && excels.length === 0 && (
                        <p className="text-gray-500">No Excel was ingested</p>
                    )}

                    <ul className="space-y-3 my-2 py-2">
                        {excels?.map((doc: any) => (
                            <li
                                key={doc.id}
                                className="border rounded-lg p-4 flex justify-between items-start"
                            >
                                <div className="text-gray-800 text-sm space-y-2 font-medium">
                                    <p className={"gap-2"}>📄 Table Name: {doc.tableName}</p>
                                    <div className={"flex flex-row mx-auto justify-start items-start"}>
                                        <p className={"text-sm px-4"}>Created At:</p>
                                        <p className=" text-gray-500">{new Date(doc.created).toLocaleDateString(
                                            "en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            }
                                        )}</p>
                                    </div>

                                </div>


                                <div className={"flex flex-col gap-2"}>
                                    {/* Delete ExcelFile */}
                                    <button
                                        onClick={() => deleteExcelHandler(doc.id)
                                        }
                                        className="hover:transition scale-110 duration-200"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </main>
    )
}
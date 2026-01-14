import {XCircleIcon} from "lucide-react";
import React, {useEffect, useState} from 'react';
import {useGetAllEquipmentsQuery} from "../../features/equipmentApiSlice";
import {useNavigate, useParams} from "react-router-dom";


export default function EquipmentDescriptionScreen() {
    const {keyword} = useParams();
    const navigate = useNavigate();
    const {data: equipments, isLoading} = useGetAllEquipmentsQuery<any>({keyword});

    const handleEquipmentNavigation = async () => {
        navigate("/equipments")
    }

    return (
        <main>
            <div className=" fixed bottom-6 right-3 w-[465px] h-[680px] bg-[#1A1A1A] text-gray-800 rounded-2xl
                            shadow-2xl border border-gray-600 z-50 p-4 animate-slide-up flex flex-col">
                <div className={"bg-white p-2 h-full rounded-2xl"}>
                    <div className={"flex flex-row justify-between"}>
                        <h2 className={"text-2xl font-semibold text-gray-900 mb-4"}>Equipment Description</h2>

                        <button onClick={() => handleEquipmentNavigation()}
                                className={"hover:scale-110 transition duration-200 ease-in-out"}>
                            <XCircleIcon size={32}/>
                        </button>
                    </div>


                    <h3 className="text-gray-800 font-medium text-center">
                        {equipments.description}
                    </h3>
                </div>
            </div>

        </main>
    )
}
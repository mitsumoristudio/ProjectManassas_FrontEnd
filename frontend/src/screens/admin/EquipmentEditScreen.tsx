import React, {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import CustomLoader from "../../components/Layout/CustomLoader";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useUpdateEquipmentMutation, useGetEquipmentByIdQuery} from "../../features/equipmentApiSlice";

export default function EquipmentEditScreen() {
    const {id: equipmentIdParam} = useParams()
    const equipmentId = String(equipmentIdParam);
    const navigate = useNavigate();

    const {userInfo} = useSelector((state: any) => state.auth)
    const userId = userInfo?.id;

    const [updateEquipment] = useUpdateEquipmentMutation();
    const {data: equipments, isLoading, isError, refetch} = useGetEquipmentByIdQuery<any>(equipmentId);

    const [equipmentName, setEquipmentName] = useState<string>("");
    const [equipmentNumber, setEquipmentNumber] = useState<string>("");
    const [supplier, setSupplier] = useState<string>("");
    const [equipmentType, setEquipmentType] = useState<string>("");
    const [internalExternal, setInternalExternal] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [projectName, setProjectName] = useState<string>("");
    const [monthlyCost, setMonthlyCost] = useState<string>("");

    // Pass a number in textfield
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const parsedValue = newValue === "" ? "" : parseFloat(newValue)

        if (!isNaN(parsedValue as number) || newValue === "") {
            // @ts-ignore
            setMonthlyCost(newValue as number);
        }
    }

    const editOnSubmitHandler = async (e:any) => {
        e.preventDefault();

        if (!equipmentId) {
            toast.error("Invalid Equipment Id.");
            return;
        }
        try {
            await updateEquipment({
                id: equipmentId,
                equipmentName: equipmentName,
                equipmentNumber: equipmentNumber,
                supplier: supplier,
                equipmentType: equipmentType,
                internalExternal: internalExternal,
                description: description,
                projectName: projectName,
                monthlyCost: parseFloat(monthlyCost),
                userId: userId,
            }).unwrap();
            toast.success("Equipment updated successfully.");
            refetch();
            navigate("/equipments");
        } catch (error) {
            // @ts-ignore
            toast.error(error?.data?.message || error.error)
        }
    }
    useEffect(() => {
        if (equipments) {
            setEquipmentName(equipments?.equipmentName);
            setEquipmentNumber(equipments?.equipmentNumber);
            setSupplier(equipments?.supplier);
            setEquipmentType(equipments?.equipmentType);
            setInternalExternal(equipments?.internalExternal);
            setDescription(equipments?.description);
            setProjectName(equipments?.projectName);
            setMonthlyCost(equipments?.monthlyCost);
        }
    }, [equipments, equipments?.equipmentName, equipments?.equipmentNumber
        , equipments?.supplier, equipments?.description, equipments?.internalExternal,
    equipments?.equipmentType, equipments?.projectName, equipments?.monthlyCost, equipments?.userId]);


    return (
        <>
            <Helmet>
                <title>Equipment edit</title>
                <meta name="description" content="Equipment edit page" />
            </Helmet>
            {isLoading ? (
                <CustomLoader />
            ) : isError ? (
                <div className={"text-red-600"}>Error Loading Equipment Data</div>
            ) : (
                <main>
                    <div className={"fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"}>
                        <div className={"bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"}>
                            <h2 className={"text-2xl font-semibold text-gray-900 mb-4"}>Edit Equipment</h2>
                            <form className={"space-y-4"}
                            onSubmit={editOnSubmitHandler}>
                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Equipment Name:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={equipmentName}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Project"
                                        onChange={(e) => setEquipmentName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Equipment Number:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={equipmentNumber}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="#10000"
                                        data-cy={"error-equipmentnumber"}
                                        data-cx={"input-equipmentnumber"}
                                        onChange={(e) => setEquipmentNumber(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Equipment Number:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={supplier}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="#10000"
                                        data-cy={"error-supplier"}
                                        data-cx={"input-supplier"}
                                        onChange={(e) => setSupplier(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Monthly Cost:
                                    </label>
                                    <input
                                        type="number"
                                        required={true}
                                        value={monthlyCost}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={"Enter value"}
                                        onChange={handleNumberChange}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Equipment Category:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={equipmentType}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="#10000"
                                        data-cy={"error-equipmenttype"}
                                        data-cx={"input-equipmenttype"}
                                        onChange={(e) => setEquipmentType(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Internal/External Equipment:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={internalExternal}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="#10000"
                                        data-cy={"error-internalexternal"}
                                        data-cx={"input-internalexternal"}
                                        onChange={(e) => setInternalExternal(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Affiliated Project:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={projectName}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="#10000"
                                        data-cy={"error-projectName"}
                                        data-cx={"input-projectName"}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label data-cy={"description_headline"}
                                           htmlFor="message"
                                           className="block text-lg font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        onChange={(e) => setDescription(e.target.value)}
                                        id="description"
                                        name="description"
                                        value={description}
                                        rows={5}
                                        data-cy={"description"}
                                        data-cx={"input_description"}
                                        placeholder="Your message here..."
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 placeholder-gray-500 resize-y"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <NavLink to={"/equipments"}>
                                        <button
                                            type="button"
                                            // onClick={() => setOpenEdit(false)}
                                            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </NavLink>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Submit
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </main>
            )}
        </>
    )
}


import React, {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import CustomLoader from "../../components/Layout/CustomLoader";
import {useUpdateProjectMutation, useGetProjectQuery} from "../../features/projectApiSlice";
import {NavLink, useNavigate, useParams} from "react-router-dom";

export default function ProjectEditScreen() {
    const {id: projectIdParam} = useParams()
    const projectId = String(projectIdParam);
    const navigate = useNavigate();


    const {userInfo} = useSelector((state: any) => state.auth)
    const userId = userInfo?.id;

  //  const [openEdit, setOpenEdit] = useState(false);
    const [projectName, setProjectName] = useState<string>("");
    const [projectNumber, setProjectNumber] = useState<string>("");
    const [projectEstimate, setProjectEstimate] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [contractor, setContractor] = useState<string>("");
    const [projectManager, setProjectManager] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [updateProject] = useUpdateProjectMutation();
    const {data: projects, isLoading, isError, refetch} = useGetProjectQuery<any>(projectId);
    const projectItem = projects;

    // Pass a number in textfield
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const parsedValue = newValue === "" ? "" : parseFloat(newValue)

        if (!isNaN(parsedValue as number) || newValue === "") {
            // @ts-ignore
            setProjectEstimate(newValue as number);
        }
    }

    const editOnSubmitHandler = async (e: any) => {
        e.preventDefault();

        if (!projectId) {
            toast.error("Invalid Project Id");
            return;
        }
        try {
            await updateProject({
                id: projectId,
                projectName: projectName,
                description: description,
                projectNumber: projectNumber,
                location: location,
                contractor: contractor,
                projectEstimate: parseFloat(projectEstimate),
                projectManager: projectManager,
                userId: userId,
            }).unwrap();
            toast.success("Project updated successfully.");
            refetch();
            navigate("/projects");

        } catch (error) {
            // @ts-ignore
            toast.error(error?.data?.message || error.error)
        }
    }
    useEffect(() => {

        // @ts-ignore
        if (projectItem) {
            setProjectName(projectItem?.projectName);
            setLocation(projectItem?.location);
            setProjectEstimate(projectItem?.projectEstimate);
            setContractor(projectItem?.contractor);
            setProjectNumber(projectItem?.projectNumber);
            setDescription(projectItem?.description);
            setProjectManager(projectItem?.projectManager);
        }
    }, [projectItem, projectItem?.projectName,
        projectItem?.location, projectItem?.contractor, projectItem?.projectEstimate,
    projectItem?.projectNumber, projectItem?.description, projectItem?.projectManager]);

    return (
        <>
            {isLoading ? (
                <CustomLoader />
            ) : isError ? (
                <div className={"text-red-600"}>Error Loading Project Data</div>
            ) : (
                <main>
                    <div
                        className={"fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"}>
                        <div className={"bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"}>
                            <h2 className={"text-2xl font-semibold text-gray-900 mb-4"}>Edit Project</h2>
                            <form className={"space-y-4"}
                                  onSubmit={editOnSubmitHandler}>
                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Project Name:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={projectName}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Project"
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Project Number:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={projectNumber}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="#10000"
                                        onChange={(e) => setProjectNumber(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Estimate:
                                    </label>
                                    <input
                                        type="number"
                                        required={true}
                                        value={projectEstimate}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={"Enter value"}
                                        onChange={handleNumberChange}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Location:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={location}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="City, State"
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Contractor:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={contractor}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="General Contractor"
                                        onChange={(e) => setContractor(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={"block text-md font-medium text-gray-800"}>
                                        Project Manager:
                                    </label>
                                    <input
                                        type="text"
                                        required={true}
                                        value={projectManager}
                                        className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Project Manager"
                                        onChange={(e) => setProjectManager(e.target.value)}
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
                                    <NavLink to={"/projects"}>
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
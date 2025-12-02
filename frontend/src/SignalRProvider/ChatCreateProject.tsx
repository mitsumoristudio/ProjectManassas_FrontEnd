import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useCreateProjectMutation} from "../features/projectApiSlice";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";
import {useChat} from "../SignalRProvider/ChatRProvider";

export default function ChatCreateProject() {
    const {userInfo} = useSelector((state: any) => state.auth);
    const userId = userInfo?.id;

    const navigate = useNavigate();
    const [createProject] = useCreateProjectMutation();
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>("");
    const [projectNumber, setProjectNumber] = useState<string>("");
    const [estimate, setEstimate] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [contractor, setContractor] = useState<string>("");
    const [projectManager, setProjectManager] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const newId = uuidv4();

    const {openCreateProject, setOpenCreateProject} = useChat();

    // Pass a number in textfield
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const parsedValue = newValue === "" ? "" : parseFloat(newValue)

        if (!isNaN(parsedValue as number) || newValue === "") {
            // @ts-ignore
            setEstimate(newValue as number);
        }
    }

        // Add New Project Handler
        const onCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (!userInfo) {
                toast.error("You must be logged in to create a project");
                return;
            }

            try {
                const newProject = {
                    id: newId,
                    projectName,
                    projectNumber,
                    projectEstimate: parseFloat(estimate),
                    location: location,
                    contractor: contractor,
                    projectManager: projectManager,
                    description: description,
                    userId: userId,
                };
                await createProject(newProject).unwrap();
                toast.success("Project created successfully.");

                // Reset & Close
                setProjectName("");
                setProjectNumber("");
                setEstimate("");
                setLocation("");
                setContractor("");
                setProjectManager("");
                setDescription("");

                setOpenEdit(false);

            } catch (err: any) {
                toast.error(err?.data?.message || "Failed to create a project");
            }
        };
    return (
        <>
            {/* Opening create project. Add requireAuth and wrap around setOpenEdit if there is no user logged in */}
            {openCreateProject && userInfo && (
                <div
                    className={"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"}>
                    <div className={"bg-white rounded-3xl shadow-xl p-6 w-3/4 max-w-md h-fit"}>
                        {/*<h2 className={"text-2xl font-semibold text-gray-900 mb-4"}>New Project</h2>*/}
                        <form className={"space-y-4"}
                              onSubmit={onCreateSubmit}>
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
                                    data-cy={"error-project"}
                                    data-cx={"input-project"}
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
                                    data-cy={"error-projectnumber"}
                                    data-cx={"input-projectnumber"}
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
                                    value={estimate}
                                    className="mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={"Enter value"}
                                    data-cy={"error-estimate"}
                                    data-cx={"input-estimate"}
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
                                    data-cy={"error-location"}
                                    data-cx={"input-location"}
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
                                    data-cy={"error-contractor"}
                                    data-cx={"input-contractor"}
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
                                    data-cy={"error-projectmanager"}
                                    data-cx={"input-projectmanager"}
                                    onChange={(e) => setProjectManager(e.target.value)}
                                />
                            </div>

                            <div>
                                <label data-cy={"description_headline"}
                                       htmlFor="message"
                                       className="block text-lg font-medium text-gray-700 mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    onChange={(e) => setDescription(e.target.value)}
                                    id="description"
                                    name="description"
                                    value={description}
                                    rows={3}
                                    data-cy={"description"}
                                    data-cx={"input_description"}
                                    placeholder="Your message here..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 placeholder-gray-500 resize-y"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setOpenCreateProject(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
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
            )}
        </>
    )
}
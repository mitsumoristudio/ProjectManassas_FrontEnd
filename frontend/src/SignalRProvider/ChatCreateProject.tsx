import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useCreateProjectMutation} from "../features/projectApiSlice";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";

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

    // Pass a number in textfield
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const parsedValue = newValue === "" ? "" : parseFloat(newValue)

        if (!isNaN(parsedValue as number) || newValue === "") {
            // @ts-ignore
            setEstimate(newValue as number);
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
    }

}
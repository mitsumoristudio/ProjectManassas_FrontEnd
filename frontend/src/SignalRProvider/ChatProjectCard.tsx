import React from "react";
import {CircleX} from "lucide-react";

type ProjectCardProps = {
    project: any;

}

export default function ChatProjectCard({ project, }: ProjectCardProps) {
    return (
        <>
            <div className="p-4 border rounded-xl bg-gray-50 shadow-md max-w-md mx-auto mt-4">
                {/*<CircleX className={"float-right transition-all ease-in-out scale-120 duration-200"} size={26}  />*/}

                <h2 className="text-xl font-bold mb-2">{project.projectName}</h2>

                <div className="text-sm text-gray-500 mb-1">Project #: {project.projectNumber}</div>
                <div className="text-sm text-gray-500 mb-1">Location: {project.location}</div>
                <div className="text-sm text-gray-500 mb-1">Contractor: {project.contractor}</div>
                <div className="text-sm text-gray-500 mb-1">Project Manager: {project.projectManager}</div>
                <div className="text-sm text-gray-500 mb-1">Estimate: ${project.projectEstimate.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mb-1">Description: {project.description}</div>
                <div className="text-sm text-gray-400 mt-2">Created at: {new Date(project.createdAt).toLocaleDateString()}</div>

            </div>
        </>
    )
}
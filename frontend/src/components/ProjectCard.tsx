

export default function ProjectCard({projects} :any) {

    return (
        <>
            <div className={"flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-500 " +
                "hover:-translate-y-4"}
            key={"projectName"}>
                <div className={"relative"}>
                    <img src={projects.image} alt={projects.name}
                    className={"w-full h-52 object-cover"}/>
                    <div className={"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-35 transition-all duration-300"}></div>
                    <span className={"absolute top-4 right-4 bg-yellow-300 text-white text-sm font-bold px-4 py-1 rounded-lg"}>
                        {projects.jobnumber}
                    </span>
                </div>
                <div className={"p-6 flex-grow flex flex-col"}>
                    <h3 className={"text-xl font-bold text-gray-800 mb-2"}>{projects.name}</h3>
                    <p className={"text-gray-700 flex-grow"}>{projects.description}</p>
                </div>

            </div>
        </>
    )


}
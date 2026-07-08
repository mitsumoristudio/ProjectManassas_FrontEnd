import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {
    useAddPlayWrightQueryMutation,
    useDeletePlayWrightQueryMutation,
    useUpdatePlayWrightQueryMutation
} from "../../../../features/playwrightApiSlice";
import {toast} from "react-toastify";
import {ChevronDown, EllipsisIcon, MailsIcon, Trash2Icon} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

export function RecentQueries({data, tabularOrSingleQuery, refetch , isPlayWrightError}) {

    const {userInfo} = useSelector((state: any) => state.auth);
    const navigate = useNavigate();

    const [projectQueryTitle, setProjectQueryTitle] = useState<string>("");
    const [openQuery, setOpenQuery] = useState<boolean>(false);
    const [editQueryId, setEditQueryId] = useState<string | null>(null);
    const [updatePlayWrightQuery] = useUpdatePlayWrightQueryMutation();
    const [deletePlayWrightQuery] = useDeletePlayWrightQueryMutation();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [addQuery] = useAddPlayWrightQueryMutation();

    // Edit PlayWrightQuery
    const onSelectQueryEditHandler = (query: any) => {

        setEditQueryId(query?.id);
        setProjectQueryTitle(query.projectQueryTitle);
        setOpenQuery(true);
        setActiveMenu(null);

        refetch();
    }

    // Create new QueryTitle
    const onCreateQueryTitleHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userInfo) {
            toast.error("You must be logged in!");
            return;
        }
        try {
            if (editQueryId) {
                await updatePlayWrightQuery({
                    id: editQueryId,
                    projectQueryTitle: projectQueryTitle,
                }).unwrap();
                toast.success("Query has been updated!");
            } else {
                const newQuery = {
                    projectQueryTitle: projectQueryTitle,
                };
                await addQuery(newQuery).unwrap();

                toast.success("Query has been created successfully.!");
            }
            refetch();
            setProjectQueryTitle("");
            setEditQueryId(null);
            setActiveMenu(null);
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Delete PlayWrightQuery
    const onQueryDeleteHandler = async (id: string) => {
        if (window.confirm(`Are you sure you want to delete this query`)) {
            try {
                await deletePlayWrightQuery(id).unwrap();

                refetch();

                toast.success("Query was successfully deleted.");
            } catch (error) {
                toast.error("Problem with deleting this query")
            }
        }
        setActiveMenu(null);
    }

    // Share project
    const onSelectShare = (id: string) => {
        console.log("Share project:", id);
        setActiveMenu(null);
    }

    const EllipsisEdit = [
        {
            name: "Edit", icon: ChevronDown, color: "#6366f1", action: (q: any) => onSelectQueryEditHandler(q)
        },
        {
            name: "Delete", icon: Trash2Icon, color: "#6366f1", action: (q: any) => onQueryDeleteHandler(q.id)
        },
        {
            name: "Share", icon: MailsIcon, color: "#6366f1", action: (q: any) => onSelectShare(q.id)
        }
    ]

    // when user click outside the ellipsis, the window closes
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Recent queries</h2>

            <div className="bg-white rounded-2xl divide-y max-h-[300px] overflow-y-auto scroll-smooth cursor-pointer">
                {data?.map((q, i) => (

                    <div key={i}
                         className="flex justify-between p-4 text-sm text-gray-700 hover:bg-gray-200 rounded ease-in-out transition duration-700 font-sans"
                    >
                        <div onClick={() => {
                            const route =
                                q.singleTabular === "single-query-review"
                                    ? `/single-query-review/${q.id}`
                                    : q.singleTabular === "single-search"
                                        ? `/playWrightQuery/chatItem/${q.id}`
                                        : `/tabular-review/${q.id}`;

                            navigate(route);
                        }}>
                            {/* LEFT SIDE */}
                            <div className="flex flex-col">
                                <span className="font-medium">{q.projectQueryTitle}</span>
                                <span className="text-xs text-gray-500">
                                {new Date(q.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}
                            </span>
                            </div>

                        </div>


                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 relative">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {q.singleTabular}
                            </span>

                            <span>{userInfo?.email}</span>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(prev => prev === q.id ? null : q.id)
                                }}
                            >
                                <EllipsisIcon size={20}
                                              className={"relative text-gray-800 hover:bg-gray-400 rounded-md mx-2 transition-colors mb-2"}/>
                            </button>

                            {/* Edit Query Window */}
                            {activeMenu === q.id && (
                                <div className={"absolute right-0 top-full mt-2 z-30"}>
                                    <div
                                        ref={dropdownRef}
                                        className={"bg-gray-400 w-96 rounded-2xl shadow-xl p-1 w-48 cursor-pointer hover:bg-gray-300 transition-colors max-w-fit"}>

                                        {EllipsisEdit.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                onClick={() => item.action(q)}
                                                className="flex items-center p-4 text-md text-white font-medium rounded-lg hover:bg-gray-200 transition-colors mb-2"
                                            >
                                                <item.icon size={20} style={{color: item.color, minWidth: "20px"}}/>
                                                <AnimatePresence>
                                                    {activeMenu === q.id && (
                                                        <motion.span
                                                            key={index}
                                                            className="ml-4 whitespace-nowrap"
                                                            initial={{opacity: 0, width: 0}}
                                                            animate={{opacity: 1, width: "auto"}}
                                                            exit={{opacity: 0, width: 0}}
                                                            transition={{duration: 0.5, delay: 0.3}}
                                                        >
                                                            {item.name}
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>

                                </div>)}

                            {openQuery && (
                                <div className="fixed top-10 left-60 z-40">
                                    <div className={"bg-white rounded-2xl shadow-xl p-4 w-[350px]"}>
                                        <form className={"space-y-4"}
                                              onSubmit={onCreateQueryTitleHandler}>

                                            <div>
                                                <label className={"block text-md font-medium text-gray-800"}>
                                                    Query Name:
                                                </label>
                                                <input
                                                    type="text"
                                                    required={true}
                                                    value={projectQueryTitle}
                                                    placeholder={""}
                                                    className={"mt-1 block w-full border border-gray-500 text-gray-900 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"}
                                                    onChange={(e) => setProjectQueryTitle(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenQuery(false)}
                                                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 rounded-lg bg-purple-400 text-white hover:bg-purple-800"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isPlayWrightError && (
                <>
                    <span className="px-2 text-red-500 text-sm">Error Loading queries</span>
                </>
            )}
        </div>
    );
}
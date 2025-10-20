
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {logout} from "../../../features/authSlice";
import {useLogoutMutation} from "../../../features/userApiSlice";
import {useDispatch} from "react-redux";



import {
    BarChart2Icon,
    DollarSign, LucideHome,
    MenuSquare,
    Settings2Icon,
    LogOutIcon,
    TrendingUp,
    UserCircle2Icon,
    BarChart4Icon,
    User,
    MessageCircleMoreIcon
} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

export default function SideBar() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const {userInfo} = useSelector((state: any) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logoutApiCall] = useLogoutMutation();

    const SIDEBAR_ITEMS = [
        { name: 'Home', icon: LucideHome, color: "#6366f1", href: "/"},
        {name: "AI Construction Agent", icon: MessageCircleMoreIcon, color: "#EC4899", href: "/chat"},
        { name: "Projects", icon: BarChart2Icon, color: "#8B5CF6", href: "/projects"},
        {name: "Equipments", icon: DollarSign, color: "#10B981", href: "/equipments"},
        {name: "Equipment Analytics", icon: TrendingUp, color: "#3882F6", href: "/equipmentAnalytics"},
        {name: "Project Analytic", icon: BarChart4Icon, color: "#10B451", href: "/projectAnalytics"},

    ]

    const AUTH_SIDEBAR_ITEMS = [
        { name: 'Home', icon: LucideHome, color: "#6366f1", href: "/"},
        { name: "AI Construction Chat ", icon: MessageCircleMoreIcon, color: "#EC4899", href: "/chat"},
        { name: "Projects", icon: BarChart2Icon, color: "#8B5CF6", href: "/projects"},
        {name: "My Projects", icon: User, color: "#EC4899", href: `/projects/user/${userInfo?.id}`},
        {name: "Equipments", icon: DollarSign, color: "#10B981", href: "/equipments"},
        {name: "My Equipment", icon: UserCircle2Icon, color: "#6324f1", href: `/equipments/user/${userInfo?.id}`},
        {name: "Equipment Analytic", icon: TrendingUp, color: "#3882F6", href: "/equipmentAnalytics"},
        {name: "Project Analytic", icon: BarChart4Icon, color: "#10B451", href: "/projectAnalytics"},
        {name: "Settings", icon: Settings2Icon, color: "#6EE7B7", href: "/settings"},
        {name: "Sign Out", icon: LogOutIcon, color: "#EC4899", action: "logout"}
    ]

    const logoutHandler = async () => {
        try {
            //@ts-ignore
            await logoutApiCall().unwrap()
            //@ts-ignore
            dispatch(logout())
            navigate("/");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className={"bg-[#0A0A0A]"}>
            <motion.div className={`relative z-10 transition-all duration-200 ease-in-out flex-shrink-0 ${isSidebarOpen ? `w-54` : "w-20"}`}
            animate={{width: isSidebarOpen ? 256 : 80}}>
                <div className={"bg-[#101010] h-full backdrop-blur-md p-4 flex flex-col border-r border-gray-800"}>
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={'p-2 rounded-full mx-1 hover:bg-gray-700 transition-colors max-w-fit'}>
                        <MenuSquare size={30}/>
                    </motion.button>

                    { userInfo ? (
                        <section>
                            {AUTH_SIDEBAR_ITEMS.map((item, index) => {
                                const content = (
                                    <motion.div
                                        className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
                                    >
                                        <item.icon size={28} style={{ color: item.color, minWidth: "20px" }} />
                                        <AnimatePresence>
                                            {isSidebarOpen && (
                                                <motion.span
                                                    key={index}
                                                    className="ml-4 whitespace-nowrap"
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.3 }}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );

                                // Handle logout action
                                if (item.action === "logout") {
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={logoutHandler}
                                            className="w-full text-left"
                                        >
                                            {content}
                                        </button>
                                    );
                                }
                                if (item.href) {
                                    return (
                                        <Link to={item.href as string} key={item.href}>
                                            {content}
                                        </Link>
                                    );
                                }
                                return (<>
                                    </>
                                )
                            })}

                        </section>
                    ) : (
                        <section>
                            <nav className={'mt-8 flex-grow'}>

                                {SIDEBAR_ITEMS.map((item, index) => {
                                    return (
                                        <Link to={item.href} key={item.href}>
                                            <motion.div className={'flex items-center p-4 text-sm font-medium rounded-lg  hover:bg-gray-700 transition-colors mb-2'}>
                                                <item.icon size={28} style={{color: item.color, minWidth: "20px"}} />

                                                <AnimatePresence>
                                                    {isSidebarOpen && (
                                                        <motion.span key={index}
                                                                     className={'ml-4 whitespace-nowrap'}
                                                                     initial={{ opacity: 0, width: 0 }}
                                                                     animate={{opacity: 1, width: "auto"}}
                                                                     exit={{opacity: 0, width: 0}}
                                                                     transition={{duration: 0.4, delay: 0.3}}>
                                                            {item.name}
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        </Link>
                                    )
                                })}
                            </nav>

                        </section>
                    )}
                </div>
            </motion.div>
        </main>
    )
}
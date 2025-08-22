
import React from "react";
import {Link} from "react-router-dom";

import {
    BarChart2Icon,
    DollarSign, LucideHome,
    MenuSquare,
    Settings2Icon,
    ShoppingCart,
    TrendingUp,
    User
} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

const SIDEBAR_ITEMS = [
    { name: 'Home', icon: LucideHome, color: "#6366f1", href: "/"},
    { name: "Projects", icon: BarChart2Icon, color: "#8B5CF6", href: "/projects"},
    {name: "Users", icon: User, color: "#EC4899", href: "/users"},
    {name: "Equipments", icon: DollarSign, color: "#10B981", href: "/equipments"},
    {name: "Orders", icon: ShoppingCart, color: "#F59E0B", href:"/orders" },
    {name: "Analytics", icon: TrendingUp, color: "#3882F6", href: "/analytics"},
    {name: "Settings", icon: Settings2Icon, color: "#6EE7B7", href: "/settings"}
]

export default function SideBar() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <main className={"bg-[#0A0A0A]"}>
            <motion.div className={`relative z-10 transition-all duration-200 ease-in-out flex-shrink-0 ${isSidebarOpen ? `w-54` : "w-20"}`}
            animate={{width: isSidebarOpen ? 256 : 80}}>
                <div className={"bg-[#101010] h-full backdrop-blur-md p-4 flex flex-col border-r border-gray-800"}>
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={'p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'}>
                        <MenuSquare size={30}/>
                    </motion.button>

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
                </div>

            </motion.div>
        </main>
    )
}
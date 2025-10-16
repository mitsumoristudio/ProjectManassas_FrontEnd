import React, { useState } from 'react';
import { LayoutDashboard, GanttChartSquare, DollarSign, Settings, LifeBuoy} from 'lucide-react';
import {NavLink} from "react-router-dom";

export default function DashboardSideBar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    type SidebarLinkProps = {
        icon: React.ReactNode;
        text: string;
        active: boolean;
        navi: string;
    };

    const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, text, active, navi }) => {
        return (
            <NavLink  to={navi}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors 
        ${active ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
                {icon}
                <span className={"ml-3"}>{text}</span>
            </NavLink>
        )
    }

    return (
        <>
            <div className="bg-[#0A0A0A] text-white font-sans min-h-screen flex">
                <aside
                    className={`fixed inset-y-0 left-0 z-20 w-64 bg-[#101010] border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                            <svg width="24" height="24" viewBox="0 0 96 96" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M48 0C21.49 0 0 21.49 0 48C0 74.51 21.49 96 48 96C74.51 96 96 74.51 96 48C96 21.49 74.51 0 48 0ZM48 88C26.021 88 8 69.979 8 48C8 26.021 26.021 8 48 8C69.979 8 88 26.021 88 48C88 69.979 69.979 88 48 88ZM68 48L48 68L28 48L48 28L68 48Z"
                                      fill="#30E0A5"/>
                            </svg>
                            <NavLink to={"/"}>
                                <span className="font-semibold text-xl">Manassas</span>
                            </NavLink>

                        </div>
                    </div>
                    <nav className="p-4 space-y-2 flex-grow">
                        <SidebarLink active={true} navi={"/"} icon={<LayoutDashboard size={20}/>} text="Dashboard"/>
                        <SidebarLink navi={"/projects"} icon={<GanttChartSquare size={20}/>} text="Projects"
                                     active={true}/>
                        <SidebarLink active={true} navi={"/equipments"} icon={<DollarSign size={20}/>} text="Billing"/>
                        <SidebarLink active={true} navi={"/settings"} icon={<Settings size={20}/>} text="Settings"/>
                        <SidebarLink active={true} navi={"/myProjects"} icon={<LifeBuoy size={20}/>}
                                     text="My Projects"/>
                    </nav>
                </aside>
            </div>
        </>
    )
}
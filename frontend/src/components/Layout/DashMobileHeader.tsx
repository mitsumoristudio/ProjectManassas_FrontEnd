import {useState} from "react";
import {NavLink} from "react-router-dom";
import {Bell, Search, Menu, XIcon} from "lucide-react";
import React from "react";
import {useSelector} from "react-redux";

export default function DashMobileHeader() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const {userInfo} = useSelector((state: any) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'AI Construction Agent', href: '/chat' },
        { name: 'Equipment Analytics', href: '/equipmentAnalytics' },
        { name: 'Project Analytic', href: '/projectAnalytics' },
    ];

    return (
        <>
            <header className="bg-[#101010]/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(!isSidebarOpen)}
                                    className="md:hidden mr-4 text-gray-400 hover:text-white">
                                {/*<GanttChartSquare size={24}/>*/}
                            </button>

                            <NavLink to={"/"} className={"flex items-center gap-2 hover:text-white"}>
                                <svg width="26" height="26" viewBox="0 0 96 96" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M48 0C21.49 0 0 21.49 0 48C0 74.51 21.49 96 48 96C74.51 96 96 74.51 96 48C96 21.49 74.51 0 48 0ZM48 88C26.021 88 8 69.979 8 48C8 26.021 26.021 8 48 8C69.979 8 88 26.021 88 48C88 69.979 69.979 88 48 88ZM68 48L48 68L28 48L48 28L68 48Z"
                                          fill="#30E0A5"/>
                                </svg>
                                <h1 className="text-2xl font-semibold">Mori Solution</h1>
                            </NavLink>

                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-400 hover:text-white">
                                <Search size={20}/>
                            </button>
                            <button className="text-gray-400 hover:text-white">
                                <Bell size={20}/>
                            </button>
                            <div className="flex items-center space-x-2">
                                {userInfo ? (
                                    <div
                                        className='items-center  group gap-2 relative flex flex-row'>

                                        <div
                                            className="w-8 h-8 cursor-pointer bg-purple-600 rounded-full items-center py-1 text-white text-center">{userInfo?.userName?.charAt(0)}
                                        </div>

                                        <span className="hidden sm:inline text-sm">{userInfo?.email}</span>

                                    </div>
                                ) : (
                                    <div className={"hidden md:flex items-center space-x-4"}>
                                        <NavLink to={"/login"}
                                                 className={"text-md font-semibold text-center px-4 py-1 text-gray-900  h-8 hover:text-white  bg-[#30E0A5] rounded-md hover:bg-opacity-90 transition-colors"}>Log
                                            in</NavLink>
                                    </div>
                                )}
                            </div>
                            <div className={"md:hidden flex items-center"}>
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className={"text-gray-300 hover:text-white"}>
                                    {isMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className={"md:hidden bg-[#111111] py-4"}>
                            <nav className={"flex flex-col items-center space-y-4"}>
                                {navLinks.map((link) => (
                                    <a key={link.name} href={link.href} className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                ))}

                                <div className="flex flex-col items-center space-y-4 mt-4">
                                    <NavLink to={"/login"} className={"text-lg font-medium text-gray-300 hover:text-white transition-colors"}>Log in</NavLink>

                                    <NavLink to={"/register"} className={"px-4 py-2 text-sm font-medium text-black bg-[#30E0A5] rounded-md hover:bg-opacity-90 transition-colors"}>Sign up</NavLink>
                                </div>
                            </nav>

                        </div>
                    )}
                </div>
            </header>
        </>
    )
}
import React from "react";
import { Menu, X, CircleUserRound,} from "lucide-react";
import { RiAdminLine, RiUser2Fill } from "react-icons/ri";
import SearchBar from "./SearchBar";
import {useSelector, useDispatch } from "react-redux";
import {logout} from "../../features/authSlice";
import {NavLink, useNavigate,} from "react-router-dom";
import {useLogoutMutation} from "../../features/userApiSlice";
import { useState } from "react";

const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contactUs" },
    { label: "About", href: "/about" },
];


export default function TopNavigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // @ts-ignore
    const {userInfo} = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            // @ts-ignore
            await logoutApiCall().unwrap()
            // @ts-ignore
            dispatch(logout())
            navigate("/login")
        } catch (error) {
            console.error(error);
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <div className="text-2xl font-bold text-blue-600 flex items-center">
                            <img onClick={() => navigate("/")}
                                 alt={"header-logo"}
                                 className={"size-14 cursor-pointer justify-center mb-1 rounded-full shadow-lg"}
                                 src={"../../images/construction.jpg"} />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                        {navigationItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-lg font-medium transition-all duration-300 relative group"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                            {/* Search Bar Shopping Cart and Login */}
                            <div className={"flex items-center gap-6 px-4"}>
                                <SearchBar/>


                                <div className={"flex items-center gap-3 cursor-pointer group relative"}>

                                    {userInfo ? (
                                        <div className={"flex items-center gap-3 cursor-pointer group relative"}>
                                            <RiUser2Fill size={26}/>
                                            <p className={"text-xs font-medium italic text-gray-800"}>{}</p>
                                            <div
                                                className={"absolute top-0 right-0 pt-16 text-base font-medium text-gray-800 z-20 hidden group-hover:block"}>
                                                <div className={"min-w-48 bg-stone-100 rounded flex flex-col gap-3 p-3"}>
                                                    <NavLink className={"hover:text-blue-500"} to={`/${userInfo.id}/myContacts`}>
                                                        My Contacts
                                                    </NavLink>

                                                    <NavLink className={"hover:text-blue-500"} to={`/${userInfo.id}/myProjects`}>
                                                        My Projects
                                                    </NavLink>

                                                    <NavLink className={"hover:text-blue-500"} to={"/profile"}>
                                                        Settings
                                                    </NavLink>

                                                    <NavLink
                                                        className={"hover:text-blue-500"}
                                                        to={"/logout"}
                                                        onClick={logoutHandler}>
                                                        Logout
                                                    </NavLink>

                                                </div>
                                            </div>
                                        </div>

                                    ) : (
                                        <NavLink
                                            className={"hover:text-blue-500"}
                                            to={"/login"}>
                                            <CircleUserRound size={26}/>
                                        </NavLink>
                                    )}
                                </div>

                                {/* User Login for now */}
                                {userInfo && userInfo.is_admin && (
                                    <div className={"flex items-center gap-3 cursor-pointer group relative"}>
                                        <RiAdminLine size={26}/>
                                        <div
                                            className={"absolute top-0 right-0 pt-16 text-base font-medium text-gray-800 z-20 hidden group-hover:block"}>
                                            <div className={"min-w-48 bg-stone-100 rounded flex flex-col gap-3 p-3"}>
                                                <p className={"hover:text-blue-500 cursor-pointer"}
                                                >
                                                    <NavLink to={"/admin/contactTable"}>
                                                        Contacts
                                                    </NavLink>

                                                </p>
                                                <p className={"hover:text-blue-500  cursor-pointer"}
                                                >
                                                    <NavLink to={"/admin/projecttable"}>
                                                        Projects
                                                    </NavLink>
                                                </p>
                                                <p className={"hover:text-blue-500  cursor-pointer"}
                                                >
                                                    <NavLink to={"/admin/usertable"}>
                                                        Users
                                                    </NavLink>

                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                )}

                                <div className={"md:hidden flex items-center space-x-2"}>
                                    <button className={"bg-gray-100 inline-flex items-center justify-center p-2 rounded-md " +
                                        "text-gray-700 hover:text-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-2 " +
                                        "focus:ring-inset focus:ring-blue-500 transition-colors duration-300"}>
                                        {isMobileMenuOpen ? (
                                            <X size={18}/>
                                        ) : (
                                            <Menu size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Mobile controls */}
                    <div className="md:hidden flex items-center space-x-2">

                        <button
                            onClick={toggleMobileMenu}
                            className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-300"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X size={18} />
                            ) : (
                                <Menu size={18} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigationItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors duration-300"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="px-3 py-2">

                        </div>
                    </div>
                </div>
            )}
        </nav>
    );

}
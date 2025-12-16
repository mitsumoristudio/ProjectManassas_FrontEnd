
import React, { useState } from 'react';
import { Search,  Menu, X } from 'lucide-react';
import {NavLink} from "react-router-dom";
import {logout} from "../../../features/authSlice";
import{ useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../../../features/userApiSlice";

export default function NavBarComponent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {userInfo} = useSelector((state: any) => state.auth);

    const dispatch = useDispatch();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            // @ts-ignore
            await logoutApiCall().unwrap()
            // @ts-ignore
            dispatch(logout())
       //     navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Demo', href: '/projects' },
        { name: 'Contact', href: '/contactUs' },
        { name: 'About', href: '/about' },
    ];

    return (
        <>
            <div className="bg-[#0B0B0B] text-white font-sans overflow-x-hidden">
                {/* Navigation & Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/80 backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-8">
                                <div className="flex-shrink-0">
                                    <svg width="30" height="30" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M48 0C21.49 0 0 21.49 0 48C0 74.51 21.49 96 48 96C74.51 96 96 74.51 96 48C96 21.49 74.51 0 48 0ZM48 88C26.021 88 8 69.979 8 48C8 26.021 26.021 8 48 8C69.979 8 88 26.021 88 48C88 69.979 69.979 88 48 88ZM68 48L48 68L28 48L48 28L68 48Z" fill="#30E0A5"/>
                                    </svg>
                                </div>
                                <nav className="hidden md:flex space-x-6">
                                    {navLinks.map((link) => (
                                        <a key={link.name} href={link.href} className="text-md font-semibold text-gray-300 hover:text-white transition-colors">
                                            {link.name}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                            <div className="hidden md:flex items-center space-x-4">
                                <button className="text-gray-300 hover:text-white">
                                    <Search size={18} />
                                </button>

                                {userInfo ? (
                                    <div className="hidden md:flex items-center space-x-4">
                                        <h2 className={"font-semibold text-white text-lg px-2"}>Welcome {userInfo.user}</h2>
                                        <button onClick={() => logoutHandler()}>
                                            <NavLink to={"/login"} className={"px-4 py-2 text-sm font-medium text-black bg-[#7ee6e6] rounded-md hover:bg-opacity-90 hover:text-white transition-colors"}>Logout</NavLink>
                                        </button>

                                    </div>
                                ) : (
                                    <div className={"hidden md:flex items-center space-x-4"}>
                                        <NavLink to={"/login"} className={"text-sm font-medium text-gray-300 hover:text-white transition-colors"}>Log in</NavLink>

                                        <NavLink to={"/register"} className={"px-4 py-2 text-sm font-medium text-black bg-[#30E0A5] rounded-md hover:bg-opacity-90 hover:text-white transition-colors"}>Sign up</NavLink>

                                    </div>
                                )}

                            </div>
                            <div className="md:hidden flex items-center">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-[#111111] py-4">
                            <nav className="flex flex-col items-center space-y-4">
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
                </header>
            </div>
        </>
    )
}
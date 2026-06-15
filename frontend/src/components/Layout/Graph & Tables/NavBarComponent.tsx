
import React, { useState } from 'react';
import { Search,  Menu, X } from 'lucide-react';
import {NavLink} from "react-router-dom";
import {logout} from "../../../features/authSlice";
import{ useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../../../features/userApiSlice";
import {assets} from "../../../assets/assets";

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

    const navigationItems = [
        { label: "Home", href: "/" },
        { label: "Demo", href: "https://calendly.com/smitsumori-morisolution" },
        { label: "Contact", href: "/contactUs" },
        { label: "About", href: "/about" },
    ];

    const user_auth_navigationItems = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "Contact", href: "/contactUs" },
        { label: "Demo", href: "https://calendly.com/smitsumori-morisolution" },
        { label: "About", href: "/about" },
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
                                    <img
                                        alt=""
                                        src={assets.mori_solution_logo2}
                                        className="h-10 w-10 text-primary flex-shrink-0 rounded-3xl shadow-md"
                                    />
                                </div>
                                {userInfo ? (
                                    <section>
                                        <nav className="hidden md:flex space-x-6">
                                            {user_auth_navigationItems.map((link) => (
                                                <a key={link.label} href={link.href} className="text-md font-semibold text-gray-300 hover:text-white transition-colors">
                                                    {link.label}
                                                </a>
                                            ))}
                                        </nav>
                                    </section>
                                ) : (
                                    <section>
                                        <nav className="hidden md:flex space-x-6">
                                            {navigationItems.map((link) => (
                                                <a key={link.label} href={link.href} className="text-md font-semibold text-gray-300 hover:text-white transition-colors">
                                                    {link.label}
                                                </a>
                                            ))}
                                        </nav>
                                    </section>
                                )}

                            </div>
                            <div className="hidden md:flex items-center space-x-4">
                                {/*<button className="text-gray-300 hover:text-white">*/}
                                {/*    <Search size={18} />*/}
                                {/*</button>*/}

                                {userInfo ? (
                                    <div className="hidden md:flex items-center space-x-4">
                                        <h2 className={"font-semibold text-white text-lg px-2"}>Welcome {userInfo.user}</h2>
                                        <button onClick={() => logoutHandler()}>
                                            <NavLink to={"/login"} className={"px-4 py-2 text-sm font-medium text-black bg-[#7ee6e6] rounded-md hover:bg-opacity-90 hover:text-white transition-colors"}>Logout</NavLink>
                                        </button>

                                    </div>
                                ) : (
                                    <div className={"hidden md:flex items-center space-x-4"}>
                                        <NavLink to={"/login"} className={"px-8 py-2 text-sm font-medium text-black bg-[#30E0A5] rounded-md hover:bg-opacity-90 hover:text-white transition-colors"}>Log in</NavLink>

                                        {/* Registration Link */}
                                        {/*<NavLink to={"/register"} className={"px-4 py-2 text-sm font-medium text-black bg-[#30E0A5] rounded-md hover:bg-opacity-90 hover:text-white transition-colors"}>Sign up</NavLink>*/}

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
                    {isMenuOpen && !userInfo && (
                        <div className="md:hidden bg-[#111111] py-4">
                            <nav className="flex flex-col items-center space-y-4">
                                {navigationItems.map((link) => (
                                    <a key={link.label} href={link.href} className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                ))}

                                <div className="flex flex-col items-center space-y-4 mt-4">
                                    <NavLink to={"/login"} className={"px-4 py-2 text-sm font-medium text-black bg-[#30E0A5] rounded-md hover:bg-opacity-90 transition-colors"}>Log in</NavLink>

                                    {/* Registration Link */}
                                    {/*<NavLink to={"/register"} className={"px-4 py-2 text-sm font-medium text-black bg-[#30E0A5] rounded-md hover:bg-opacity-90 transition-colors"}>Sign up</NavLink>*/}
                                </div>
                            </nav>
                        </div>
                    )}
                </header>
            </div>
        </>
    )
}
import React, {useState} from "react";
import {NavLink, useNavigate,} from "react-router-dom";
import {Search, ArrowRight, Menu, X, ChevronRight, Copy} from "lucide-react";
import SearchBar from "../../components/Layout/SearchBar";

export default function HomeScreen() {
 //   const [isMenuOpen, setMenuOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navigationItems = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "Contact", href: "/contactUs" },
        { label: "About", href: "/about" },
    ];


    return (
        <main>
            <div className={"bg-[#0B0B0B] text-white font-sans overflow-x-hidden"}>
                {/* Header*/}
                <header className={"fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-sm"}>
                    <div className={"container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10"}>
                        <div className={"flex items-center justify-between h-16"}>
                            <div className={"flex items-center space-x-8"}>
                                <div className={"flex-shrink-0"}>
                                    <svg width="38" height="38" viewBox="0 0 106 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M48 0C21.49 0 0 21.49 0 48C0 74.51 21.49 96 48 96C74.51 96 96 74.51 96 48C96 21.49 74.51 0 48 0ZM48 88C26.021 88 8 69.979 8 48C8 26.021 26.021 8 48 8C69.979 8 88 26.021 88 48C88 69.979 69.979 88 48 88ZM68 48L48 68L28 48L48 28L68 48Z" fill="#30E0A5"/>
                                    </svg>
                                </div>

                                {/* Desktop Navigation */}
                                <div className={"hidden md:block"}>
                                    <div className={"md: flex space-x-6"}>
                                        {navigationItems.map((item) => (
                                            <a
                                                key={item.label}
                                                href={item.href}
                                                className={"text-lg font-medium text-white hover:text-gray-300 transition-colors"}
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                    {/* Search Bar, Sign Up and Login */}


                                </div>
                                <div className={"hidden md:flex items-center space-x-6 px-20"}>
                                    <SearchBar />

                                    <a href="/login" className="mx-2 text-lg px-6 font-medium text-gray-200  hover:text-white transition-colors">Log in</a>
                                    <a href="/register" className="mx-2 px-10 py-2 text-lg font-medium text-black bg-[#30E0A5] rounded-md hover:bg-opacity-90 transition-colors">Sign up</a>
                                </div>

                            </div>
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

                </header>
            </div>

        </main>
    )
}
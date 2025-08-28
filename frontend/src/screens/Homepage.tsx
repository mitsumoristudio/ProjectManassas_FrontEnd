import React, { useState } from 'react';
import { Search, ArrowRight, Menu, X } from 'lucide-react';
import {NavLink, useNavigate} from "react-router-dom";
import {logout} from "../features/authSlice";
import{ useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../features/userApiSlice";
import NavBarComponent from "../components/NavBarComponent";

// Main App Component
export default function Homepage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {userInfo} = useSelector((state: any) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            // @ts-ignore
            await logoutApiCall().unwrap()
            // @ts-ignore
            dispatch(logout())
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Projects', href: '/projects' },
        { name: 'Contact', href: '/contactUs' },
        { name: 'About', href: '/about' },
    ];

    return (
        <div className="bg-[#0B0B0B] text-white font-sans overflow-x-hidden">
            {/* Navigation & Header */}
            <NavBarComponent/>

            {/* Main Content */}
            <main className="pt-24 sm:pt-32">
                {/* Hero Section */}
                <section className="text-center container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
                        The cloud solution for <br className="hidden sm:block"/> successful project
                    </h1>
                    <p className="max-w-2xl mx-auto mt-6 text-lg sm:text-xl text-gray-400">
                        Manassas is the fully managed project management platform for General Contractors. Based out of Nashville TN, we have decade of experience developing solutions to our clients.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/projects" className="w-full sm:w-auto px-6 py-3 text-base font-medium hover:text-white text-black bg-[#30E0A5] rounded-md hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2">
                            <span>Start building</span>
                            <ArrowRight size={18} />
                        </a>
                        <a href="/contactUs" className="w-full sm:w-auto px-6 py-3 text-base font-medium text-white bg-[#1A1A1A] border border-gray-700 rounded-md hover:bg-gray-800 transition-all flex items-center justify-center space-x-2">
                            <span>Talk to us</span>
                        </a>
                    </div>
                </section>


                {/* Trusted by Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-32">
                    <p className="text-center text-md text-gray-600">Developed utilizing trusted tech providers</p>
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
                        {['ASP.Net Core', 'React', 'Azure', 'Redux', 'Cypress', 'Tailwind CSS'].map((name) => (
                            <div key={name} className="flex justify-center">
                                <span className="text-2xl font-medium text-gray-400">{name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feature Grid Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-32">
                    <div className="text-center">
                        <h2 className="text-4xl sm:text-4xl font-bold tracking-tight">Built for heavy duty </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                            Reliable and scalable project focused solution for construction industry.
                            We're here to help you get the job done right!
                        </p>

                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { title: 'Instant provisioning', description: 'Create a new construction project in matter of seconds' },
                            { title: 'Autoscaling', description: 'Scale projects and keep track of ongoing process' },
                            { title: 'Team assignments & Roles', description: 'Assign admin roles & built with authentication features' },
                            { title: 'Store individual projects', description: 'Store data at ease' },
                            { title: 'Visualization', description: 'Set and visualize project goals and scope of work' },
                            { title: 'Project Management functions', description: 'Add constraints, requirements and stay updated' },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-[#111111] border border-gray-800 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                                <p className="mt-2 text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#0B0B0B] border-t border-gray-900 mt-20 sm:mt-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        <div className="col-span-2 md:col-span-4 lg:col-span-2">
                            <svg width="30" height="30" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M48 0C21.49 0 0 21.49 0 48C0 74.51 21.49 96 48 96C74.51 96 96 74.51 96 48C96 21.49 74.51 0 48 0ZM48 88C26.021 88 8 69.979 8 48C8 26.021 26.021 8 48 8C69.979 8 88 26.021 88 48C88 69.979 69.979 88 48 88ZM68 48L48 68L28 48L48 28L68 48Z" fill="#30E0A5"/>
                            </svg>
                            <p className="mt-4 text-md text-gray-400">© 2025, By Satoshi Mitsumori. All rights reserved.</p>
                        </div>
                        {['Product', 'Resources', 'About', 'Contact'].map((heading) => (
                            <div key={heading}>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">{heading}</h3>

                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
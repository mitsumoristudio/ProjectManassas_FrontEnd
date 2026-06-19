
import React from 'react';
import {ArrowRight } from 'lucide-react';
import NavBarComponent from "../../components/Layout/Graph & Tables/NavBarComponent";
import {Helmet} from "react-helmet";
import {assets} from "../../assets/assets";
import {motion, useScroll, useTransform} from "framer-motion";


// Main App Component
export default function NewHomeScreenPage() {

    const { scrollYProgress } = useScroll();

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.9],
        [1, 0]
    );

    const whiteOpacity = useTransform(
        scrollYProgress,
        [0, 0.4],
        [0, 1]
    );

    return (
        <>
            <Helmet>
                <title>Home</title>
                <meta name="description" content="Home page" />
            </Helmet>

            <div className="bg-[#0B0B0B] text-white font-sans overflow-x-hidden">
                {/* Navigation & Header */}
                <NavBarComponent/>

                {/* Main Content */}
                <main className="pt-16">
                    {/* Hero Section */}
                    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

                        {/* Background Image */}
                        <div className="absolute inset-0">
                            {/*<img*/}
                            {/*    src={assets.world_trade_center}*/}
                            {/*    alt="World Trade Center"*/}
                            {/*    className="w-full h-full object-cover"*/}
                            {/*/>*/}
                            <motion.img
                            src={assets.world_trade_center}
                            alt={"World Trade Center"}
                            style={{opacity}}
                            className={"w-full h-full object-cover"}/>

                            <motion.div
                            style={{opacity: whiteOpacity}}/>
                        </div>

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Content */}
                        <div className="relative z-10 text-center px-2 py-24">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
                                Simplifying
                                <br className="hidden sm:block" />
                                Construction Contracts
                            </h1>

                            <p className="max-w-2xl mx-auto mt-6 text-lg sm:text-xl text-gray-200">
                                Empowering project teams by reducing risks and disputes in construction lifecycle.
                                Contract compliance built by builders.
                            </p>

                            <div className="mt-8 flex flex-col items-center gap-4">
                                <a
                                    href="https://calendly.com/smitsumori-morisolution"
                                    className="px-8 py-3 text-base font-medium text-white bg-[#1A1A1A] border border-gray-700 rounded-md"
                                >
                                    Talk to us
                                </a>

                                {/* Floating Product Screenshot */}
                                <div className="mt-12 relative py-4">
                                    <img
                                        src={assets.mori_specification_review}
                                        alt="Mori Contract Analysis"
                                        className="
                                                    w-full
                                                    max-w-6xl
                                                    rounded-xl
                                                    shadow-2xl
                                                    border
                                                  border-gray-800
                                                 "
                                    />
                                </div>
                            </div>
                        </div>

                    </section>

                    {/* Product + Features PlayWrightQuery Card*/}
                    <div className="grid lg:grid-cols-2 gap-12 items-start py-8">

                        {/* Screenshot */}
                        <div className="rounded-2xl overflow-hidden shadow-xl mx-6">

                            <img
                                src={assets.playWrightQuerydash}
                                alt="Mori Specification Review"
                                className="w-full max-w-[700px] h-auto rounded-xl"
                            />
                        </div>

                        {/* Feature List */}
                        <div className="space-y-10">

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    Specification Review
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                    Automatically extract specification requirements,
                                    submittals, approved materials, and project obligations.
                                </p>
                            </div>

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    Claims & Damage Handling
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                    Identify clauses related to damages, liabilities,
                                    contractor responsibilities, and notification requirements.
                                </p>
                            </div>

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    Risk Assessment
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                    Highlight high-risk clauses and surface potential
                                    compliance concerns before project execution.
                                </p>
                            </div>

                        </div>

                        {/* Gadget Type and Tabular Review Dash */}
                        <div className="space-y-10 px-3">

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    Extract Critical Insights Within The Document
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                    Compare key data points from hundreds of documents,
                                    LLM centered around ingested data
                                </p>
                            </div>

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    Tabular-Singular Format
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                    Deep analysis over query results. Get full narrative
                                    from the teams structured information
                                </p>
                            </div>

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    PlayWright
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                    Streamline large scale specifications and contract agreement, review and analysis with PlayWright
                                </p>
                            </div>

                            <div className="border-t border-gray-300 w-full"></div>
                        </div>

                        {/* Screenshot */}
                        <div className=" relative
                                        h-[280px]
                                        sm:h-[350px]
                                        md:h-[450px]
                                        lg:h-[500px]
                                        w-full
                                        max-w-[700px]
                                        mx-auto">

                            {/* Background Card */}
                            <img
                                src={assets.cadget_review}
                                alt=""
                                className="
                                            absolute
                                            top-0
                                            left-0
                                            w-[500px]
                                            rounded-2xl
                                            shadow-2xl
                                            border
                                            border-gray-70 "
                            />

                            {/* Foreground Card */}
                            <img
                                src={assets.create_advisor_tabular}
                                alt=""
                                className="
                                               absolute
                                                top-12
                                                sm:top-20
                                                lg:top-24

                                                left-[35%]
                                                sm:left-[45%]

                                                w-[65%]
                                                sm:w-[60%]

                                                rounded-3xl
                                                shadow-2xl
                                                border
                                                border-gray-200
                                                z-20
                                        "
                            />
                        </div>

                        {/* Chat Interface Screen */}
                        <div className="rounded-2xl overflow-hidden shadow-xl mx-6 py-24">

                            <img
                                src={assets.chat_interface}
                                alt="Mori Specification Review"
                                className="w-full max-h-[460px] max-w-[700px] rounded-xl"
                            />
                        </div>

                        {/* Headlines */}
                        <div className="space-y-10 py-8">

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    Navigate Complex Issues Within A Project Team At Scale
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                    Get instant responses, comprehensive analysis and polished
                                    context.
                                </p>
                            </div>

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    Knowledge Base Sources
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                   Search internal content(pdfs, excel documents) while minimizing hallucination
                                </p>
                            </div>

                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-2xl font-semibold text-white">
                                    Gather The Right Sources
                                </h3>

                                <p className="mt-3 text-lg text-gray-600">
                                    Mori Agents are purpose bult to take preconstruction tasks from goal to executable
                                </p>
                            </div>

                        </div>
                    </div>

                    <section className="bg-[#0B0B0B] py-24">
                        <div className="max-w-7xl mx-auto px-4">

                            <div className="rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,.5)]">
                                <iframe
                                    className="w-full aspect-video"
                                    src="https://www.youtube.com/embed/PBCoogZr33k"
                                    title="Mori Demo"
                                    allowFullScreen
                                />
                            </div>

                        </div>
                    </section>

                    {/* Trusted by Section */}
                    <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-32">
                        <p className="text-center text-lg text-gray-600">Developed Utilizing Trusted Tech Providers</p>
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
                            <h2 className="text-4xl sm:text-4xl font-bold tracking-tight">Built For Project Teams</h2>
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
                                <div className={"flex flex-row gap-3"}>
                                    <div className="flex-shrink-0 mx-1">
                                        <img
                                            alt=""
                                            src={assets.mori_solution_logo2}
                                            className="h-10 w-10 text-primary flex-shrink-0 rounded-3xl shadow-md"
                                        />
                                    </div>
                                    <h2 className={"mt-4 text-md font-semibold text-2xl text-gray-200"}>Mori Solution LLC.</h2>
                                </div>

                                <p className={"mt-4 text-md font-semibold text-lg text-gray-200 underline "}>Contact</p>
                                <p className={"mt-4 text-md font-semibold text-gray-200"}>smitsumori@morisolution.com</p>
                                <p className={"mt-4 text-md font-semibold text-gray-200"}>615.484.0567</p>
                                <p className="mt-4 text-md text-gray-400">© 2025, By Satoshi Mitsumori | All Rights Reserved | Privacy Policy.</p>
                            </div>
                            {/*{['Product', 'Resources', 'About', 'Contact'].map((heading) => (*/}
                            {/*    <div key={heading}>*/}
                            {/*        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">{heading}</h3>*/}

                            {/*    </div>*/}
                            {/*))}*/}
                        </div>
                    </div>
                </footer>
            </div>
        </>

    );
}
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Github, Twitter, Globe, Code2, Database, Layout } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-[#FCA311] blur-[120px] opacity-20 rounded-full pointer-events-none"></div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        About <span className="text-[#FCA311]">GraphQL Blog</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        A modern, high-performance blogging platform built to demonstrate the power of GraphQL, React, and Node.js.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-[#FCA311]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#FCA311]/10 rounded-xl flex items-center justify-center text-[#FCA311] mb-6 group-hover:scale-110 transition-transform">
                            <Layout size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Modern Frontend</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Built with React, TailwindCSS, and Apollo Client for a seamless, responsive user experience.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-[#FCA311]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#FCA311]/10 rounded-xl flex items-center justify-center text-[#FCA311] mb-6 group-hover:scale-110 transition-transform">
                            <Database size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Robust Backend</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Powered by Node.js, Express, and Prisma ORM, ensuring data integrity and speed.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-[#FCA311]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#FCA311]/10 rounded-xl flex items-center justify-center text-[#FCA311] mb-6 group-hover:scale-110 transition-transform">
                            <Code2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">GraphQL API</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Efficient data fetching with Apollo Server, preventing over-fetching and under-fetching.
                        </p>
                    </div>
                </div>

                {/* Team / Contact Section */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-6">Connect with Us</h2>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-[#FCA311] hover:text-black transition-all">
                            <Github size={24} />
                        </a>
                        <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-[#FCA311] hover:text-black transition-all">
                            <Twitter size={24} />
                        </a>
                        <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-[#FCA311] hover:text-black transition-all">
                            <Globe size={24} />
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

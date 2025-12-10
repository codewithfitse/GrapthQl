import React from "react";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0f192e] border-t border-white/10 text-gray-400 py-12">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            GraphQL <span className="text-[#FCA311]">Blog</span>
                        </h2>
                        <p className="border-l-2 border-[#FCA311] pl-4 text-sm leading-relaxed max-w-sm">
                            A modern blogging platform built to demonstrate the power of GraphQL, React, and Node.js. Share your thoughts, connect with others, and explore new ideas.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/" className="hover:text-[#FCA311] transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="hover:text-[#FCA311] transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/categories" className="hover:text-[#FCA311] transition-colors">
                                    Categories
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/5 rounded-lg hover:bg-[#FCA311] hover:text-black transition-all">
                                <Github size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/5 rounded-lg hover:bg-[#FCA311] hover:text-black transition-all">
                                <Twitter size={20} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/5 rounded-lg hover:bg-[#FCA311] hover:text-black transition-all">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
                    <p>&copy; {new Date().getFullYear()} GraphQL Blog. All rights reserved.</p>
                    <p className="flex items-center gap-1 mt-4 md:mt-0">
                        Made with <Heart size={12} className="text-red-500 fill-red-500" /> by Codveda Interns
                    </p>
                </div>
            </div>
        </footer>
    );
}

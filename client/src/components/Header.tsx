import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ChevronDown, Hash, Loader2, Menu, X } from "lucide-react";

const GET_CATEGORIES = gql`
	query GetCategories {
		categories {
			id
			name
		}
	}
`;

export default function Header() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { data, loading } = useQuery(GET_CATEGORIES);
    const categories = data?.categories || [];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 bg-[#14213D]/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold tracking-tight text-white z-50">
                        Graph<span className="text-[#FCA311]">QL</span> Blog
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                        <Link to="/" className="hover:text-[#FCA311] transition-colors">
                            Home
                        </Link>

                        {/* Mega Menu Trigger */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 hover:text-[#FCA311] transition-colors py-4">
                                Categories <ChevronDown size={14} />
                            </button>

                            {/* Mega Menu Dropdown */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="bg-[#0b1221] border border-white/10 rounded-2xl shadow-2xl p-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        {loading ? (
                                            <div className="col-span-3 flex justify-center py-4">
                                                <Loader2 className="animate-spin text-[#FCA311]" size={20} />
                                            </div>
                                        ) : (
                                            <>
                                                {categories.slice(0, 8).map((cat: any) => (
                                                    <Link
                                                        key={cat.id}
                                                        to={`/categories/${cat.name}`}
                                                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-[#FCA311] transition-all"
                                                    >
                                                        <Hash size={14} />
                                                        <span className="font-semibold">{cat.name}</span>
                                                    </Link>
                                                ))}
                                                <Link
                                                    to="/categories"
                                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#FCA311]/10 text-[#FCA311] hover:bg-[#FCA311] hover:text-black transition-all col-span-1 font-bold"
                                                >
                                                    View All
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to="/about" className="hover:text-[#FCA311] transition-colors">
                            About
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <Link
                                to="/my-posts"
                                className="px-5 py-2 text-xs font-bold bg-[#FCA311] text-black rounded-full hover:bg-white transition-all"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="px-5 py-2 text-xs font-bold bg-[#FCA311] text-black rounded-full hover:bg-white transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white z-50"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-[#14213D] z-40 flex flex-col items-center justify-center space-y-8 md:hidden">
                    <Link to="/" className="text-xl font-bold text-white" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/categories" className="text-xl font-bold text-white" onClick={() => setIsMenuOpen(false)}>
                        Categories
                    </Link>
                    <Link to="/about" className="text-xl font-bold text-white" onClick={() => setIsMenuOpen(false)}>
                        About
                    </Link>
                    {isLoggedIn ? (
                        <Link
                            to="/my-posts"
                            className="px-8 py-3 text-sm font-bold bg-[#FCA311] text-black rounded-full"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="px-8 py-3 text-sm font-bold bg-[#FCA311] text-black rounded-full"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}

import React from "react";
import { Link } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Hash, Loader2, ArrowRight } from "lucide-react";
import Header from "../components/Header";

const GET_ALL_CATEGORIES = gql`
	query GetAllCategories {
		categories {
			id
			name
		}
	}
`;

export default function AllCategories() {
    const { loading, error, data } = useQuery(GET_ALL_CATEGORIES);
    const categories = data?.categories || [];

    return (
        <div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Explore Topics
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Browse through our collection of articles by category.
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-20">
                        <Loader2 className="animate-spin text-[#FCA311] mx-auto" size={40} />
                    </div>
                )}

                {error && (
                    <div className="text-center py-20 text-red-400">
                        Error loading categories.
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((cat: any) => (
                            <Link
                                key={cat.id}
                                to={`/categories/${cat.name}`}
                                className="group bg-white/5 border border-white/10 hover:border-[#FCA311]/50 p-6 rounded-2xl hover:shadow-xl transition-all flex flex-col justify-between h-40"
                            >
                                <div className="w-10 h-10 bg-[#FCA311]/10 rounded-lg flex items-center justify-center text-[#FCA311] mb-4 group-hover:scale-110 transition-transform">
                                    <Hash size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#FCA311] transition-colors">
                                        {cat.name}
                                    </h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500">
                                            View Posts
                                        </span>
                                        <ArrowRight size={14} className="text-gray-600 group-hover:text-[#FCA311] -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

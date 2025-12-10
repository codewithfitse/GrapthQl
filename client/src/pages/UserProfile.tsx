import React from "react";
import { useParams, Link } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
    Calendar,
    Loader2,
    Heart,
    MessageCircle,
    ArrowRight,
    Shield,
} from "lucide-react";
import Header from "../components/Header";

const GET_USER_PROFILE = gql`
	query GetUserProfile($id: ID!) {
		user(id: $id) {
			id
			name
			email
			avatar
			role
			createdAt
			posts {
				id
				title
				content
				createdAt
				likesCount
				commentsCount
				categories {
					name
				}
			}
		}
	}
`;

export default function UserProfile() {
    const { id } = useParams();
    const isLoggedIn = !!localStorage.getItem("token");

    const { loading, error, data } = useQuery(GET_USER_PROFILE, {
        variables: { id },
        skip: !id,
    });

    if (loading)
        return (
            <div className="min-h-screen bg-[#14213D] flex items-center justify-center">
                <Loader2 className="text-[#FCA311] animate-spin" size={40} />
            </div>
        );

    if (error || !data?.user)
        return (
            <div className="min-h-screen bg-[#14213D] text-white flex items-center justify-center">
                User not found.
            </div>
        );

    const user = data.user;
    const posts = user.posts || [];

    return (
        <div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black">
            <Header />
            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* PROFILE HEADER */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#FCA311]/20 to-purple-600/20"></div>
                    <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 mt-10">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-[#14213D] shadow-xl"
                        />
                        <div className="text-center md:text-left mb-2">
                            <h1 className="text-3xl font-extrabold text-white mb-1">
                                {user.name}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} /> Joined{" "}
                                    {new Date(
                                        Number(user.createdAt)
                                    ).toLocaleDateString()}
                                </span>
                                <span className="px-2 py-0.5 bg-white/10 rounded text-xs font-bold text-[#FCA311] border border-white/10 flex items-center gap-1">
                                    <Shield size={10} /> {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* POSTS GRID */}
                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-[#FCA311] pl-4">
                    Publications
                </h2>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map((post: any) => (
                            <article
                                key={post.id}
                                className="group bg-white/5 border border-white/10 hover:border-[#FCA311]/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {post.categories.map(
                                                (cat: any) => (
                                                    <span
                                                        key={cat.name}
                                                        className="text-[10px] font-bold uppercase tracking-wider text-[#FCA311] bg-[#FCA311]/10 px-2 py-1 rounded-full">
                                                        {cat.name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(
                                                Number(post.createdAt)
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FCA311] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                        {post.content.substring(0, 100)}...
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-white transition-colors">
                                                <Heart size={14} />{" "}
                                                {post.likesCount}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-white transition-colors">
                                                <MessageCircle size={14} />{" "}
                                                {post.commentsCount}
                                            </div>
                                        </div>
                                        <Link
                                            to={`/post/${post.id}`}
                                            className="text-[#FCA311] text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <p className="text-gray-400">
                            This user hasn't published any posts yet.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

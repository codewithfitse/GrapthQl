import React, { useState } from "react";
import {
	Search,
	Heart,
	MessageCircle,
	Calendar,
	ArrowRight,
	Loader2,
	Hash,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- GRAPHQL QUERIES ---
const GET_HOME_DATA = gql`
	query GetHomeData {
		posts {
			id
			title
			content
			createdAt
			likesCount
			commentsCount
			isLiked
			author {
				id
				name
				avatar
			}
			categories {
				name
			}
		}
		categories {
			id
			name
		}
	}
`;

const TOGGLE_LIKE = gql`
	mutation ToggleLike($postId: ID!) {
		toggleLike(postId: $postId)
	}
`;

export default function Home() {
	const [searchTerm, setSearchTerm] = useState("");
	const isLoggedIn = !!localStorage.getItem("token");

	const { loading, error, data } = useQuery<any>(GET_HOME_DATA);
	const [toggleLike] = useMutation(TOGGLE_LIKE, {
		refetchQueries: ["GetHomeData"],
	});

	const handleLike = async (postId: string) => {
		if (!isLoggedIn) return alert("Please login to like posts");
		try {
			await toggleLike({ variables: { postId } });
		} catch (err) {
			console.error("Error toggling like:", err);
		}
	};

	const allPosts = data?.posts || [];
	const categories = data?.categories || [];

	const filteredPosts = allPosts.filter(
		(post: any) =>
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.content.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex flex-col">
			<Header />

			<main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
				{/* Hero Section */}
				<section className="text-center py-16 relative">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-[#FCA311] blur-[100px] opacity-10 rounded-full pointer-events-none"></div>
					<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
						Explore the{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCA311] to-orange-400">
							Future of Tech
						</span>
					</h1>
					<div className="max-w-xl mx-auto relative group">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search
								className="text-gray-500 group-focus-within:text-[#FCA311]"
								size={20}
							/>
						</div>
						<input
							type="text"
							placeholder="Search articles..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full text-white outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311]"
						/>
					</div>
				</section>

				{/* Categories Navigation */}
				<section className="mb-12">
					<div className="flex flex-wrap justify-center gap-3">
						{categories.map((cat: any) => (
							<Link
								key={cat.id}
								to={`/categories/${cat.name}`}
								className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-[#FCA311] hover:text-[#FCA311] transition-all">
								<Hash size={14} /> {cat.name}
							</Link>
						))}
					</div>
				</section>

				{/* Posts Grid */}
				<section className="mt-8">
					<h2 className="text-xl font-bold text-white mb-8 border-l-4 border-[#FCA311] pl-4">
						Latest Publications
					</h2>

					{loading && (
						<div className="text-center py-20">
							<Loader2
								className="animate-spin text-[#FCA311] mx-auto"
								size={40}
							/>
						</div>
					)}

					{!loading && filteredPosts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{filteredPosts.map((post: any) => (
								<article
									key={post.id}
									className="group bg-white/5 border border-white/10 hover:border-[#FCA311]/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all flex flex-col">
									<div className="p-6 flex-1 flex flex-col">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center gap-2">
												<Link
													to={`/user/${post.author.id}`}
													className="flex items-center gap-2 group/author">
													<img
														src={post.author.avatar}
														alt="author"
														className="w-6 h-6 rounded-full border border-white/20 group-hover/author:border-[#FCA311] transition-colors"
													/>
													<span className="text-xs text-gray-400 font-medium group-hover/author:text-[#FCA311] transition-colors">
														{post.author.name}
													</span>
												</Link>
											</div>
											<div className="flex items-center gap-1 text-xs text-gray-500">
												<Calendar size={12} />{" "}
												{new Date(
													Number(post.createdAt)
												).toLocaleDateString()}
											</div>
										</div>
										<h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FCA311] transition-colors line-clamp-2">
											{post.title}
										</h3>
										<p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
											{post.content.substring(0, 100)}...
										</p>
										<div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
											<div className="flex gap-4">
												<button
													onClick={(e) => {
														e.preventDefault();
														handleLike(post.id);
													}}
													className={`flex items-center gap-1.5 text-xs transition-colors ${post.isLiked
															? "text-red-500"
															: "text-gray-400 group-hover:text-white"
														}`}>
													<Heart
														size={14}
														fill={
															post.isLiked
																? "currentColor"
																: "none"
														}
													/>{" "}
													{post.likesCount}
												</button>
												<div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-white transition-colors">
													<MessageCircle size={14} />{" "}
													{post.commentsCount}
												</div>
											</div>
											<Link
												to={`/post/${post.id}`}
												className="text-[#FCA311] text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
												Read More{" "}
												<ArrowRight size={14} />
											</Link>
										</div>
									</div>
								</article>
							))}
						</div>
					) : (
						!loading && (
							<div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
								<p className="text-gray-400">
									No posts found matching your search.
								</p>
							</div>
						)
					)}
				</section>
			</main>
			<Footer />
		</div>
	);
}

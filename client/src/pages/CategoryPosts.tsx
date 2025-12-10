import {
	Heart,
	MessageCircle,
	Calendar,
	ArrowRight,
	Loader2,
	Layers,
	ArrowLeft,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";

const GET_POSTS_BY_CATEGORY = gql`
	query GetPostsByCategory($category: String!) {
		postsByCategory(category: $category) {
			id
			title
			content
			createdAt
			likesCount
			commentsCount
			author {
                id
				name
				avatar
			}
		}
	}
`;

export default function CategoryPosts() {
	const { name } = useParams(); // Get category name from URL
	const isLoggedIn = !!localStorage.getItem("token");

	const { loading, error, data } = useQuery(GET_POSTS_BY_CATEGORY, {
		variables: { category: name || "" },
		skip: !name,
	});

	const posts = data?.postsByCategory || [];

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black">
			<Header />

			<main className="max-w-7xl mx-auto px-6 py-12">
				{/* Header Section */}
				<div className="mb-12 flex flex-col items-center text-center">
					<div className="w-16 h-16 rounded-2xl bg-[#FCA311]/10 flex items-center justify-center text-[#FCA311] mb-4">
						<Layers size={32} />
					</div>
					<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
						{name}
					</h1>
					<p className="text-gray-400 max-w-2xl">
						Browsing all articles and insights tagged under{" "}
						<span className="text-[#FCA311]">{name}</span>.
					</p>
					<Link
						to="/"
						className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
						<ArrowLeft size={16} /> Back to All Posts
					</Link>
				</div>

				{/* Content Grid */}
				<section>
					{loading && (
						<div className="text-center py-20">
							<Loader2
								className="animate-spin text-[#FCA311] mx-auto"
								size={40}
							/>
						</div>
					)}

					{error && (
						<div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
							<p className="text-red-400">
								Could not load category. It might not exist.
							</p>
						</div>
					)}

					{!loading && !error && posts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{posts.map((post: any) => (
								<article
									key={post.id}
									className="group bg-white/5 border border-white/10 hover:border-[#FCA311]/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all flex flex-col">
									<div className="p-6 flex-1 flex flex-col">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center gap-2">
												<img
													src={post.author.avatar}
													alt="author"
													className="w-6 h-6 rounded-full border border-white/20"
												/>
												<span className="text-xs text-gray-400 font-medium">
													{post.author.name}
												</span>
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
												Read More{" "}
												<ArrowRight size={14} />
											</Link>
										</div>
									</div>
								</article>
							))}
						</div>
					) : (
						!loading &&
						!error && (
							<div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
								<p className="text-gray-400">
									No posts found in this category.
								</p>
							</div>
						)
					)}
				</section>
			</main>
		</div>
	);
}
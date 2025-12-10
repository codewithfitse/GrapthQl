import { useState } from "react";
import {
	Heart,
	MessageCircle,
	Calendar,
	Send,
	Loader2,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import Header from "../components/Header";

const GET_POST_DETAILS = gql`
	query GetPostDetails($id: ID!) {
		post(id: $id) {
			id
			title
			content
			createdAt
			likesCount
			isLiked
			author {
				id
				name
				avatar
				role
			}
			categories {
				id
				name
			}
			comments {
				id
				content
				createdAt
				user {
					id
					name
					avatar
				}
			}
		}
	}
`;

const CREATE_COMMENT = gql`
	mutation CreateComment($input: CreateCommentInput!) {
		createComment(input: $input) {
			id
			content
			createdAt
			user {
				id
				name
				avatar
			}
		}
	}
`;

const TOGGLE_LIKE = gql`
	mutation ToggleLike($postId: ID!) {
		toggleLike(postId: $postId)
	}
`;

export default function PostDetails() {

	const { id } = useParams();
	const [commentText, setCommentText] = useState("");

	// const user = JSON.parse(localStorage.getItem("user") || "{}");
	const isLoggedIn = !!localStorage.getItem("token");

	const { loading, error, data, refetch } = useQuery<any>(GET_POST_DETAILS, {
		variables: { id },
		skip: !id,
	});

	const [createComment, { loading: commentLoading }] = useMutation(
		CREATE_COMMENT,
		{
			onCompleted: () => {
				setCommentText("");
				refetch();
			},
		}
	);

	const [toggleLike] = useMutation(TOGGLE_LIKE);

	const handleLike = async () => {
		if (!isLoggedIn) return alert("Please login to like!");
		// Optimistic update could go here, but refetch is safer for now
		await toggleLike({ variables: { postId: id } });
		refetch();
	};

	const handleComment = async () => {
		if (!commentText.trim()) return;
		await createComment({
			variables: {
				input: { content: commentText, postId: id },
			},
		});
	};

	if (loading)
		return (
			<div className="min-h-screen bg-[#14213D] flex items-center justify-center">
				<Loader2 className="text-[#FCA311] animate-spin" size={40} />
			</div>
		);
	if (error)
		return (
			<div className="min-h-screen bg-[#14213D] text-white flex items-center justify-center">
				<div className="text-center">
					<p className="text-xl font-bold mb-2">Error loading post</p>
					<p className="text-gray-400">{error.message}</p>
					<Link to="/" className="mt-4 inline-block text-[#FCA311] hover:underline">Back to Home</Link>
				</div>
			</div>
		);

	const post = data?.post;

	if (!post) return (
		<div className="min-h-screen bg-[#14213D] text-white flex items-center justify-center">
			<div className="text-center">
				<p className="text-xl font-bold mb-2">Post not found</p>
				<Link to="/" className="mt-4 inline-block text-[#FCA311] hover:underline">Back to Home</Link>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black">
			<Header />
			<main className="max-w-4xl mx-auto px-6 py-12">
				{/* --- MAIN GLASS CARD --- */}
				<article className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
					{/* Categories */}
					<div className="flex flex-wrap gap-2 mb-6">
						{post.categories.map((cat: any) => (
							<span
								key={cat.id}
								className="px-3 py-1 bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/20 text-xs font-semibold uppercase rounded-full">
								{cat.name}
							</span>
						))}
					</div>

					<h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
						{post.title}
					</h1>

					<div className="flex items-center justify-between border-b border-white/10 pb-8 mb-8">
						<div className="flex items-center gap-4">
							<Link to={`/user/${post.author.id}`} className="flex items-center gap-4 group/author">
								<img
									src={post.author.avatar}
									alt={post.author.name}
									className="w-12 h-12 rounded-full border-2 border-[#FCA311] group-hover/author:scale-105 transition-transform"
								/>
								<div>
									<p className="text-white font-semibold text-base group-hover/author:text-[#FCA311] transition-colors">
										{post.author.name}
									</p>
									<div className="flex items-center gap-2 text-xs text-gray-400">
										<Calendar size={12} />
										<span>
											{new Date(
												Number(post.createdAt)
											).toLocaleDateString()}
										</span>
									</div>
								</div>
							</Link>
						</div>
					</div>

					<div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
						{post.content}
					</div>

					{/* Interaction Bar */}
					<div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/10">
						<button
							onClick={handleLike}
							className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${post.isLiked
								? "bg-[#FCA311] text-black shadow-lg shadow-orange-500/20"
								: "bg-white/5 hover:bg-white/10 text-white border border-white/10"
								}`}>
							<Heart
								size={20}
								fill={post.isLiked ? "black" : "none"}
							/>
							<span>{post.likesCount} Likes</span>
						</button>

						<div className="flex items-center gap-2 text-gray-400">
							<MessageCircle size={20} />
							<span>
								{post.comments?.length || 0} Comments
							</span>
						</div>
					</div>
				</article>

				{/* --- COMMENTS SECTION --- */}
				<section className="mt-16 pb-20">
					<h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
						Discussion{" "}
						<span className="text-[#FCA311]">
							({post.comments?.length || 0})
						</span>
					</h3>

					{isLoggedIn ? (
						<div className="mb-10 relative">
							<div className="absolute inset-0 bg-gradient-to-r from-[#FCA311] to-purple-600 rounded-xl blur opacity-20"></div>
							<div className="relative bg-[#0b162a] border border-white/10 rounded-xl p-4">
								<textarea
									value={commentText}
									onChange={(e) =>
										setCommentText(e.target.value)
									}
									placeholder="What are your thoughts?"
									className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none h-24"></textarea>
								<div className="flex justify-end mt-2">
									<button
										onClick={handleComment}
										disabled={commentLoading}
										className="flex items-center gap-2 px-5 py-2 bg-[#FCA311] hover:bg-[#e5940c] text-black text-sm font-bold rounded-lg transition-colors disabled:opacity-50">
										{commentLoading ? (
											"Posting..."
										) : (
											<>
												<Send size={16} /> Post
												Comment
											</>
										)}
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="mb-10 p-6 bg-white/5 rounded-xl text-center border border-white/10">
							<p className="text-gray-400">
								Please{" "}
								<a
									href="/login"
									className="text-[#FCA311] hover:underline">
									sign in
								</a>{" "}
								to join the discussion.
							</p>
						</div>
					)}

					<div className="space-y-6">
						{post.comments?.map((comment: any) => (
							<div
								key={comment.id}
								className="group flex gap-4 p-6 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl transition-all duration-300">
								<img
									src={comment.user.avatar}
									alt={comment.user.name}
									className="w-10 h-10 rounded-full border border-white/10"
								/>
								<div className="flex-1">
									<div className="flex items-center justify-between mb-2">
										<Link to={`/user/${comment.user.id}`} className="font-bold text-white group-hover:text-[#FCA311] transition-colors hover:underline">
											{comment.user.name}
										</Link>
										<span className="text-xs text-gray-500">
											{new Date(
												Number(comment.createdAt)
											).toLocaleDateString()}
										</span>
									</div>
									<p className="text-gray-300 text-sm leading-relaxed">
										{comment.content}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
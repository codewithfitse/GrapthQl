import { useState } from "react";
import {
	Search,
	Edit3,
	Trash2,
	Eye,
	EyeOff,
	Calendar,
	FileText,
	PlusSquare,
	Loader2,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const GET_MY_POSTS = gql`
	query GetMyPosts {
		myPosts {
			id
			title
			published
			createdAt
			likesCount
		}
	}
`;

const DELETE_POST = gql`
	mutation DeletePost($id: ID!) {
		deletePost(id: $id)
	}
`;

const TOGGLE_PUBLISH = gql`
	mutation TogglePublish($input: UpdatePostInput!) {
		updatePost(input: $input) {
			id
			published
		}
	}
`;

export default function MyPosts() {

	const [searchTerm, setSearchTerm] = useState("");
	const { loading, error, data } = useQuery<any>(GET_MY_POSTS);
	const [deletePost, { loading: deleting }] = useMutation(DELETE_POST, {
		refetchQueries: [{ query: GET_MY_POSTS }],
		awaitRefetchQueries: true,
		onCompleted: () => {
			// Optional: Toast notification could go here
		},
		onError: (err) => alert("Failed to delete post: " + err.message)
	});

	const [togglePublish] = useMutation(TOGGLE_PUBLISH);

	const handleDelete = async (id: string) => {
		await deletePost({ variables: { id } });
	};

	const handleToggle = async (id: string, currentStatus: boolean) => {
		await togglePublish({
			variables: {
				input: { id, published: !currentStatus },
			},
		});
	};

	const posts = data?.myPosts || [];
	const filteredPosts = posts.filter((post: any) =>
		post.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex">
			<Sidebar />
			<main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
				<div className="max-w-5xl mx-auto pt-4 md:pt-10">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-8">
						<div>
							<h1 className="text-3xl font-extrabold text-white">
								My Dashboard
							</h1>
							<p className="text-gray-400 mt-2 text-sm">
								Manage your content.
							</p>
						</div>
						<Link
							to="/create"
							className="flex items-center gap-2 px-6 py-3 bg-[#FCA311] text-black font-bold rounded-xl shadow-lg hover:bg-[#e5940c] hover:-translate-y-1 transition-all">
							<PlusSquare size={18} /> New Post
						</Link>
					</div>

					<div className="mb-6 relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search className="text-gray-500" size={18} />
						</div>
						<input
							type="text"
							placeholder="Search your posts..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#FCA311]/50"
						/>
					</div>

					{loading && (
						<div className="text-center py-20 text-[#FCA311]">
							<Loader2
								className="animate-spin mx-auto"
								size={40}
							/>
						</div>
					)}
					{error && (
						<div className="text-center text-red-400 py-20">
							Error loading posts: {error.message}
						</div>
					)}

					<div className="space-y-4">
						{!loading && !error && filteredPosts.length > 0
							? filteredPosts.map((post: any) => (
								<div
									key={post.id}
									className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#FCA311]/30 transition-all flex flex-col md:flex-row md:items-center gap-6">
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${post.published
											? "bg-green-500/10 border-green-500/20 text-green-500"
											: "bg-orange-500/10 border-orange-500/20 text-orange-500"
											}`}>
										<FileText size={20} />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-1">
											<h3 className="text-lg font-bold text-white group-hover:text-[#FCA311] transition-colors">
												{post.title}
											</h3>
											<span
												className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${post.published
													? "bg-green-500/10 text-green-400 border-green-500/20"
													: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
													}`}>
												{post.published
													? "Published"
													: "Draft"}
											</span>
										</div>
										<div className="flex items-center gap-4 text-xs text-gray-500">
											<span className="flex items-center gap-1">
												<Calendar size={12} />{" "}
												{new Date(
													Number(post.createdAt)
												).toLocaleDateString()}
											</span>
											<span>
												{post.likesCount} Likes
											</span>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Link
											to={`/edit/${post.id}`}
											className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
											<Edit3 size={18} />
										</Link>
										<button
											onClick={() =>
												handleToggle(
													post.id,
													post.published
												)
											}
											className={`p-2 rounded-lg ${post.published
												? "text-green-400 hover:bg-green-400/10"
												: "text-yellow-400 hover:bg-yellow-400/10"
												}`}>
											{post.published ? (
												<Eye size={18} />
											) : (
												<EyeOff size={18} />
											)}
										</button>
										<button
											onClick={() => handleDelete(post.id)}
											disabled={deleting}
											className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-50">
											{deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
										</button>
									</div>
								</div>
							))
							: !loading && (
								<div className="text-center py-16 bg-white/5 border border-white/10 border-dashed rounded-2xl text-gray-400">
									No posts found. Start writing!
								</div>
							)}
					</div>
				</div>
			</main>
		</div>
	);
}
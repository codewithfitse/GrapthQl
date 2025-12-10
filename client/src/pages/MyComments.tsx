import { useState } from "react";
import {
	Search,
	Calendar,
	MessageSquare,
	ExternalLink,
	Trash2,
	Loader2,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const GET_MY_COMMENTS = gql`
	query GetMyComments {
		myComments {
			id
			content
			createdAt
			post {
				id
				title
			}
		}
	}
`;

const DELETE_COMMENT = gql`
	mutation DeleteComment($id: ID!) {
		deleteComment(id: $id)
	}
`;

export default function MyComments() {
	const [searchTerm, setSearchTerm] = useState("");

	const { loading, data } = useQuery<any>(GET_MY_COMMENTS);
	const [deleteComment, { loading: deleting }] = useMutation(DELETE_COMMENT, {
		refetchQueries: [{ query: GET_MY_COMMENTS }],
		awaitRefetchQueries: true,
		onCompleted: () => {
			// Optional: Toast notification could go here
		},
		onError: (err) => alert("Failed to delete comment: " + err.message)
	});

	const handleDelete = async (id: string) => {
		await deleteComment({ variables: { id } });
	};

	const comments = data?.myComments || [];
	const filteredComments = comments.filter(
		(c: any) =>
			c.post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			c.content.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex">
			<Sidebar />
			<main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
				<div className="max-w-4xl mx-auto pt-4 md:pt-10">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-8">
						<div>
							<h1 className="text-3xl font-extrabold text-white">
								My Comments
							</h1>
							<p className="text-gray-400 mt-2 text-sm">
								Track your discussions.
							</p>
						</div>

						<div className="relative w-full md:w-64">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="text-gray-500" size={16} />
							</div>
							<input
								type="text"
								placeholder="Search comments..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-[#FCA311]/50"
							/>
						</div>
					</div>

					{loading && (
						<div className="text-center py-20">
							<Loader2
								className="animate-spin mx-auto text-[#FCA311]"
								size={40}
							/>
						</div>
					)}

					<div className="space-y-4">
						{!loading && filteredComments.length > 0
							? filteredComments.map((c: any) => (
								<div
									key={c.id}
									className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#FCA311]/30 transition-all duration-300">
									<div className="flex flex-col md:flex-row gap-4">
										<div className="hidden md:flex w-10 h-10 rounded-lg bg-white/5 items-center justify-center text-gray-400 shrink-0">
											<MessageSquare size={20} />
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between mb-2">
												<Link
													to={`/post/${c.post.id}`}
													className="text-sm font-bold text-[#FCA311] flex items-center gap-2 hover:underline">
													On: {c.post.title}{" "}
													<ExternalLink
														size={12}
													/>
												</Link>
												<span className="text-xs text-gray-500 flex items-center gap-1">
													<Calendar size={12} />{" "}
													{new Date(
														Number(c.createdAt)
													).toLocaleDateString()}
												</span>
											</div>
											<p className="text-gray-300 text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
												"{c.content}"
											</p>
											<div className="flex justify-end mt-4">
												<button
													onClick={() => handleDelete(c.id)}
													disabled={deleting}
													className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 disabled:opacity-50">
													{deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
													{deleting ? "Deleting..." : "Delete"}
												</button>
											</div>
										</div>
									</div>
								</div>
							))
							: !loading && (
								<div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed text-gray-400">
									No comments found.
								</div>
							)}
					</div>
				</div>
			</main>
		</div>
	);
}
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import Sidebar from "../../components/Sidebar";

const GET_ADMIN_POSTS = gql`
	query GetAdminPosts {
		adminPosts {
			id
			title
			status: published
			author {
				name
				avatar
			}
			createdAt
		}
	}
`;

const DELETE_POST = gql`
	mutation DeletePost($id: ID!) {
		deletePost(id: $id)
	}
`;
// We reuse updatePost to toggle status
const TOGGLE_PUBLISH = gql`
	mutation TogglePublish($input: UpdatePostInput!) {
		updatePost(input: $input) {
			id
			published
		}
	}
`;

export default function ManagePosts() {
	const { loading, data, refetch } = useQuery(GET_ADMIN_POSTS);
	const [deletePost] = useMutation(DELETE_POST, {
		onCompleted: () => refetch(),
	});
	const [togglePublish] = useMutation(TOGGLE_PUBLISH);

	const handleDelete = (id: string) => {
		if (confirm("Delete?")) deletePost({ variables: { id } });
	};
	const handleToggle = async (id: string, status: boolean) => {
		await togglePublish({
			variables: { input: { id, published: !status } },
		});
	};

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] flex">
			<Sidebar />
			<main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
				<div className="max-w-6xl mx-auto pt-10">
					<h1 className="text-3xl font-extrabold text-white mb-10">
						Manage All Posts
					</h1>

					{loading ? (
						<Loader2 className="animate-spin mx-auto text-[#FCA311]" />
					) : (
						<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
							<table className="w-full text-left">
								<thead className="bg-black/20 text-gray-400 text-xs uppercase">
									<tr>
										<th className="px-6 py-4">Post</th>
										<th className="px-6 py-4">Author</th>
										<th className="px-6 py-4">Status</th>
										<th className="px-6 py-4 text-right">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/5">
									{data?.adminPosts.map((p: any) => (
										<tr
											key={p.id}
											className="hover:bg-white/5">
											<td className="px-6 py-4 text-white font-bold">
												{p.title}
											</td>
											<td className="px-6 py-4 flex items-center gap-2">
												<img
													src={p.author.avatar}
													className="w-6 h-6 rounded-full"
												/>{" "}
												<span className="text-sm text-gray-300">
													{p.author.name}
												</span>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-2 py-1 rounded-lg text-xs font-bold border ${
														p.status
															? "bg-green-500/10 text-green-400 border-green-500/20"
															: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
													}`}>
													{p.status
														? "Published"
														: "Draft"}
												</span>
											</td>
											<td className="px-6 py-4 text-right flex justify-end gap-2">
												<button
													onClick={() =>
														handleToggle(
															p.id,
															p.status
														)
													}
													className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
													{p.status ? (
														<EyeOff size={16} />
													) : (
														<Eye size={16} />
													)}
												</button>
												<button
													onClick={() =>
														handleDelete(p.id)
													}
													className="p-2 rounded-lg bg-red-500/10 text-red-400">
													<Trash2 size={16} />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
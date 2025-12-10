import { useState } from "react";
import { Tag, Plus, Edit2, Trash2, Save, X, Loader2 } from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import Sidebar from "../../components/Sidebar";

const GET_CATEGORIES = gql`
	query GetCategories {
		categories {
			id
			name
		}
	}
`;

const CREATE_CATEGORY = gql`
	mutation CreateCategory($name: String!) {
		createCategory(name: $name) {
			id
			name
		}
	}
`;
const UPDATE_CATEGORY = gql`
	mutation UpdateCategory($id: ID!, $name: String!) {
		updateCategory(id: $id, name: $name) {
			id
			name
		}
	}
`;
const DELETE_CATEGORY = gql`
	mutation DeleteCategory($id: ID!) {
		deleteCategory(id: $id)
	}
`;

export default function ManageCategories() {
	const [newCategory, setNewCategory] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");

	const { loading, data, refetch } = useQuery(GET_CATEGORIES);
	const [createCategory] = useMutation(CREATE_CATEGORY, {
		onCompleted: () => {
			setNewCategory("");
			refetch();
		},
	});
	const [updateCategory] = useMutation(UPDATE_CATEGORY, {
		onCompleted: () => {
			setEditingId(null);
			refetch();
		},
	});
	const [deleteCategory] = useMutation(DELETE_CATEGORY, {
		onCompleted: () => refetch(),
	});

	const handleAdd = () => {
		if (newCategory.trim())
			createCategory({ variables: { name: newCategory } });
	};
	const handleUpdate = () => {
		if (editingName.trim() && editingId)
			updateCategory({ variables: { id: editingId, name: editingName } });
	};
	const handleDelete = (id: string) => {
		if (confirm("Delete this category?"))
			deleteCategory({ variables: { id } });
	};

	const categories = data?.categories || [];

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] flex">
			<Sidebar />
			<main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
				<div className="max-w-4xl mx-auto pt-10">
					<h1 className="text-3xl font-extrabold text-white mb-10">
						Manage Categories
					</h1>

					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-10 shadow-lg flex gap-4">
						<input
							value={newCategory}
							onChange={(e) => setNewCategory(e.target.value)}
							placeholder="New Category Name..."
							className="flex-1 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-[#FCA311]/50"
						/>
						<button
							onClick={handleAdd}
							className="px-6 py-3 bg-[#FCA311] text-black font-bold rounded-xl hover:bg-[#e5940c] flex items-center gap-2">
							<Plus size={18} /> Add
						</button>
					</div>

					{loading ? (
						<Loader2 className="animate-spin mx-auto text-[#FCA311]" />
					) : (
						<div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
							{categories.map((cat: any) => (
								<div
									key={cat.id}
									className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
									{editingId === cat.id ? (
										<div className="flex-1 flex gap-3">
											<input
												value={editingName}
												onChange={(e) =>
													setEditingName(
														e.target.value
													)
												}
												className="flex-1 px-4 py-2 bg-black/40 border border-[#FCA311] rounded-lg text-white outline-none"
												autoFocus
											/>
											<button
												onClick={handleUpdate}
												className="p-2 bg-green-500/20 text-green-400 rounded-lg">
												<Save size={18} />
											</button>
											<button
												onClick={() =>
													setEditingId(null)
												}
												className="p-2 bg-red-500/20 text-red-400 rounded-lg">
												<X size={18} />
											</button>
										</div>
									) : (
										<>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-lg bg-[#FCA311]/10 text-[#FCA311] flex items-center justify-center">
													<Tag size={16} />
												</div>
												<span className="text-white font-medium">
													{cat.name}
												</span>
											</div>
											<div className="flex gap-2">
												<button
													onClick={() => {
														setEditingId(cat.id);
														setEditingName(
															cat.name
														);
													}}
													className="p-2 text-gray-400 hover:bg-white/10 rounded-lg">
													<Edit2 size={16} />
												</button>
												<button
													onClick={() =>
														handleDelete(cat.id)
													}
													className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
													<Trash2 size={16} />
												</button>
											</div>
										</>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
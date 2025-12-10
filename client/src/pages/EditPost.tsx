import React, { useState, useEffect } from "react";
import {
	PenTool,
	Save,
	Type,
	FileText,
	ArrowLeft,
} from "lucide-react";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const GET_POST = gql`
	query GetPost($id: ID!) {
		post(id: $id) {
			id
			title
			content
			published
			categories {
				id
				name
			}
		}
	}
`;

const GET_CATEGORIES = gql`
	query GetCategories {
		categories {
			id
			name
		}
	}
`;

const UPDATE_POST = gql`
	mutation UpdatePost($input: UpdatePostInput!) {
		updatePost(input: $input) {
			id
			title
			content
			published
		}
	}
`;

export default function EditPostPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [published, setPublished] = useState(false);

	const { loading: postLoading, data: postData } = useQuery<any>(GET_POST, {
		variables: { id },
		skip: !id
	});

	useEffect(() => {
		if (postData?.post) {
			setTitle(postData.post.title);
			setContent(postData.post.content);
			setPublished(postData.post.published);
			setSelectedCategories(postData.post.categories.map((c: any) => c.id));
		}
	}, [postData]);

	const { data: categoryData } = useQuery<any>(GET_CATEGORIES);
	const allCategories = categoryData?.categories || [];

	const [updatePost, { loading: updateLoading }] = useMutation(UPDATE_POST, {
		onCompleted: () => navigate("/my-posts"),
		refetchQueries: ["GetPost", "GetMyPosts", "GetHomeData"]
	});

	const handleCategoryToggle = (catId: string) => {
		if (selectedCategories.includes(catId)) {
			setSelectedCategories(selectedCategories.filter((c) => c !== catId));
		} else {
			setSelectedCategories([...selectedCategories, catId]);
		}
	};

	const handleUpdate = async () => {
		try {
			await updatePost({
				variables: {
					input: {
						id,
						title,
						content,
						published,
						categoryIds: selectedCategories,
					},
				},
			});
		} catch (err) {
			console.error("Failed to update post:", err);
			alert("Failed to update post");
		}
	};

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex">
			<Sidebar />

			<main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
				<div className="max-w-4xl mx-auto pt-4 md:pt-10">
					{/* Header */}
					<div className="flex items-center gap-4 mb-8">
						<button
							onClick={() => navigate("/my-posts")}
							className="p-2 bg-white/5 rounded-full hover:bg-[#FCA311] hover:text-black transition-all group">
							<ArrowLeft size={20} />
						</button>
						<div>
							<h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
								<PenTool className="text-[#FCA311]" /> Edit Post
							</h1>
							<p className="text-gray-400 text-sm mt-1">
								Refine your masterpiece
							</p>
						</div>
					</div>

					<div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
						<div className="space-y-8">
							{/* Title */}
							<div className="space-y-3">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
									<Type size={14} /> Title
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none focus:border-[#FCA311]/50 focus:ring-1 focus:ring-[#FCA311]/50 transition-all"
								/>
							</div>

							{/* Categories */}
							<div className="space-y-3">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
									<PenTool size={14} /> Categories
								</label>
								<div className="flex flex-wrap gap-2">
									{allCategories.map((cat: any) => (
										<button
											key={cat.id}
											onClick={() => handleCategoryToggle(cat.id)}
											className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategories.includes(cat.id)
													? "bg-[#FCA311] text-black"
													: "bg-white/5 text-gray-400 hover:bg-white/10"
												}`}>
											{cat.name}
										</button>
									))}
								</div>
							</div>

							{/* Content */}
							<div className="space-y-3">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
									<FileText size={14} /> Content
								</label>
								<textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									className="w-full h-64 px-6 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FCA311]/50 focus:ring-1 focus:ring-[#FCA311]/50 transition-all resize-y"></textarea>
							</div>

							{/* Footer Actions */}
							<div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10 mt-8">
								{/* Toggle Switch */}
								<div
									onClick={() => setPublished(!published)}
									className="flex items-center gap-4 cursor-pointer group">
									<div
										className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${published ? "bg-[#FCA311]" : "bg-white/10"
											}`}>
										<div
											className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${published ? "translate-x-6" : "translate-x-0"
												}`}></div>
									</div>
									<span
										className={`text-sm font-bold uppercase tracking-wider ${published ? "text-[#FCA311]" : "text-gray-500"
											}`}>
										{published ? "Published" : "Draft Mode"}
									</span>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-4 w-full md:w-auto">
									<button
										onClick={() => navigate("/my-posts")}
										className="flex-1 md:flex-none px-6 py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 hover:text-red-400 hover:border-red-400/50 transition-all">
										Cancel
									</button>
									<button
										onClick={handleUpdate}
										disabled={updateLoading}
										className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#FCA311] text-black font-bold rounded-xl hover:bg-[#e5940c] shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50">
										{updateLoading ? (
											"Updating..."
										) : (
											<>
												<Save size={18} /> Update Post
											</>
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

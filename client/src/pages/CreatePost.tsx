import { useState } from "react";
import {
	PenTool,
	Layers,
	Save,
	Send,
	Type,
	FileText,
	AlertCircle,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const CREATE_POST = gql`
	mutation CreatePost($input: CreatePostInput!) {
		createPost(input: $input) {
			id
			title
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

export default function CreatePost() {

	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const { data: categoryData } = useQuery<any>(GET_CATEGORIES);
	const categoriesList = categoryData?.categories || [];

	const [createPost, { loading, error }] = useMutation(CREATE_POST, {
		onCompleted: () => navigate("/my-posts"),
		refetchQueries: ["GetMyPosts", "GetHomeData"],
	});

	const handleCategoryToggle = (catId: string) => {
		if (selectedCategories.includes(catId)) {
			setSelectedCategories(
				selectedCategories.filter((id) => id !== catId)
			);
		} else {
			setSelectedCategories([...selectedCategories, catId]);
		}
	};

	const handlePublish = async (isPublished: boolean) => {
		if (!title || !content) return alert("Please fill in all fields");

		try {
			await createPost({
				variables: {
					input: {
						title,
						content,
						published: isPublished,
						categoryIds: selectedCategories
					},
				},
			});
		} catch (err) {
			console.error("Error creating post:", err);
		}
	};

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex">
			<Sidebar />

			<main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
				<div className="max-w-4xl mx-auto pt-4 md:pt-10">
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative">
						{/* Header */}
						<div className="text-center mb-10 border-b border-white/10 pb-8">
							<div className="w-14 h-14 bg-[#FCA311]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FCA311] rotate-3">
								<PenTool size={28} />
							</div>
							<h1 className="text-3xl font-extrabold text-white">
								Write New Story
							</h1>
							<p className="text-gray-400 mt-2 text-sm">
								Share your knowledge with the developer
								community.
							</p>
						</div>

						{error && (
							<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
								<AlertCircle size={20} />
								<div>
									<p className="font-bold">
										Failed to create post
									</p>
									<p className="text-xs opacity-80">
										{error.message}
									</p>
								</div>
							</div>
						)}

						{/* Form */}
						<div className="space-y-8">
							{/* Title */}
							<div className="space-y-3">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
									<Type size={14} /> Post Title
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Enter an engaging title..."
									className="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none focus:border-[#FCA311]/50 focus:ring-1 focus:ring-[#FCA311]/50 transition-all"
								/>
							</div>

							{/* Content */}
							<div className="space-y-3">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
									<FileText size={14} /> Content Body
								</label>
								<textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder="Tell your story here... (Markdown supported)"
									className="w-full h-64 px-6 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FCA311]/50 focus:ring-1 focus:ring-[#FCA311]/50 transition-all resize-y"></textarea>
							</div>

							{/* Categories (Mocked for Visuals) */}
							<div className="space-y-3">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
									<Layers size={14} /> Select Topics
								</label>
								<div className="flex flex-wrap gap-3 bg-black/10 p-6 rounded-xl border border-white/5">
									{categoriesList.map((cat) => {
										const isSelected =
											selectedCategories.includes(cat.id);
										return (
											<button
												key={cat.id}
												type="button"
												onClick={() =>
													handleCategoryToggle(cat.id)
												}
												className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all duration-200 ${isSelected
													? "bg-[#FCA311] text-black border-[#FCA311] shadow-lg shadow-orange-500/20 transform scale-105"
													: "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
													}`}>
												{cat.name}
											</button>
										);
									})}
								</div>
								<p className="text-xs text-gray-500 italic pl-1">
									* Note: Categories will be linked once
									configured in Admin.
								</p>
							</div>

							{/* Actions */}
							<div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-white/10 mt-8">
								<button
									onClick={() => handlePublish(false)}
									disabled={loading}
									className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 hover:border-white/40 transition-all disabled:opacity-50">
									<Save size={18} /> Save Draft
								</button>

								<button
									onClick={() => handlePublish(true)}
									disabled={loading}
									className="flex-2 flex items-center justify-center gap-2 px-6 py-4 bg-[#FCA311] text-black font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:bg-[#e5940c] hover:shadow-orange-500/40 hover:-translate-y-1 transition-all disabled:opacity-50">
									{loading ? (
										"Publishing..."
									) : (
										<>
											<Send size={18} /> Publish Now
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
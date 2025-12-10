import React, { useState, useEffect } from "react";
import {
	LayoutDashboard,
	PlusSquare,
	User as UserIcon,
	Settings,
	LogOut,
	Mail,
	Camera,
	Save,
	FileText,
	MessageCircle,
	Heart,
	Shield,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import Sidebar from "../components/Sidebar";

// Get User Data for Stats
const GET_MY_PROFILE = gql`
	query GetMyProfile {
		me {
			id
			name
			email
			role
			avatar
			# In a real app, you'd resolve these counts in the User type or separate stats query
			# For now, we will mock the counts or you can add them to User resolvers
		}
	}
`;

const UPDATE_PROFILE = gql`
	mutation UpdateProfile($name: String!) {
		updateProfile(name: $name) {
			id
			name
		}
	}
`;

export default function ProfilePage() {
	// Load user from local storage for initial state
	const localUser = JSON.parse(localStorage.getItem("user") || "{}");

	const [name, setName] = useState(localUser.name || "");
	const [successMsg, setSuccessMsg] = useState("");

	// Fetch fresh data
	const { data } = useQuery(GET_MY_PROFILE);
	const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
		onCompleted: (data) => {
			setSuccessMsg("Profile updated successfully!");
			// Update local storage to reflect name change immediately in Sidebar
			const updated = { ...localUser, name: data.updateProfile.name };
			localStorage.setItem("user", JSON.stringify(updated));
			setTimeout(() => setSuccessMsg(""), 3000);
		},
	});

	useEffect(() => {
		if (data?.me) setName(data.me.name);
	}, [data]);

	const handleUpdate = (e: React.FormEvent) => {
		e.preventDefault();
		updateProfile({ variables: { name } });
	};

	const user = data?.me || localUser;

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex">
			<Sidebar />
			<main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
				<div className="max-w-4xl mx-auto pt-4 md:pt-10">
					<h1 className="text-3xl font-extrabold text-white mb-2">
						My Profile
					</h1>
					<p className="text-gray-400 text-sm mb-10">
						Manage your account settings and preferences.
					</p>

					<div className="flex flex-col lg:flex-row gap-8">
						{/* LEFT COLUMN: Avatar Card */}
						<div className="lg:w-1/3 space-y-6">
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden group">
								<div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#FCA311]/20 to-purple-600/20"></div>
								<div className="relative inline-block mt-4 mb-4">
									<img
										src={user.avatar}
										alt="Profile"
										className="w-24 h-24 rounded-full border-4 border-[#14213D] shadow-xl"
									/>
								</div>
								<h2 className="text-xl font-bold text-white">
									{user.name}
								</h2>
								<p className="text-gray-400 text-xs mb-4">
									{user.email}
								</p>
								<div className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-[#FCA311] border border-white/10">
									<Shield size={12} /> {user.role}
								</div>
							</div>
						</div>

						{/* RIGHT COLUMN: Edit Form */}
						<div className="lg:w-2/3">
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
								<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
									<Settings
										className="text-[#FCA311]"
										size={20}
									/>{" "}
									Edit Details
								</h3>

								{successMsg && (
									<div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400 text-sm animate-pulse">
										<CheckCircle size={16} /> {successMsg}
									</div>
								)}

								<form
									onSubmit={handleUpdate}
									className="space-y-6">
									<div className="space-y-2">
										<label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
											Display Name
										</label>
										<div className="relative group">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<UserIcon
													className="text-gray-500 group-focus-within:text-[#FCA311] transition-colors"
													size={18}
												/>
											</div>
											<input
												type="text"
												value={name}
												onChange={(e) =>
													setName(e.target.value)
												}
												className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FCA311]/50"
											/>
										</div>
									</div>

									<div className="space-y-2 opacity-60">
										<label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
											Email Address (Locked)
										</label>
										<div className="relative group">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<Mail
													className="text-gray-500"
													size={18}
												/>
											</div>
											<input
												type="email"
												value={user.email}
												readOnly
												className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-gray-400 cursor-not-allowed"
											/>
										</div>
									</div>

									<div className="pt-4 border-t border-white/10 mt-6">
										<button
											type="submit"
											disabled={loading}
											className="w-full bg-[#FCA311] hover:bg-[#e5940c] text-black font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
											{loading ? (
												"Saving..."
											) : (
												<>
													<Save size={18} /> Save
													Changes
												</>
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
import {
	Users,
	FileText,
	Layers,
	MessageCircle,
	Heart,
	TrendingUp,
	Loader2,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Sidebar from "../../components/Sidebar";

const GET_SYSTEM_STATS = gql`
	query GetSystemStats {
		systemStats {
			users
			posts
			comments
			categories
			likes
		}
	}
`;

const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
	<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#FCA311]/30 transition-all duration-300 group">
		<div className="flex items-start justify-between mb-4">
			<div
				className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-white`}>
				<Icon size={24} />
			</div>
			<span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
				<TrendingUp size={12} /> Live
			</span>
		</div>
		<h3 className="text-3xl font-extrabold text-white mb-1 group-hover:text-[#FCA311] transition-colors">
			{value?.toLocaleString() || 0}
		</h3>
		<p className="text-sm text-gray-400 font-medium">{label}</p>
	</div>
);

export default function AdminDashboard() {
	const { loading, error, data } = useQuery(GET_SYSTEM_STATS);
	const stats = data?.systemStats || {};

	if (loading)
		return (
			<div className="min-h-screen bg-[#14213D] flex items-center justify-center">
				<Loader2 className="text-[#FCA311] animate-spin" size={40} />
			</div>
		);
	if (error)
		return (
			<div className="min-h-screen bg-[#14213D] text-red-400 flex items-center justify-center">
				Access Denied: Admins Only
			</div>
		);

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex">
			<Sidebar />
			<main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen relative">
				<div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-[#FCA311]/5 to-transparent pointer-events-none"></div>
				<div className="max-w-6xl mx-auto pt-4 md:pt-10 relative z-10">
					<div className="mb-10">
						<h1 className="text-3xl font-extrabold text-white mb-2">
							System Overview
						</h1>
						<p className="text-gray-400 text-sm">
							Real-time platform insights.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
						<StatCard
							label="Total Users"
							value={stats.users}
							icon={Users}
							colorClass="bg-blue-500"
						/>
						<StatCard
							label="Total Posts"
							value={stats.posts}
							icon={FileText}
							colorClass="bg-green-500"
						/>
						<StatCard
							label="Categories"
							value={stats.categories}
							icon={Layers}
							colorClass="bg-purple-500"
						/>
						<StatCard
							label="Comments"
							value={stats.comments}
							icon={MessageCircle}
							colorClass="bg-orange-500"
						/>
						<StatCard
							label="Total Likes"
							value={stats.likes}
							icon={Heart}
							colorClass="bg-pink-500"
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
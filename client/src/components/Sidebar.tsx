import {
	LayoutDashboard,
	PlusSquare,
	User,
	LogOut,
	MessageCircle,
	Users,
	FileText,
	Layers,
	Home,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
	const location = useLocation();
	const navigate = useNavigate();
	const activePath = location.pathname;

	const user = JSON.parse(localStorage.getItem("user") || "{}");

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	let navItems = [];

	// --- MENU LOGIC ---
	if (user.role === "ADMIN") {
		// ADMIN MENU: Management tools only + Profile
		navItems = [
			{
				label: "Admin Overview",
				icon: LayoutDashboard,
				path: "/dashboard",
			},
			{ label: "Manage Users", icon: Users, path: "/manage-users" },
			{ label: "Manage Posts", icon: FileText, path: "/manage-posts" },
			{
				label: "Manage Categories",
				icon: Layers,
				path: "/manage-categories",
			},
			{ label: "My Profile", icon: User, path: "/profile" }, // Admin can still edit their profile
		];
	} else {
		// USER/AUTHOR MENU: Creation tools only + Profile
		navItems = [
			{ label: "My Dashboard", icon: LayoutDashboard, path: "/my-posts" },
			{ label: "Create Post", icon: PlusSquare, path: "/create" },
			{ label: "My Comments", icon: MessageCircle, path: "/my-comments" },
			{ label: "My Profile", icon: User, path: "/profile" },
		];
	}

	return (
		<aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0b1221]/80 backdrop-blur-xl border-r border-white/10 z-50">
			<div className="p-8">
				<div className="text-2xl font-bold tracking-tight text-white">
					Graph<span className="text-[#FCA311]">QL</span> Blog
				</div>
				<div className="mt-2 flex items-center gap-2">
					<p className="text-xs text-gray-500">
						Hello, {user.name?.split(" ")[0]}
					</p>
					{user.role === "ADMIN" && (
						<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
							ADMIN
						</span>
					)}
				</div>
			</div>

			<nav className="flex-1 px-4 space-y-2">
				<Link
					to="/"
					className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-400 hover:bg-white/5 hover:text-white mb-4 border border-white/5"
				>
					<Home size={20} className="group-hover:text-[#FCA311] transition-colors" />
					Back to Home
				</Link>

				{navItems.map((item) => (
					<Link
						key={item.label}
						to={item.path}
						className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activePath === item.path
								? "bg-[#FCA311] text-black font-bold shadow-lg shadow-orange-500/20"
								: "text-gray-400 hover:bg-white/5 hover:text-white"
							}`}>
						<item.icon
							size={20}
							className={
								activePath === item.path
									? "text-black"
									: "group-hover:text-[#FCA311] transition-colors"
							}
						/>
						{item.label}
					</Link>
				))}
			</nav>

			<div className="p-4 m-4">
				<button
					onClick={handleLogout}
					className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
					<LogOut size={14} /> Sign Out
				</button>
			</div>
		</aside>
	);
}
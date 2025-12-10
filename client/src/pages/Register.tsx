import React, { useState } from "react";
import {
	User,
	Mail,
	Lock,
	ArrowRight,
	Sparkles,
	AlertCircle,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";

const REGISTER_USER = gql`
	mutation RegisterUser($input: RegisterInput!) {
		register(input: $input) {
			token
			user {
				id
				name
				email
				role
				avatar
			}
		}
	}
`;

export default function Register() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const [registerUser, { loading, error }] = useMutation(REGISTER_USER, {
		onCompleted: (data: any) => {
			localStorage.setItem("token", data.register.token);
			localStorage.setItem("user", JSON.stringify(data.register.user));
			navigate("/my-posts"); // Redirect to Dashboard
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// registerUser({ variables: formData });
		registerUser({ variables: { input: formData } });
	};

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex items-center justify-center p-6 relative overflow-hidden">
			{/* Glow Effects */}
			<div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-[#FCA311] blur-[120px] opacity-10 rounded-full pointer-events-none"></div>
			<div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-[400px] h-[400px] bg-purple-600 blur-[120px] opacity-10 rounded-full pointer-events-none"></div>

			<div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-[#FCA311]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FCA311]">
						<Sparkles size={32} />
					</div>
					<h1 className="text-3xl font-extrabold text-white mb-2">
						Create Account
					</h1>
					<p className="text-gray-400 text-sm max-w-xs mx-auto">
						Join the community to publish posts and interact.
					</p>
				</div>

				{error && (
					<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
						<AlertCircle size={16} />
						{error.message}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Name */}
					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
							Full Name
						</label>
						<div className="relative group">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<User
									className="text-gray-500 group-focus-within:text-[#FCA311] transition-colors"
									size={20}
								/>
							</div>
							<input
								type="text"
								placeholder="John Doe"
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FCA311]/50 focus:ring-1 focus:ring-[#FCA311]/50 transition-all"
							/>
						</div>
					</div>

					{/* Email */}
					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
							Email Address
						</label>
						<div className="relative group">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Mail
									className="text-gray-500 group-focus-within:text-[#FCA311] transition-colors"
									size={20}
								/>
							</div>
							<input
								type="email"
								placeholder="you@example.com"
								required
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
								className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FCA311]/50 focus:ring-1 focus:ring-[#FCA311]/50 transition-all"
							/>
						</div>
					</div>

					{/* Password */}
					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
							Password
						</label>
						<div className="relative group">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Lock
									className="text-gray-500 group-focus-within:text-[#FCA311] transition-colors"
									size={20}
								/>
							</div>
							<input
								type="password"
								placeholder="Strong password"
								required
								value={formData.password}
								onChange={(e) =>
									setFormData({
										...formData,
										password: e.target.value,
									})
								}
								className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FCA311]/50 focus:ring-1 focus:ring-[#FCA311]/50 transition-all"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full mt-6 bg-[#FCA311] hover:bg-[#e5940c] text-black font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
						{loading ? (
							"Creating..."
						) : (
							<>
								Join Now <ArrowRight size={20} />
							</>
						)}
					</button>
				</form>

				<div className="mt-8 text-center">
					<p className="text-sm text-gray-400">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-[#FCA311] font-bold hover:underline">
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

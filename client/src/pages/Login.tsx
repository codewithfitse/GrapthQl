import React, { useState } from "react";
import { Mail, Lock, ArrowRight, User, AlertCircle } from "lucide-react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";

const LOGIN_USER = gql`
	mutation LoginUser($input: LoginInput!) {
		login(input: $input) {
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

export default function Login() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });

	const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
		onCompleted: (data: any) => {
			localStorage.setItem("token", data.login.token);
			localStorage.setItem("user", JSON.stringify(data.login.user));
			navigate("/my-posts"); // Redirect to Dashboard
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		loginUser({ variables: { input: formData } });
	};

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] font-sans selection:bg-[#FCA311] selection:text-black flex items-center justify-center p-6 relative overflow-hidden">
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FCA311] blur-[120px] opacity-10 rounded-full pointer-events-none"></div>

			<div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
				<div className="text-center mb-10">
					<div className="w-16 h-16 bg-[#FCA311]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FCA311]">
						<User size={32} />
					</div>
					<h1 className="text-3xl font-extrabold text-white mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-400 text-sm">
						Sign in to access your dashboard.
					</p>
				</div>

				{error && (
					<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
						<AlertCircle size={16} />
						{error.message}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
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
								placeholder="••••••••"
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
							"Signing In..."
						) : (
							<>
								Sign In <ArrowRight size={20} />
							</>
						)}
					</button>
				</form>

				<div className="mt-8 text-center space-y-4">
					<p className="text-sm text-gray-400">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-[#FCA311] font-bold hover:underline">
							Create Account
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

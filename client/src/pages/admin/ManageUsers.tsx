import {
	Shield,
	Ban,
	CheckCircle,
	Trash2,
	Loader2,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import Sidebar from "../../components/Sidebar";

const GET_ALL_USERS = gql`
	query GetAllUsers {
		users {
			id
			name
			email
			role
			blocked
			avatar
		}
	}
`;

const UPDATE_ROLE = gql`
	mutation UpdateRole($id: ID!, $role: Role!) {
		updateUserRole(id: $id, role: $role) {
			id
			role
		}
	}
`;
const TOGGLE_BLOCK = gql`
	mutation ToggleBlock($id: ID!) {
		toggleUserBlock(id: $id) {
			id
			blocked
		}
	}
`;
const DELETE_USER = gql`
	mutation DeleteUser($id: ID!) {
		deleteUser(id: $id)
	}
`;

export default function ManageUsers() {
	const { loading, data, refetch } = useQuery(GET_ALL_USERS);
	const [updateRole] = useMutation(UPDATE_ROLE);
	const [toggleBlock] = useMutation(TOGGLE_BLOCK);
	const [deleteUser] = useMutation(DELETE_USER, {
		onCompleted: () => refetch(),
	});

	const handleRole = async (id: string, currentRole: string) => {
		const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
		await updateRole({ variables: { id, role: newRole } });
	};

	const handleBlock = async (id: string) => {
		await toggleBlock({ variables: { id } });
	};

	const handleDelete = async (id: string) => {
		if (confirm("Irreversibly delete this user?"))
			await deleteUser({ variables: { id } });
	};

	return (
		<div className="min-h-screen bg-[#14213D] text-[#E5E5E5] flex">
			<Sidebar />
			<main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
				<div className="max-w-6xl mx-auto pt-10">
					<h1 className="text-3xl font-extrabold text-white mb-10">
						Manage Users
					</h1>

					{loading ? (
						<Loader2 className="animate-spin mx-auto text-[#FCA311]" />
					) : (
						<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
							<table className="w-full text-left">
								<thead className="bg-black/20 text-gray-400 text-xs uppercase">
									<tr>
										<th className="px-6 py-4">User</th>
										<th className="px-6 py-4">Role</th>
										<th className="px-6 py-4">Status</th>
										<th className="px-6 py-4 text-right">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/5">
									{data?.users.map((u: any) => (
										<tr
											key={u.id}
											className="hover:bg-white/5">
											<td className="px-6 py-4 flex items-center gap-3">
												<img
													src={u.avatar}
													className="w-10 h-10 rounded-full border border-white/10"
												/>
												<div>
													<div className="text-white font-bold">
														{u.name}
													</div>
													<div className="text-xs text-gray-500">
														{u.email}
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-2 py-1 rounded-lg text-xs font-bold border ${
														u.role === "ADMIN"
															? "bg-purple-500/10 text-purple-400 border-purple-500/20"
															: "bg-gray-500/10 text-gray-400 border-gray-500/20"
													}`}>
													{u.role}
												</span>
											</td>
											<td className="px-6 py-4">
												{u.blocked ? (
													<span className="text-red-400 flex items-center gap-1 text-xs font-bold">
														<Ban size={12} />{" "}
														Blocked
													</span>
												) : (
													<span className="text-green-400 flex items-center gap-1 text-xs font-bold">
														<CheckCircle
															size={12}
														/>{" "}
														Active
													</span>
												)}
											</td>
											<td className="px-6 py-4 text-right flex justify-end gap-2">
												<button
													onClick={() =>
														handleRole(u.id, u.role)
													}
													className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
													<Shield size={16} />
												</button>
												<button
													onClick={() =>
														handleBlock(u.id)
													}
													className={`p-2 rounded-lg ${
														u.blocked
															? "bg-green-500/10 text-green-400"
															: "bg-orange-500/10 text-orange-400"
													}`}>
													{u.blocked ? (
														<CheckCircle
															size={16}
														/>
													) : (
														<Ban size={16} />
													)}
												</button>
												<button
													onClick={() =>
														handleDelete(u.id)
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
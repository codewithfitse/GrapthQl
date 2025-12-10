export const mutations = `
	register(input: RegisterInput!): AuthPayload!
	login(input: LoginInput!): AuthPayload!
	updateProfile(name: String!): User!
	updateUserRole(id: ID!, role: Role!): User!
    toggleUserBlock(id: ID!): User!
    deleteUser(id: ID!): Boolean!
`;
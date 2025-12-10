export const typeDefs = `
	enum Role {
		USER
		ADMIN	
	}

	type User {
		id: ID!
		name: String!
		email: String!
		avatar: String
		role: Role!
		blocked: Boolean
		posts: [Post!]
		comments: [Comment!]
		likes: [Like!]
		createdAt: String!
		updatedAt: String!
	}

	type SystemStats {
        users: Int!
        posts: Int!
        comments: Int!
        categories: Int!
        likes: Int!
    }

	type AuthPayload {
        user: User!
        token: String!
    }

	input RegisterInput {
		name: String!
		email: String!
		password: String!	
	}

	input LoginInput {
		email: String!
		password: String!	
	}
`;
export const typeDefs = `
	type Post {
        id: ID!
        title: String!
        content: String!
        published: Boolean!
        views: Int
        createdAt: String!
        updatedAt: String!
        
        author: User!
        categories: [Category!]
        comments: [Comment!]
        
        likesCount: Int
        commentsCount: Int
        isLiked: Boolean
    }

	input CreatePostInput {
        title: String!
        content: String!
        published: Boolean!
        categoryIds: [ID!]
    }

	input UpdatePostInput {
        id: ID!
        title: String
        content: String
        published: Boolean
        categoryIds: [ID!]
    }
`;
export const typeDefs = `
    type Comment {
        id: ID!
        content: String!
        createdAt: String!
        user: User!
        post: Post!
    }

    input CreateCommentInput {
        content: String!
        postId: ID!
    }
`;
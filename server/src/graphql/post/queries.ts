export const queries = `
    posts: [Post!]!
    post(id: ID!): Post
    myPosts: [Post!]!
    adminPosts: [Post!]!
    postsByCategory(category: String!): [Post!]!
`;
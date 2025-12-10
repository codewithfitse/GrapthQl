export const mutations = `
    createPost(input: CreatePostInput!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
`;
export const typeDefs = `
    type Category {
        id: ID!
        name: String!
    }

    input CategoryInput {
        name: String!
    }
`;
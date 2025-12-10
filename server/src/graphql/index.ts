import { ApolloServer } from "@apollo/server";
import { User } from "./user/index.js";
import { Post } from "./post/index.js";
import { Comment } from "./comment/index.js";
import { Category } from "./category/index.js";
import { Like } from "./like/index.js";

async function createApolloGraphqlServer() {

	const gqlServer = new ApolloServer({
		typeDefs: `
			${User.typeDefs}
			${Post.typeDefs}
			${Comment.typeDefs}
			${Category.typeDefs}
			${Like.typeDefs}

			type Query {
				${User.queries}
				${Post.queries}
				${Comment.queries}
				${Category.queries}
				${Like.queries}
			}

			type Mutation {
				${User.mutations}
				${Post.mutations}
				${Comment.mutations}
				${Category.mutations}
				${Like.mutations}
			}
		`,
		resolvers: {
			Query: {
				...User.resolvers.queries,
				...Post.resolvers.queries,
				...Comment.resolvers.queries,
				...Category.resolvers.queries,
				...Like.resolvers.queries
			},
			Mutation: {
				...User.resolvers.mutations,
				...Post.resolvers.mutations,
				...Comment.resolvers.mutations,
				...Category.resolvers.mutations,
				...Like.resolvers.mutations
			},
			Post: Post.resolvers.Post,
			User: User.resolvers.User
		},
	});

	await gqlServer.start();
	return gqlServer;
}

export default createApolloGraphqlServer;
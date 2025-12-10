import PostService from "../../services/post.js";
import { prismaClient } from "../../lib/db.js";

const queries = {
	posts: async () => {
		return await PostService.getAllPosts();
	},
	post: async (_: any, { id }: { id: string }) => {
		return await PostService.getPostById(Number(id));
	},
	myPosts: async (_: any, __: any, context: any) => {
		if (!context.user) throw new Error('Unauthorized');
		return await PostService.getMyPosts(context.user.id);
	},
	adminPosts: async (_: any, __: any, context: any) => {
		if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
		return await PostService.getAdminPosts();
	},
	postsByCategory: async (_: any, { category }: { category: string }) => {
		return await PostService.getPostsByCategory(category);
	}
};

const mutations = {
	createPost: async (_: any, { input }: any, context: any) => {
		if (!context.user) throw new Error('Unauthorized');
		return await PostService.createPost(input, context.user.id);
	},
	updatePost: async (_: any, { input }: any, context: any) => {
		if (!context.user) throw new Error('Unauthorized');
		const payload = { ...input, id: Number(input.id) };
		return await PostService.updatePost(payload, context.user.id);
	},
	deletePost: async (_: any, { id }: { id: string }, context: any) => {
		if (!context.user) throw new Error('Unauthorized');
		await PostService.deletePost(Number(id), context.user.id);
		return true;
	}
};

const Post = {
	likesCount: (parent: any) => parent._count?.likes || 0,
	commentsCount: (parent: any) => parent._count?.comments || 0,
	isLiked: async (parent: any, _: any, context: any) => {
		if (!context.user) return false;
		const like = await prismaClient.like.findUnique({
			where: {
				postId_userId: {
					userId: context.user.id,
					postId: parent.id,
				},
			},
		});
		return !!like;
	},
};

export const resolvers = { queries, mutations, Post };
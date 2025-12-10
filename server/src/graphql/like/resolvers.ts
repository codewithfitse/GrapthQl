import LikeService from "../../services/like.js";

const queries = {};

const mutations = {
    toggleLike: async (_: any, { postId }: { postId: string }, context: any) => {
        if (!context.user) throw new Error('Unauthorized');
        return await LikeService.toggleLike(postId, context.user.id);
    }
};

export const resolvers = { queries, mutations };
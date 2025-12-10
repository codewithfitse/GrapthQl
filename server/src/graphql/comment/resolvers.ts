import CommentService from "../../services/comment.js";

const queries = {
    comments: async (_: any, { postId }: { postId: string }) => {
        return await CommentService.getCommentsByPost(Number(postId));
    },
    myComments: async (_: any, __: any, context: any) => {
        if (!context.user) throw new Error('Unauthorized');
        return await CommentService.getMyComments(context.user.id);
    }
};

const mutations = {
    createComment: async (_: any, { input }: any, context: any) => {
        if (!context.user) throw new Error('Unauthorized');
        return await CommentService.createComment(input, context.user.id);
    },
    deleteComment: async (_: any, { id }: { id: string }, context: any) => {
        if (!context.user) throw new Error('Unauthorized');
        await CommentService.deleteComment(Number(id), context.user.id);
        return true;
    }
};

export const resolvers = { queries, mutations };
import { prismaClient } from "../lib/db.js";

export interface CreateCommentPayload {
    content: string;
    postId: string;
}

class CommentService {
    public static async createComment(payload: CreateCommentPayload, userId: number) {
        const { content, postId } = payload;
        return prismaClient.comment.create({
            data: {
                content,
                postId: Number(postId),
                userId,
            },
            include: { user: true, post: true }
        });
    }

    public static async getCommentsByPost(postId: number) {
        return prismaClient.comment.findMany({
            where: { postId },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    public static async deleteComment(commentId: number, userId: number) {
        const comment = await prismaClient.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw new Error('Comment not found');
        if (comment.userId !== userId) throw new Error('Unauthorized');

        return prismaClient.comment.delete({ where: { id: commentId } });
    }

    public static async getMyComments(userId: number) {
        return prismaClient.comment.findMany({
            where: { userId },
            include: { post: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export default CommentService;
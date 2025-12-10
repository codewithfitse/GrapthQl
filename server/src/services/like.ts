import { prismaClient } from "../lib/db.js";

class LikeService {
    public static async toggleLike(postId: string, userId: number) {
        const pId = Number(postId);

        const existingLike = await prismaClient.like.findUnique({
            where: {
                postId_userId: {
                    postId: pId,
                    userId
                }
            }
        });

        if (existingLike) {
            await prismaClient.like.delete({
                where: { id: existingLike.id }
            });
            return false;
        } else {
            await prismaClient.like.create({
                data: {
                    postId: pId,
                    userId
                }
            });
            return true;
        }
    }

    public static async hasUserLiked(postId: number, userId: number) {
        const like = await prismaClient.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId
                }
            }
        });
        return !!like;
    }
}

export default LikeService;
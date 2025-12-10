import { prismaClient } from "../lib/db.js";

export interface CreatePostPayload {
    title: string;
    content: string;
    published: boolean;
    categoryIds?: number[];
}

export interface UpdatePostPayload {
    id: number;
    title?: string;
    content?: string;
    published?: boolean;
    categoryIds?: number[];
}

class PostService {
    public static async createPost(payload: CreatePostPayload, authorId: number) {
        const { title, content, published, categoryIds } = payload;
        return prismaClient.post.create({
            data: {
                title,
                content,
                published,
                authorId,
                ...(categoryIds && categoryIds.length > 0 && {
                    categories: {
                        connect: categoryIds.map((id) => ({ id: Number(id) })),
                    },
                }),
            },
            include: { author: true, categories: true }
        });
    }

    public static async getAllPosts() {
        return prismaClient.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            include: { author: true, categories: true, _count: { select: { likes: true, comments: true } } }
        });
    }

    public static async getPostById(id: number) {
        return prismaClient.post.findUnique({
            where: { id },
            include: {
                author: true,
                categories: true,
                comments: { include: { user: true }, orderBy: { createdAt: 'desc' } },
                _count: { select: { likes: true, comments: true } }
            }
        });
    }

    public static async getMyPosts(userId: number) {
        return prismaClient.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
            include: { author: true, _count: { select: { likes: true } } }
        });
    }

    public static async deletePost(postId: number, userId: number) {
        const post = await prismaClient.post.findUnique({ where: { id: postId } });
        if (!post) throw new Error('Post not found.');
        if (post.authorId !== userId) throw new Error('You are not authorized to delete this post.');

        return prismaClient.post.delete({ where: { id: postId } });
    }

    public static async updatePost(payload: UpdatePostPayload, userId: number) {
        const { id, categoryIds, ...updates } = payload;

        const post = await prismaClient.post.findUnique({ where: { id } });
        if (!post) throw new Error('Post not found.');
        if (post.authorId !== userId) throw new Error('Unauthorized');

        return prismaClient.post.update({
            where: { id },
            data: {
                ...updates,
                ...(categoryIds && {
                    categories: {
                        set: categoryIds.map((cid) => ({ id: Number(cid) })),
                    },
                }),
            }
        });
    }

    public static async getAdminPosts() {
        return prismaClient.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
                categories: true,
                _count: { select: { likes: true, comments: true } }
            }
        });
    }

    public static async getPostsByCategory(categoryName: string) {
        return prismaClient.post.findMany({
            where: {
                published: true,
                categories: {
                    some: {
                        name: {
                            equals: categoryName,
                            mode: 'insensitive' // Case insensitive matching (Tech = tech)
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
                categories: true,
                _count: { select: { likes: true, comments: true } }
            }
        });
    }

    public static async getPostsByAuthor(authorId: number) {
        return prismaClient.post.findMany({
            where: { authorId, published: true },
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
                categories: true,
                _count: { select: { likes: true, comments: true } }
            }
        });
    }
}

export default PostService;
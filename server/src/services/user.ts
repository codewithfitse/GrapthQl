import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../lib/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "$uperM@n@123";

export interface CreateUserPayload {
	name: string;
	email: string;
	password: string;
}

export interface GetUserTokenPayload {
	email: string;
	password: string;
}

class UserService {
	public static async createUser({ input }: { input: CreateUserPayload }) {
		const { name, email, password } = input;

		const existedUser = await prismaClient.user.findUnique({ where: { email } });
		if(existedUser)	throw new Error('Email already exists');

		const hashedPassword = await bcrypt.hash(password, 10);
		const avatarUrl = `https://placehold.co/100x100/E2E8F0/4A5568?text=${name}`;
		const user = await prismaClient.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				avatar: avatarUrl,
			}
		});

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			JWT_SECRET,
			{ expiresIn: '7d' }
		);

		return { user, token };
	}

	public static async getUserToken({ input }: { input: GetUserTokenPayload }) {
		const { email, password } = input;

		const user = await prismaClient.user.findUnique({ where: { email } });
		if(!user)	throw new Error('Invalid email or password');

		const valid = await bcrypt.compare(password, user.password);
		if(!valid)	throw new Error('Wrong password');

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			JWT_SECRET,
			{ expiresIn: '7d'}
		);

		return { user, token };
	}

	public static async getUserById(id: number) {
		return prismaClient.user.findUnique({ where: { id } });
	}

	public static async getAllUsers() {
		return prismaClient.user.findMany();
	}

	public static async getMe(context: any) {
		if(!context.user)	return null;
		return prismaClient.user.findUnique({
			where: { id: context.user.id }
		});
	}

	public static decodeJWTToken(token: string) {
		return jwt.verify(token, JWT_SECRET);
	}

	public static async getSystemStats() {
        const [users, posts, comments, categories, likes] = await Promise.all([
            prismaClient.user.count(),
            prismaClient.post.count(),
            prismaClient.comment.count(),
            prismaClient.category.count(),
            prismaClient.like.count(),
        ]);
        return { users, posts, comments, categories, likes };
    }

	public static async updateUserRole(id: number, role: 'USER' | 'ADMIN') {
        return prismaClient.user.update({
            where: { id },
            data: { role }
        });
    }

	public static async toggleUserBlock(id: number) {
        const user = await prismaClient.user.findUnique({ where: { id } });
        if (!user) throw new Error('User not found');
        
        return prismaClient.user.update({
            where: { id },
            data: { blocked: !user.blocked }
        });
    }

	public static async deleteUser(id: number) {
        return prismaClient.user.delete({ where: { id } });
    }

	public static async updateProfile(userId: number, name: string) {
        return prismaClient.user.update({
            where: { id: userId },
            data: { name }
        });
    }
}

export default UserService;
import { prismaClient } from "../lib/db.js";

class CategoryService {
	public static async createCategory(name: string) {
        return prismaClient.category.create({
            data: { name }
        });
    }

	public static async getAllCategories() {
        return prismaClient.category.findMany({
            orderBy: { name: 'asc' }
        });
    }

    public static async updateCategory(id: number, name: string) {
        return prismaClient.category.update({
            where: { id },
            data: { name }
        });
    }

	public static async deleteCategory(id: number) {
        return prismaClient.category.delete({
            where: { id }
        });
    }
}

export default CategoryService;
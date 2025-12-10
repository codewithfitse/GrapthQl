import CategoryService from "../../services/category.js";

const queries = {
    categories: async () => {
        return await CategoryService.getAllCategories();
    }
};

const mutations = {
    createCategory: async (_: any, { name }: { name: string }, context: any) => {
        if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
        return await CategoryService.createCategory(name);
    },
    updateCategory: async (_: any, { id, name }: { id: string, name: string }, context: any) => {
        if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
        return await CategoryService.updateCategory(Number(id), name);
    },
    deleteCategory: async (_: any, { id }: { id: string }, context: any) => {
        if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
        await CategoryService.deleteCategory(Number(id));
        return true;
    }
};

export const resolvers = { queries, mutations };
import UserService from "../../services/user.js";
import PostService from "../../services/post.js";

const queries = {
    me: async (_: any, __: any, context: any) => {
        return await UserService.getMe(context);
    },

    user: async (_: any, args: { id: number }) => {
        return await UserService.getUserById(Number(args.id));
    },

    users: async (_: any, __: any, context: any) => {
        if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
        return await UserService.getAllUsers();
    },

    systemStats: async (_: any, __: any, context: any) => {
        if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
        return await UserService.getSystemStats();
    }
};

const mutations = {
    register: async (_: any, args: any) => {
        return await UserService.createUser(args);
    },

    login: async (_: any, args: any) => {
        return await UserService.getUserToken(args);
    },
    updateProfile: async (_: any, { name }: { name: string }, context: any) => {
        if (!context.user) throw new Error("Unauthorized");
        return await UserService.updateProfile(context.user.id, name);
    },
    updateUserRole: async (_: any, { id, role }: any, context: any) => {
        if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
        return await UserService.updateUserRole(Number(id), role);
    },

    toggleUserBlock: async (_: any, { id }: any, context: any) => {
        if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
        return await UserService.toggleUserBlock(Number(id));
    },

    deleteUser: async (_: any, { id }: any, context: any) => {
        if (context.user?.role !== 'ADMIN') throw new Error('Admins only');
        await UserService.deleteUser(Number(id));
        return true;
    }
};

const User = {
    posts: async (parent: any) => {
        return await PostService.getPostsByAuthor(parent.id);
    }
};

export const resolvers = { queries, mutations, User };
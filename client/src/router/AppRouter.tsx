import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PostDetails from "../pages/PostDetails";
import CreatePost from "../pages/CreatePost";
import EditPost from "../pages/EditPost";
import MyPosts from "../pages/MyPosts";
import CategoryPosts from "../pages/CategoryPosts";
import Profile from "../pages/Profile";
import MyComments from "../pages/MyComments";
import UserProfile from "../pages/UserProfile";
import About from "../pages/About";
import AllCategories from "../pages/AllCategories";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCategories from "../pages/admin/ManageCategories";
import ManagePosts from "../pages/admin/ManagePosts";
import PrivateRoute from "../components/PrivateRoute"; // Import the wrapper

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- PUBLIC ROUTES (Anyone can see) --- */}
                <Route path="/" element={<Home />} />
                <Route path="/post/:id" element={<PostDetails />} />
                <Route path="/categories" element={<AllCategories />} />
                <Route path="/categories/:name" element={<CategoryPosts />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user/:id" element={<UserProfile />} />

                {/* --- PROTECTED ROUTES (Login Required) --- */}
                <Route element={<PrivateRoute />}>
                    <Route path="/create" element={<CreatePost />} />
                    <Route path="/my-posts" element={<MyPosts />} />
                    <Route path="/edit/:id" element={<EditPost />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/my-comments" element={<MyComments />} />

                    {/* Admin Routes (Ideally add Role check here too) */}
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/manage-users" element={<ManageUsers />} />
                    <Route path="/manage-categories" element={<ManageCategories />} />
                    <Route path="/manage-posts" element={<ManagePosts />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
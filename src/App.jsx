import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import BlogLandingPage from "./pages/Blog/BlogLandingPage";
import BlogPostView from "./pages/Blog/BlogPostView";
import PostByTags from "./pages/Blog/PostByTags";
import SearchPosts from "./pages/Blog/SearchPosts";
import AdminLogin from "./pages/Admin/AdminLogin";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import BlogPosts from "./pages/Admin/BlogPosts";
import BlogPostEditor from "./pages/Admin/BlogPostEditor";
import Comments from "./pages/Admin/Comments";
import UserProvider from "./context/userContext";
import BlogPages from "./pages/Admin/BlogPages";
import BlogPageEditor from "./pages/Admin/BlogPageEditor";
import Users from "./pages/Admin/Users";
import UserEditor from "./pages/Admin/UserEditor";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<BlogLandingPage />} />
            <Route path="story/:slug" element={<BlogPostView />} />
            <Route path="/tag/:tagName" element={<PostByTags />} />
            <Route path="/search" element={<SearchPosts />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/posts" element={<BlogPosts />} />
              <Route path="/admin/post/create" element={<BlogPostEditor />} />
              <Route path="/admin/pages" element={<BlogPages />} />
              <Route path="/admin/page/create" element={<BlogPageEditor />} />
              <Route
                path="/admin/post/edit/:postSlug"
                element={<BlogPostEditor isEdit={true} />}
              />
              <Route
                path="/admin/page/edit/:pageSlug"
                element={<BlogPageEditor isEdit={true} />}
              />
              <Route path="/admin/comments" element={<Comments />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/users/edit/:id" element={<UserEditor />} />
            </Route>

            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;

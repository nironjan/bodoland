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
import BlogPages from "./pages/Admin/BlogPages";
import BlogPageEditor from "./pages/Admin/BlogPageEditor";
import Users from "./pages/Admin/Users";
import UserEditor from "./pages/Admin/UserEditor";
import SettingEditor from "./pages/Admin/SettingEditor";

import UserProvider from "./context/userContext";
import { SiteSettingProvider } from "./context/SiteSettingContext";
import BlogPageView from "./pages/Blog/Page/BlogPageView";
import AdminMetaWrapper from "./components/MetaWrapper/AdminMetaWrapper";

const App = () => {
  return (
    <UserProvider>
      <SiteSettingProvider>
        <div>
          <Router>
            <Routes>
              {/* Default Route */}
              <Route path="/" element={<BlogLandingPage />} />
              <Route path="/story/:slug" element={<BlogPostView />} />
              <Route path="/story/tag/:tagName" element={<PostByTags />} />

              <Route path="/page/:slug" element={<BlogPageView />} />

              <Route path="/search" element={<SearchPosts />} />

              {/* Admin Routes */}
              <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminMetaWrapper>
                      <Dashboard />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/posts"
                  element={
                    <AdminMetaWrapper>
                      <BlogPosts />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/post/create"
                  element={
                    <AdminMetaWrapper>
                      <BlogPostEditor />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/pages"
                  element={
                    <AdminMetaWrapper>
                      <BlogPages />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/page/create"
                  element={
                    <AdminMetaWrapper>
                      <BlogPageEditor />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/post/edit/:postSlug"
                  element={
                    <AdminMetaWrapper>
                      <BlogPostEditor isEdit={true} />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/page/edit/:pageSlug"
                  element={
                    <AdminMetaWrapper>
                      <BlogPageEditor isEdit={true} />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/comments"
                  element={
                    <AdminMetaWrapper>
                      <Comments />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminMetaWrapper>
                      <Users />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/users/edit/:id"
                  element={
                    <AdminMetaWrapper>
                      <UserEditor />
                    </AdminMetaWrapper>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <AdminMetaWrapper>
                      <SettingEditor />
                    </AdminMetaWrapper>
                  }
                />
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
      </SiteSettingProvider>
    </UserProvider>
  );
};

export default App;

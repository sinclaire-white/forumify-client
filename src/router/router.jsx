import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import UserProfile from "../pages/dashboard/user/UserProfile";
import AddPost from "../pages/dashboard/user/AddPost";
import Mypost from "../pages/dashboard/user/Mypost";
import AdminProfile from "../pages/dashboard/admin/AdminProfile";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import MakeAnnounce from "../pages/dashboard/admin/MakeAnnounce";
import ReportedActivity from "../pages/dashboard/admin/ReportedActivity";
import Membership from "../pages/membership/Membership";
import SinglePostPage from "../pages/home/SinglePost";
import CommentsPage from "../pages/dashboard/user/CommentsPage";
import PaymentSuccess from "../pages/membership/PaymentSuccess";
import AdminRoute from "./AdminRoute";
import Unauthorized from "./Unauthorized";
import ErrorPage from "../components/ErrorPage";
import About from "../components/About";
import Faq from "../components/Faq";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/about",
        Component: About
      },
      {
        path: "/faq",
        Component: Faq
      },
      {
        path: "/unauthorized", 
        Component: Unauthorized,
      },
      {
        path: "/membership",
        element: (
          <PrivateRoute>
            <Membership></Membership>
          </PrivateRoute>
        ),
      },
      {
      path: "/membership/payment-success",
      element: (
        <PrivateRoute>
          <PaymentSuccess></PaymentSuccess>
        </PrivateRoute>
      ),
    },
      {
        path: "/post/:id",
        element: (
          <PrivateRoute>
            <SinglePostPage></SinglePostPage>
          </PrivateRoute>
        ),
      },
      
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      // USER DASHBOARD
      {
        index: true,
        element: <Navigate to="/dashboard/user-profile" />,
      },

      {
        path: "user-profile",
        Component: UserProfile,
      },
      {
        path: "add-post",
        Component: AddPost,
      },
      {
        path: "my-posts",
        Component: Mypost,
      },
      {
        path: "comments/:postId",
        Component: CommentsPage,
      },

      // ADMIN DASHBOARD
      {
        path: "admin-profile",
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "make-announcement",
        element: (
          <AdminRoute>
            <MakeAnnounce />
          </AdminRoute>
        ),
      },
      {
        path: "reported",
        element: (
          <AdminRoute>
            <ReportedActivity />
          </AdminRoute>
        ),
      },
      
    ],
    
  },
]);

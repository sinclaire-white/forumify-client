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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
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
        path: "/post/:id",
        element: (
          <PrivateRoute>
            <SinglePostPage></SinglePostPage>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess></PaymentSuccess>
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
        Component: AdminProfile,
      },
      {
        path: "manage-users",
        Component: ManageUsers,
      },
      {
        path: "make-announcement",
        Component: MakeAnnounce,
      },
      {
        path: "reported",
        Component: ReportedActivity,
      },
    ],
  },
]);

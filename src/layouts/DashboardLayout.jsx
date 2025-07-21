import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import Sidebar from "../pages/dashboard/sidebar/Sidebar";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const userRole = user?.role || "user";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Use your reusable Navbar here */}
      <Navbar></Navbar>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 p-4 bg-base-200">
          <Sidebar role={userRole} />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto bg-base-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

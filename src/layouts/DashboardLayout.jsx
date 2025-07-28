import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Sidebar from "../pages/dashboard/sidebar/Sidebar";
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
      {/* IMPORTANT: Ensure your Navbar component is designed to be fixed at the top
          (e.g., using 'fixed top-0 w-full z-50' classes) */}
      <Navbar></Navbar>

      {/* This div accounts for the fixed Navbar's height and contains the sidebar and main content */}
      <div className="flex flex-1 pt-16">
        {" "}
        {/* Added pt-16 to push content below the fixed Navbar */}
        {/* Sidebar */}
        <aside className="flex-shrink-0 w-64 p-6 border-r shadow-lg bg-base-200 border-base-300">
          {/* Added shadow, border, and increased padding for better visual separation */}
          {/* flex-shrink-0 ensures sidebar doesn't shrink on smaller screens */}
          <Sidebar  role={userRole}></Sidebar>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto lg:p-10 bg-base-100">
          {/* Increased padding for larger screens (lg:p-10) for more breathing room */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

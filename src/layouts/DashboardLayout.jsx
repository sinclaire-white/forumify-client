
import Navbar from "../components/Navbar";
import Sidebar from "../pages/dashboard/sidebar/Sidebar";
import { Outlet } from "react-router";

const DashboardLayout = () => {

const userRole = "user";


  return (
    <div className="min-h-screen flex flex-col">
      {/* Use your reusable Navbar here */}
      <Navbar></Navbar>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-base-200 p-4">
          <Sidebar role={userRole}/>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-base-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;


import Sidebar from "../pages/dashboard/sidebar/Sidebar";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div>
      <div className="min-h-screen flex">
        <Sidebar></Sidebar>
        <div className="flex-1 p-4">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

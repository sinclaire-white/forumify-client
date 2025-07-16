import AdminSidebar from "./AdminSidebar";
import UserSidebar from "./UserSidebar";

const Sidebar = ({ role }) => {
  if (role === "admin") return <AdminSidebar></AdminSidebar>;
  return <UserSidebar></UserSidebar>;
};

export default Sidebar;

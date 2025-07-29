import { NavLink } from "react-router";
import { FiUser, FiUsers, FiAlertCircle } from "react-icons/fi";
import { MdCampaign } from "react-icons/md";

const AdminSidebar = ({ closeSidebar }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors ${
      isActive ? "bg-blue-200 font-semibold" : ""
    }`;

  return (
    <nav className="flex flex-col gap-3">
      <NavLink
        to="/dashboard/admin-profile"
        className={linkClass}
        onClick={closeSidebar}
      >
        <FiUser />
        Admin Profile
      </NavLink>
      <NavLink
        to="/dashboard/manage-users"
        className={linkClass}
        onClick={closeSidebar}
      >
        <FiUsers />
        Manage Users
      </NavLink>
      <NavLink
        to="/dashboard/reported"
        className={linkClass}
        onClick={closeSidebar}
      >
        <FiAlertCircle />
        Reported Comments
      </NavLink>
      <NavLink
        to="/dashboard/make-announcement"
        className={linkClass}
        onClick={closeSidebar}
      >
        <MdCampaign />
        Make Announcement
      </NavLink>
    </nav>
  );
};

export default AdminSidebar;
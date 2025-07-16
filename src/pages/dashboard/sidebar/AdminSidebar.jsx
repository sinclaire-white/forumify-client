import { NavLink } from "react-router";
import { FiUser, FiUsers, FiAlertCircle } from "react-icons/fi";
import { MdCampaign } from "react-icons/md"; // ✅ Replaced FiSpeakerphone

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-100 ${
      isActive ? "bg-blue-200 font-semibold" : ""
    }`;

  return (
    <nav className="flex flex-col gap-3">
      <NavLink to="/dashboard/admin-profile" className={linkClass}>
        <FiUser />
        Admin Profile
      </NavLink>
      <NavLink to="/dashboard/manage-users" className={linkClass}>
        <FiUsers />
        Manage Users
      </NavLink>
      <NavLink to="/dashboard/reported" className={linkClass}>
        <FiAlertCircle />
        Reported Comments
      </NavLink>
      <NavLink to="/dashboard/make-announcement" className={linkClass}>
        <MdCampaign /> {/* ✅ Replaced FiSpeakerphone */}
        Make Announcement
      </NavLink>
    </nav>
  );
};

export default AdminSidebar;

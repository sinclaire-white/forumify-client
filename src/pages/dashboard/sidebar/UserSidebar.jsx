import { NavLink } from "react-router";
import { FiUser, FiPlusSquare, FiList } from "react-icons/fi";

const UserSidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-100 ${
      isActive ? "bg-blue-200 font-semibold" : ""
    }`;

  return (
    <nav className="flex flex-col gap-3">
      <NavLink to="/dashboard/user-profile" className={linkClass}>
        <FiUser />
        My Profile
      </NavLink>
      <NavLink to="/dashboard/add-post" className={linkClass}>
        <FiPlusSquare />
        Add Post
      </NavLink>
      <NavLink to="/dashboard/my-posts" className={linkClass}>
        <FiList />
        My Posts
      </NavLink>
    </nav>
  );
};

export default UserSidebar;

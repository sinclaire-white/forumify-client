import { NavLink } from "react-router";
import { FiUser, FiPlusSquare, FiList } from "react-icons/fi";

const UserSidebar = ({ closeSidebar }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary transition-colors ${
      isActive ? "bg-primary font-semibold" : ""
    }`;

  return (
    <nav className="flex flex-col gap-3">
      <NavLink
        to="/dashboard/user-profile"
        className={linkClass}
        onClick={closeSidebar}
      >
        <FiUser />
        My Profile
      </NavLink>
      <NavLink
        to="/dashboard/add-post"
        className={linkClass}
        onClick={closeSidebar}
      >
        <FiPlusSquare />
        Add Post
      </NavLink>
      <NavLink
        to="/dashboard/my-posts"
        className={linkClass}
        onClick={closeSidebar}
      >
        <FiList />
        My Posts
      </NavLink>
    </nav>
  );
};

export default UserSidebar;
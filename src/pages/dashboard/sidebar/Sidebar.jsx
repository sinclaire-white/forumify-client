import AdminSidebar from "./AdminSidebar";
import UserSidebar from "./UserSidebar";

const Sidebar = ({ role, closeSidebar }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* User Dashboard Links */}
      <div className="mb-4">
        <h2 className="mb-3 text-lg font-semibold text-base-content/80">
          User Dashboard
        </h2>
        <UserSidebar closeSidebar={closeSidebar} />
      </div>

      {/* Admin Dashboard Links (Conditional) */}
      {role === "admin" && (
        <div>
          <hr className="my-6 border-base-300" />
          <h2 className="mb-3 text-lg font-semibold text-primary">
            Admin Dashboard
          </h2>
          <AdminSidebar closeSidebar={closeSidebar} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;

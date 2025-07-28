
import AdminSidebar from "./AdminSidebar";
import UserSidebar from "./UserSidebar";

const Sidebar = ({ role }) => {



console.log("Sidebar loaded with role:", role);


  return (
    <div className="flex flex-col gap-6"> {/* Use a container for both sidebars */}
      {/* Always show User Dashboard links */}
      <div className="mb-4"> {/* Add some bottom margin for separation */}
        <h2 className="mb-3 text-lg font-semibold text-base-content/80">User Dashboard</h2>
        <UserSidebar />
      </div>

      {/* Conditionally show Admin Dashboard links if the role is 'admin' */}
      {role === "admin" && (
        <div>
          <hr className="my-6 border-base-300" /> {/* A visual separator */}
          <h2 className="mb-3 text-lg font-semibold text-primary">Admin Dashboard</h2>
          <AdminSidebar />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
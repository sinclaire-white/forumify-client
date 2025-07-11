import { useState } from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import { FaBell } from "react-icons/fa";

const Navbar = ({ announcementCount = 0 }) => {
  const { user, logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="bg-base-100 text-base-content shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: Logo + Site Name */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <img
            src={"https://i.ibb.co/MjGnyfp/Forumify-logo.png"}
            alt="Forumify Logo"
            className="w-20 h-20 rounded-full"
          />
          Forumify
        </Link>

        {/* Center: Navigation Links */}
        <ul className="hidden md:flex gap-6 font-semibold">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/membership"
              className="hover:text-primary transition-colors"
            >
              Membership
            </Link>
          </li>
        </ul>

        {/* Right: Notification + Auth Buttons */}
        <div className="flex items-center gap-4 relative">
          {/* Notification Icon */}
          <Link
            to="/announcements"
            className="relative text-xl hover:text-primary transition-colors"
          >
            <FaBell />
            {announcementCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-error text-error-content text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {announcementCount}
              </span>
            )}
          </Link>

          {/* User Auth */}
          {!user ? (
            <Link
              to="/login"
              className="btn btn-primary btn-sm whitespace-nowrap"
            >
              Join Us
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="btn btn-ghost btn-circle avatar"
                aria-label="User menu"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User Profile"
                  />
                </div>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-base-200 shadow-lg rounded-lg py-2 text-sm transition-colors">
                  <li className="px-4 py-2 text-gray-500 cursor-default select-none">
                    {user.displayName || "User"}
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-primary hover:text-white"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-primary hover:text-white"
                      onClick={() => {
                        logOut();
                        setDropdownOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Day/Night Toggle Placeholder */}
          <div className="ml-4">
            {/* Insert your day/night toggle component here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

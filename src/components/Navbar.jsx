// Navbar.jsx
import { useState } from "react";
import { Link } from "react-router";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Fetch announcement count
  const { data: announcementCount = 0 } = useQuery({
    queryKey: ["announcementCount"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data.length;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Framer Motion variants for animations
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const mobileMenuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const gradientButtonVariants = {
    initial: { backgroundPosition: "0% 50%" },
    hover: {
      backgroundPosition: "100% 50%",
      scale: 1.05,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    tap: { scale: 0.95 },
  };

  const loggedOutNavLinks = (
    <>
      <li><Link to="/" className="transition-colors hover:text-primary">Home</Link></li>
      <li><Link to="/about" className="transition-colors hover:text-primary">About</Link></li>
      <li><Link to="/faq" className="transition-colors hover:text-primary">FAQ</Link></li>
      <li><Link to="/contact-us" className="transition-colors hover:text-primary">Contact Us</Link></li>
    </>
  );

  const loggedInNavLinks = (
    <>
      <li><Link to="/" className="transition-colors hover:text-primary">Home</Link></li>
      <li><Link to="/dashboard/add-post" className="transition-colors hover:text-primary">Create Post</Link></li>
      <li><Link to="/dashboard/my-posts" className="transition-colors hover:text-primary">Manage Post</Link></li>
      <li><Link to="/membership" className="transition-colors hover:text-primary">Membership</Link></li>
    </>
  );

  return (
    <motion.nav
      className="sticky top-0 z-50 shadow-md bg-base-100 text-base-content"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container flex items-center justify-between px-4 py-2 mx-auto">
        {/* Left: Logo + Site Name */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary"
        >
          <motion.img
            src="https://i.ibb.co/MjGnyfp/Forumify-logo.png"
            alt="Forumify Logo"
            className="w-12 h-12 rounded-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          />
          Forumify
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <ul className="hidden gap-6 font-semibold md:flex">
          {user ? loggedInNavLinks : loggedOutNavLinks}
        </ul>

        {/* Right: Notification + Auth Buttons + Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div
              className="relative text-xl transition-colors text-base-content hover:text-primary"
              aria-label="Announcements"
            >
              <FaBell />
              {announcementCount > 0 && (
                <motion.span
                  className="absolute flex items-center justify-center w-5 h-5 text-xs rounded-full -top-2 -right-2 bg-error text-error-content"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  {announcementCount}
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* User Auth */}
          {!user ? (
            <motion.div
              className="relative inline-block px-4 py-2 text-sm font-semibold rounded-lg text-base-content bg-gradient-to-r from-primary to-secondary"
              variants={gradientButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              <Link to="/login" className="block">
                Join Us
              </Link>
            </motion.div>
          ) : (
            <div className="relative">
              <motion.button
                onClick={toggleDropdown}
                className="btn btn-ghost btn-circle avatar"
                aria-label="User menu"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User Profile"
                  />
                </div>
              </motion.button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.ul
                    className="absolute right-0 z-50 w-48 py-2 mt-2 text-sm rounded-lg shadow-lg bg-base-100"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <li className="px-4 py-2 cursor-default select-none text-base-content">
                      {user.displayName || "User"}
                    </li>
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 transition-colors hover:bg-primary hover:text-base-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        className="w-full px-4 py-2 text-left transition-colors hover:bg-primary hover:text-base-100"
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You will be logged out!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, logout!",
                            background: "#1f2937",
                            color: "#e5e7eb",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              logOut();
                              setDropdownOpen(false);
                              Swal.fire({
                                title: "Logged Out!",
                                text: "You have been logged out successfully.",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false,
                                background: "#1f2937",
                                color: "#e5e7eb",
                              });
                            }
                          });
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden btn btn-ghost btn-circle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed top-0 right-0 z-50 w-3/4 h-full max-w-xs shadow-lg bg-base-100"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-end p-4">
              <button
                className="btn btn-ghost btn-circle"
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <ul className="flex flex-col gap-2 p-4">
              {user ? loggedInNavLinks : loggedOutNavLinks}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

import { useState } from "react";
import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Sidebar from "../pages/dashboard/sidebar/Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const userRole = user?.role || "user";

  // Framer Motion variants for sidebar animation
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar Toggle Button (Mobile Only) */}
        <motion.button
          className="fixed z-50 p-2 text-xl rounded-md md:hidden top-20 left-4 bg-primary text-primary-content"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </motion.button>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop for Mobile */}
              <motion.div
                className="fixed inset-0 z-40 bg-black md:hidden"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={toggleSidebar}
              />
              {/* Mobile Sidebar */}
              <motion.aside
                className="fixed left-0 z-50 w-3/4 h-full max-w-xs p-6 shadow-lg top-16 bg-base-200 md:static md:w-64 md:flex-shrink-0 md:border-r md:border-base-300"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Sidebar role={userRole} closeSidebar={toggleSidebar} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar (Always Visible) */}
        <aside className="flex-shrink-0 hidden w-64 p-6 border-r shadow-lg md:block bg-base-200 border-base-300">
          <Sidebar role={userRole} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto lg:p-10 bg-base-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
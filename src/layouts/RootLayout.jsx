import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar></Navbar>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;

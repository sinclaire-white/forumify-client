import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

import Footer from "../components/Footer";
// import useAuth from "../hooks/useAuth";

const RootLayout = () => {
  // const {loading} = useAuth();




  //  if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <span className="loading loading-spinner loading-lg"></span> {/* Your loading spinner */}
  //     </div>
  //   );
  // }



  
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

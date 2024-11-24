import Navbar from "@/components/navbars/Navbar";
import Sidebar from "@/components/sidebars/Sidebar";
import RightSidebar from "./sidebars/RightSidebar";

const BaseLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex w-full bg-[#F2F4F5] dark:bg-[#161717] p-5 mt-[72px] flex-col md:flex-row items-center">
        {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <main className="flex-1 lg:ml-[200px] lg:mr-[300px] p-5 overflow-y-auto">
            {children}
          </main>

          <RightSidebar />
        </div>
    </div>
  );
};

export default BaseLayout;

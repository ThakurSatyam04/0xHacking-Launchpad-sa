import Navbar from "@/components/navbars/Navbar";
import Sidebar from "@/components/sidebars/Sidebar";
import RightSidebar from "./sidebars/RightSidebar";

const ResourceLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex w-full bg-[#F2F4F5] dark:bg-[#161717] p-5 mt-[72px] flex-col md:flex-row items-center">
        {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <main className="w-full flex-1 lg:ml-[200px] p-5 overflow-y-auto rounded-xl p-5">
            {children}
          </main>
        </div>
    </div>
  );
};

export default ResourceLayout;

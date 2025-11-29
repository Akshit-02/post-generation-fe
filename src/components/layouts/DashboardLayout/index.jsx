import { useState } from "react";
import Sidebar from "../Sidebar";
import TopNav from "../TopNav";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <TopNav toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import Sidebar from "../Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Sidebar />
      <div className={`transition-all duration-300 ml-64`}>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

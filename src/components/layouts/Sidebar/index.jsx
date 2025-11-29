import { signOut } from "aws-amplify/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    name: "Generate Posts",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M12 4v16m8-8H4"></path>
      </svg>
    ),
    path: "/generate",
  },
  {
    name: "Saved Posts",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
      </svg>
    ),
    path: "/saved",
  },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
            N2I
          </div>
          {isOpen && (
            <span className="text-xl font-bold text-gray-900">News2Insta</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 mb-2 rounded-lg transition-all ${
              location.pathname === item.path
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {isOpen && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          {isOpen && (
            <span className="font-medium" onClick={handleLogout}>
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

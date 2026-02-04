import { useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem("token");

    // Redirect to login
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h3 className="text-2xl font-bold text-blue-600">
              Todo-Task Manager
            </h3>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/task-form"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              Add Task
            </NavLink>

            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition duration-200 shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

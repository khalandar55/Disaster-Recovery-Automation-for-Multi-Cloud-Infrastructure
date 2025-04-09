import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg">
      {/* Company Logo */}
      <div className="p-4 flex justify-center">
        <img
          src={require("../assets/companylogo.jpg")} // Adjust the path to your logo
          alt="Company Logo"
          className="w-50 h-50 object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        <ul className="space-y-4"> {/* Add spacing between links */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "p-3 text-blue-600 bg-blue-100 rounded-lg mx-2 block"
                  : "p-3 hover:bg-gray-200 rounded-lg mx-2 block"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/backup"
              className={({ isActive }) =>
                isActive
                  ? "p-3 text-blue-600 bg-blue-100 rounded-lg mx-2 block"
                  : "p-3 hover:bg-gray-200 rounded-lg mx-2 block"
              }
            >
              Backup
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dr-plan"
              className={({ isActive }) =>
                isActive
                  ? "p-3 text-blue-600 bg-blue-100 rounded-lg mx-2 block"
                  : "p-3 hover:bg-gray-200 rounded-lg mx-2 block"
              }
            >
              DR Plan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/lifecycle-policy"
              className={({ isActive }) =>
                isActive
                  ? "p-3 text-blue-600 bg-blue-100 rounded-lg mx-2 block"
                  : "p-3 hover:bg-gray-200 rounded-lg mx-2 block"
              }
            >
              Life Cycle Policy
            </NavLink>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

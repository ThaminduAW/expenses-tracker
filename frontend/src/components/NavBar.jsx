import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Don't show navbar on auth pages
  if (location.pathname === "/signin" || location.pathname === "/signup") {
    return null;
  }

  return (
    <div className="flex flex-col items-center p-10 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="border border-gray-200/80 py-3 px-2 flex gap-2 shadow-lg rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        {/* Dashboard */}
        <Link to="/" className="group relative px-3 cursor-pointer">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${
              location.pathname === "/"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <svg
              className="group-hover:scale-110 transition-transform duration-300"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                strokeWidth={2}
                stroke="currentColor"
              />
            </svg>
          </div>
          <span className="absolute -top-12 left-[50%] -translate-x-[50%] z-20 origin-bottom scale-0 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium shadow-lg transition-all duration-300 ease-in-out group-hover:scale-100 before:absolute before:bottom-[-5px] before:left-[50%] before:-translate-x-[50%] before:border-[6px] before:border-transparent before:border-t-white">
            Dashboard
          </span>
        </Link>

        {/* Analytics - Only show if logged in */}
        {isLoggedIn && (
          <Link to="/analytics" className="group relative px-3 cursor-pointer">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${
                location.pathname === "/analytics"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <svg
                className="group-hover:scale-110 transition-transform duration-300"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 4V10C16 10.5304 16.2107 11.0391 16.5858 11.4142C16.9609 11.7893 17.4696 12 18 12H22M16 4L22 10M16 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V12M16 4V10H22"
                  strokeWidth={2}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 16L10 14L12 16L16 12"
                  strokeWidth={2}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="absolute -top-12 left-[50%] -translate-x-[50%] z-20 origin-bottom scale-0 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium shadow-lg transition-all duration-300 ease-in-out group-hover:scale-100 before:absolute before:bottom-[-5px] before:left-[50%] before:-translate-x-[50%] before:border-[6px] before:border-transparent before:border-t-white">
              Analytics
            </span>
          </Link>
        )}

        {/* Profile/Account */}
        {isLoggedIn && (
          <div className="group relative px-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300">
              <svg
                className="group-hover:scale-110 transition-transform duration-300"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                />
              </svg>
            </div>
            <span className="absolute -top-12 left-[50%] -translate-x-[50%] z-20 origin-bottom scale-0 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium shadow-lg transition-all duration-300 ease-in-out group-hover:scale-100 before:absolute before:bottom-[-5px] before:left-[50%] before:-translate-x-[50%] before:border-[6px] before:border-transparent before:border-t-white">
              Profile
            </span>
          </div>
        )}

        {/* Logout button for logged in users */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="group relative px-3 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-300">
              <svg
                className="group-hover:scale-110 transition-transform duration-300"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                  strokeWidth={2}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="absolute -top-12 left-[50%] -translate-x-[50%] z-20 origin-bottom scale-0 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium shadow-lg transition-all duration-300 ease-in-out group-hover:scale-100 before:absolute before:bottom-[-5px] before:left-[50%] before:-translate-x-[50%] before:border-[6px] before:border-transparent before:border-t-white">
              Logout
            </span>
          </button>
        )}

        {/* Sign In link for non-logged in users */}
        {!isLoggedIn && (
          <Link to="/signin" className="group relative px-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors duration-300">
              <svg
                className="group-hover:scale-110 transition-transform duration-300"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3"
                  strokeWidth={2}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="absolute -top-12 left-[50%] -translate-x-[50%] z-20 origin-bottom scale-0 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium shadow-lg transition-all duration-300 ease-in-out group-hover:scale-100 before:absolute before:bottom-[-5px] before:left-[50%] before:-translate-x-[50%] before:border-[6px] before:border-transparent before:border-t-white">
              Sign In
            </span>
          </Link>
        )}

        {/* Sign Up link for non-logged in users */}
        {!isLoggedIn && (
          <Link to="/signup" className="group relative px-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300">
              <svg
                className="group-hover:scale-110 transition-transform duration-300"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 21V19C16 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M20 8V14M17 11H23M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                  strokeWidth={2}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="absolute -top-12 left-[50%] -translate-x-[50%] z-20 origin-bottom scale-0 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium shadow-lg transition-all duration-300 ease-in-out group-hover:scale-100 before:absolute before:bottom-[-5px] before:left-[50%] before:-translate-x-[50%] before:border-[6px] before:border-transparent before:border-t-white">
              Sign Up
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

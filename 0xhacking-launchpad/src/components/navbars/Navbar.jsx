import React, { useEffect, useState } from "react";
import logo from "@/assets/0xDay_Transprant.svg";
import logo_dark from "../../assets/logo_dark.svg";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeProvider";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme(); // Get the current theme and setter function

  const [onLaunchPade, setOnLaunchpad] = useState(false);
  const [onResource, setOnResource] = useState(false);
  const [onMessage, setOnMessage] = useState(false);

  // Update route-based active state
  useEffect(() => {
    setOnLaunchpad(location.pathname === "/");
    setOnResource(location.pathname === "/resource");
    setOnMessage(location.pathname === "/message");
  }, [location]);

  const toggleMode = (newTheme) => {
    setTheme(newTheme);  // Set the theme using context
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/user/logout", {withCredentials:true});
      if(response.status == 200){
        localStorage.removeItem("user");
        localStorage.removeItem("messages");
        localStorage.removeItem("0xhacking_userId");
        localStorage.removeItem("user_token");
        navigate("/login");
      }    

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-[#161717] shadow-md z-50 border border-[#E6EAF0] dark:border-[#343434]">
      <div className="mx-auto px-6 py-3 flex justify-between items-center">
        <div>
          {theme === "light" ? (
            <img src={logo} alt="Logo" />
          ) : (
            <img src={logo_dark} alt="Dark Logo" />
          )}
        </div>
        <nav className="w-full md:w-[60%] flex flex-wrap md:flex-nowrap gap-2 md:gap-4 items-center justify-between md:justify-start rounded-md p-2">
          {/* Launch Pad NavLink */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1 px-4 py-2 rounded-md transition-all duration-300  ${
                isActive ? "bg-[#F2F3F3] text-[#3A3A3C] dark:bg-[#414143] dark:text-[#BBBBBB]" : "text-gray-500"
              }`
            }
          >
            {onLaunchPade ? (
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#07c271" stroke="#07c271" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-zap">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg> <span className="text-[#3A3A3C] dark:text-[#BBBBBB]">Launch Pad</span> 
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#767676" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-zap">
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
              </svg>
            )}
          </NavLink>

          {/* Resource NavLink */}
          <NavLink
            to="/resource"
            className={({ isActive }) =>
              `flex items-center gap-1 px-4 py-2 rounded-md transition-all duration-300  ${
                isActive ? "bg-[#F2F3F3] text-[#3A3A3C] dark:bg-[#414143] dark:text-[#BBBBBB]" : "text-gray-500"
              }`
            }
          >
            {onResource ? (
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#07c271" stroke="#07c271" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bookmark">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg> <span className="text-[#3A3A3C] dark:text-[#BBBBBB]" >Resources</span>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#767676" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bookmark">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            )}
          </NavLink>

          {/* Message NavLink */}
          <NavLink
            to="/message"
            className={({ isActive }) =>
              `flex items-center gap-1 px-4 py-2 rounded-md transition-all duration-300  ${
                isActive ? "bg-[#F2F3F3] text-[#3A3A3C] dark:bg-[#414143] dark:text-[#BBBBBB]" : "text-gray-500"
              }`
            }
          >
            {onMessage ? (
              <div className="flex">
                <svg xmlns="ht`tp://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#07c271" stroke="#07c271" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg> <span className="text-[#3A3A3C] dark:text-[#BBBBBB]">Messages</span>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
            )}
          </NavLink>
        </nav>

        {/* Theme Toggle Button */}
        <div>
          <div className="flex gap-1 rounded-lg bg-[#E6EAF0] dark:bg-[#1B1B1B] dark:text-[#9A9A9A] p-2">
            {/* Light Mode Button */}
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                theme === "light" ? "bg-white text-[#51AA83] shadow-md" : "bg-transparent text-gray-500 dark:text-gray-400"
              } transition duration-300`}
              onClick={() => toggleMode("light")}
            >
              {theme === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#07c271" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              )} Light Mode 
            </button>

            {/* Dark Mode Button */}
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                theme === "dark" ? "bg-white text-[#51AA83] shadow-md" : "bg-transparent text-gray-500 dark:text-gray-400"
              } transition duration-300`}
              onClick={() => toggleMode("dark")}
            >
               {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#07c271" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
              )} Dark Mode
            </button>
          </div>
        </div>

        {/* Logout Button */}

        <AlertDialog>
            <AlertDialogTrigger asChild>
              <button onClick={handleLogout}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F74F4F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-power"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
        </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>You Are leaving</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure want to log out?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-gray-700 text-white w-20 hover:bg-gray-800 dark:text-black dark:bg-gray-200 dark:hover:bg-gray-300"
                >
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </div>
    </header>
  );
};

export default Navbar;

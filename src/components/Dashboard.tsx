import { Link, Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useState, useEffect } from "react"; // Import useEffect
import { Button } from "./ui/button";
import {
  BotIcon,
  FileScanIcon,
  HomeIcon,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when a link is clicked
  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  // Effect to close sidebar on mobile screens when a link is clicked
  useEffect(() => {
    console.log(window.innerWidth);

    const closeSidebarOnMobile = () => {
      if (window.innerWidth == 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", closeSidebarOnMobile);

    return () => {
      window.removeEventListener("resize", closeSidebarOnMobile);
    };
  }, [setIsSidebarOpen]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`w-64 h-screen bg-gray-800 text-white flex-shrink-0 ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}>
        <div className="p-4">
          <h2 className="text-xl">MSMEs Support</h2>
          <nav className="mt-4">
            <ul>
              <li className="mb-2">
                <Link
                  to={"/dashboard"}
                  className=" p-2 flex items-center gap-3 bg-gray-700 rounded-md hover:bg-gray-600"
                  onClick={handleLinkClick} // Close sidebar on link click
                >
                  <HomeIcon />
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard/transactions"
                  className="p-2 flex items-center gap-3 bg-gray-700 rounded-md hover:bg-gray-600"
                  onClick={handleLinkClick} // Close sidebar on link click
                >
                  <FileScanIcon />
                  Transactions
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard/assistance"
                  className="p-2 flex items-center gap-3 bg-gray-700 rounded-md hover:bg-gray-600"
                  onClick={handleLinkClick} // Close sidebar on link click
                >
                  <BotIcon />
                  Assistance
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          {/* Burger menu for mobile */}
          <button
            className="block md:hidden"
            onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div className="text-blue-500 flex items-center">
            <UserCircleIcon className="mr-1 w-4" /> {auth.currentUser?.email}
          </div>
          <Button
            onClick={handleLogout}
            className=" border-gray-400"
            variant={"link"}>
            Logout <LogOutIcon className="ml-3 w-4" />
          </Button>
        </header>
        <main className="flex-1 w-[100vw] lg:w-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

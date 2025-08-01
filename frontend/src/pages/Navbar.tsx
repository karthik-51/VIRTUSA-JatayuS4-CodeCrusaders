
// Navbar.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Activity,
  PenTool as Tool,
  FileText,
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronDown,
  UserCircle,
  Package,
  Code2,
  Cpu,
  Info,
} from "lucide-react";

interface Props {
  user: { email: string; bank: string } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{ email: string; bank: string } | null>
  >;
}

const Navbar: React.FC<Props> = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(e.target as Node)
      ) {
        setIsServicesOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#232323] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img
              src="/src/assets/logo.jpg"
              alt="Logo"
              className="h-12 w-16 rounded-full object-cover"
            />
            <span className="font-bold text-xl">
              <span className="text-[#0099b5]">
                Jatayu Banking Infrastructure
              </span>{" "}
              Prediction
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-sm font-normal">
            <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" />
            
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[rgba(255,106,0,0.10)] transition-colors text-sm font-medium"
              >
                <div className="flex items-center gap-1">
                  <Package className="h-5 w-5 text-white" />
                  <span>Services</span>
                </div>
                <ChevronDown className="h-4 w-4 text-white" />
              </button>

              {isServicesOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#232323] text-white font-light rounded-lg shadow-xl z-10 overflow-hidden">
                  <Link
                    to="/notifications"
                    onClick={() => setIsServicesOpen(false)}
                    className="flex items-center space-x-3 px-5 py-3 hover:bg-[#2e2e2e] transition-all duration-200"
                  >
                    <Activity className="h-5 w-5 text-orange-400" />
                    <span className="font-normal">Notifications</span>
                  </Link>
                  <Link
                    to="/software"
                    onClick={() => setIsServicesOpen(false)}
                    className="flex items-center space-x-3 px-5 py-3 hover:bg-[#333333] transition-all duration-200"
                  >
                    <Code2 className="h-5 w-5 text-blue-400" />
                    <span className="font-normal">Software Prediction</span>
                  </Link>
                  <Link
                    to="/hardware"
                    onClick={() => setIsServicesOpen(false)}
                    className="flex items-center space-x-3 px-5 py-3 hover:bg-[#3a3a3a] transition-all duration-200"
                  >
                    <Cpu className="h-5 w-5 text-green-400" />
                    <span className="font-normal">Hardware Prediction</span>
                  </Link>
                  <Link
                    to="/report"
                    onClick={() => setIsServicesOpen(false)}
                    className="flex items-center space-x-3 px-5 py-3 hover:bg-[#444] transition-all duration-200"
                  >
                    <FileText className="h-5 w-5 text-yellow-400" />
                    <span className="font-normal">Report</span>
                  </Link>
                </div>
              )}
            </div>
            <NavLink
              to="/maintenance"
              icon={<Tool className="h-5 w-5" />}
              text="Maintenance"
            />
            <NavLink
              to="/about"
              icon={<Info className="h-5 w-5" />}
              text="About Us"
            />
            {!user ? (
              <>
                <NavLink
                  to="/signup"
                  icon={<UserPlus className="h-5 w-5" />}
                  text="Sign Up"
                />
                <NavLink
                  to="/login"
                  icon={<LogIn className="h-5 w-5" />}
                  text="Login"
                />
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-[rgba(255,106,0,0.10)] transition-colors"
                >
                  <UserCircle className="h-6 w-6 text-white" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[300px] h-[150px] bg-white text-black rounded-xl shadow-2xl z-10 p-5 text-sm font-normal space-y-3">
                    <p className="text-[15px] font-semibold text-gray-800">
                      ✉️ <span className="ml-1 text-sm">Email:</span>{" "}
                      <span className="font-normal text-sm text-[#009536]">
                        {user.email}
                      </span>
                    </p>
                    <p className="text-[14px] text-gray-700">
                      🏦&nbsp;&nbsp;
                      <span className="font-medium text-sm">Bank:</span>{" "}
                      <span className="font-normal text-sm text-[#ff2200]">
                        {user.bank}
                      </span>
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={handleLogout}
                        className="mt-4 bg-gradient-to-r from-[#ff2200] to-[#434343] text-white font-medium px-6 py-2 rounded-full transition-all duration-300 shadow-md"
                        style={{
                          boxShadow: "0 4px 16px 0 rgba(35,35,35,0.68)",
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-[rgba(255,106,0,0.10)] focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function NavLink({
  to,
  icon,
  text,
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors
        ${isActive ? "bg-[rgba(255,106,0,0.15)] text-[#0099b5]" : "text-white"}
        hover:bg-[rgba(255,106,0,0.10)] hover:text-[#0099b5]`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

export default Navbar;

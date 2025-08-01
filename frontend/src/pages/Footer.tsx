// Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#232323] text-white -mt-10">
      <div
        className="max-w-7xl mx-auto px-4 py-3 h-[50px]"
        style={{ paddingTop: "5", paddingBottom: "0" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/src/assets/logo.jpg"
              alt="Logo"
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="font-bold text-base">
              Jatayu Banking Infrastructure Prediction
            </span>
          </div>

          <div className="mt-2 md:mt-0 flex items-center gap-4 text-sm">
            <p className="text-gray-300">
              &copy; 2025 Jatayu Banking Infrastructure Prediction. All rights reserved.
            </p>

            <Link
              to="/contact"
              className="underline transition"
              style={{
                color: "#00b8d9",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#00b8d9 ")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#0099b5")
              }
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

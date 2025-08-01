
import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <AlertCircle className="text-red-500 w-16 h-16" />
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg">The page you’re looking for doesn’t exist.</p>
      <Link
        to="/"
        className="mt-4 px-6 py-2 bg-[#0099b5] text-white rounded-full hover:bg-[#007c99] transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;

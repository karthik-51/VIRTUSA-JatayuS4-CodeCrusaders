import React from "react";

const ContactPage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('https://www.sbbit.jp/article/image/128802/bit202312051439465986.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        width: "100vw",
        margin: 0,
        padding: "20px",
        marginRight: "50px",
        marginLeft: "-30px",
        marginTop: "-24px",
      }}
    >
      <div
        className="w-[480px] bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl"
        style={{
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
        }}
      >
        <h2 className="text-3xl font-bold text-center text-[#00188c] mb-6 flex items-center justify-center gap-2">
          Contact Us
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#232323] mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#232323] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#232323] mb-1">
              Phone Number <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#232323] mb-1">
              Purpose of Contact
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select an option</option>
              <option value="ai-alert">False or Missing AI Alerts</option>
              <option value="data-report">Incorrect Report or Logs</option>
              <option value="login-access">Login / Access Problem</option>
              <option value="integration">Integration/API Failure</option>
              <option value="dashboard">
                Dashboard UI/Functionality Issue
              </option>
              <option value="other">Other Technical/Service Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#232323] mb-1">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              style={{
                backgroundImage: "linear-gradient(to right, #00baec, #434343)", // Two-shade gradient
              }}
              className="text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-200 hover:opacity-90"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;

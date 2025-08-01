import React from "react";

function MaintenanceShowcase() {
  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-blue-50 to-white min-h-screen space-y-14 font-sans">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold mb-2">
          🔧 <span className="text-[#0099b5]">Smart Banking</span>{" "}
          <span className="text-[#232323]">Maintenance</span>
        </h1>

        <p className="text-gray-700 text-base max-w-2xl mx-auto font-bold">
          Secure. Predict. Maintain. We cover everything from ATM hardware to
          fraud detection.
        </p>
      </header>

      {/* Services */}

      <div className="relative w-[600px] h-[600px] mx-auto mt-10">
        <div className="absolute top-[10%] -left-[25%] w-150 h-20 bg-white shadow-lg rounded-xl flex items-center justify-center -mr-100">
          <div
            className="flex flex-col md:flex-row items-center bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition duration-300"
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.90)",
            }}
          >
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                src="https://mycomputerworks.com/wp-content/uploads/2023/04/shutterstock_2058513980-scaled.jpg"
                alt="Software Updates"
                className="w-32 h-32 object-cover rounded-full shadow-lg"
                style={{
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.95)",
                }}
              />
            </div>

            <div className="flex-1 space-y-3 text-left">
              <h3 className="text-xl font-bold text-[#00188c]">
                💻 Software Updates
              </h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Auto-updates for YONO, iMobile, etc.</li>
                <li>Cybersecurity patches</li>
                <li>Uptime optimization</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute top-[10%] -right-[25%] w-150 h-20 bg-white shadow-lg rounded-xl flex items-center justify-center">
          <div
            className="flex flex-col md:flex-row items-center bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition duration-300"
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.90)",
            }}
          >
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-[#00188c]">
                🏧 ATM Maintenance
              </h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>24/7 diagnostics</li>
                <li>Power & vibration checks</li>
                <li>Field engineer support</li>
              </ul>
            </div>

            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6">
              <img
                src="https://jupiter.money/blog/wp-content/uploads/2022/07/7.-Guide_to_atm.jpg"
                alt="ATM Maintenance"
                className="w-32 h-32 object-cover rounded-full shadow-lg"
                style={{
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.95)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="absolute top-[45%] -left-[45%] w-150 h-20 bg-white shadow-lg rounded-xl flex items-center justify-center">
          <div
            className="flex flex-col md:flex-row items-center bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition duration-300"
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.90)",
            }}
          >
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                src="https://thumbs.dreamstime.com/b/network-operations-center-monitoring-management-information-generative-ai-271783789.jpg"
                alt="Network Monitoring"
                className="w-32 h-32 object-cover rounded-full shadow-lg"
                style={{
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.95)",
                }}
              />
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-[#00188c]">
                🌐 Network Monitoring
              </h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Firewall & VPN checks</li>
                <li>Uptime boosts</li>
                <li>Bandwidth insights</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute top-[45%] -right-[45%] w-150 h-20 bg-white shadow-lg rounded-xl flex items-center justify-center">
          <div
            className="flex flex-col md:flex-row items-center bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition duration-300"
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.90)",
            }}
          >
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-[#00188c]">
                🧠 AI Fraud Detection
              </h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Live anomaly alerts</li>
                <li>Login & transaction scan</li>
                <li>Integration with gateways</li>
              </ul>
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6">
              <img
                src="https://rtslabs.com/wp-content/uploads/2024/04/fraud-detection2.jpeg"
                alt="AI Fraud Detection"
                className="w-32 h-32 object-cover rounded-full shadow-lg"
                style={{
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.95)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-[10%] -left-[25%] w-150 h-20 bg-white shadow-lg rounded-xl flex items-center justify-center">
          {" "}
          <div
            className="flex flex-col md:flex-row items-center bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition duration-300"
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.90)",
            }}
          >
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                src="https://img.freepik.com/premium-photo/image-showing-core-banking-systems-connections_168501-2172.jpg"
                alt="Core Banking Support"
                className="w-32 h-32 object-cover rounded-full shadow-lg"
                style={{
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.95)",
                }}
              />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-[#00188c]">
                🧾 Core Banking Support
              </h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>CBS uptime monitoring</li>
                <li>Latency & crash tracking</li>
                <li>Payment processing help</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[10%] -right-[25%] w-150 h-20 bg-white shadow-lg rounded-xl flex items-center justify-center">
          <div
            className="flex flex-col md:flex-row items-center bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition duration-300"
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.90)",
            }}
          >
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-[#00188c]">
                🛠️ On-site Field Repair
              </h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Quick technician dispatch</li>
                <li>Spare & fix scheduling</li>
                <li>Component-level services</li>
              </ul>
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6">
              <img
                src="https://tse4.mm.bing.net/th/id/OIP.yamffvVFWYqULNmism13CgHaFc?pid=Api&P=0&h=180"
                alt="On-site Repair"
                className="w-32 h-32 object-cover rounded-full shadow-lg"
                style={{
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.95)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <section
        className="relative py-16 px-6 text-white"
        style={{
          backgroundImage: `url('https://image.freepik.com/free-vector/banking-business-banner-finance-savings-bank-building-silhouette-city-background_48369-11853.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "40px",
          boxShadow: "0 25px 35px rgba(0, 0, 0, 0.95)",
        }}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-70"
          style={{ borderRadius: "40px" }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-14">
            📦 Maintenance Plans
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-[#1e293b] text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition border-t-4 border-green-400">
              <h3 className="text-xl font-bold mb-2">🟢 Basic</h3>
              <p className="text-4xl font-extrabold mb-1">$49</p>
              <p className="text-gray-300 text-sm mb-6">
                Monthly software & ATM checks. Light AI alerts.
              </p>
              <ul className="text-sm text-left space-y-2 pl-4 text-gray-300">
                <li>✅ ATM logs & minor patching</li>
                <li>✅ Monthly uptime reports</li>
              </ul>
              <button className="mt-6 px-6 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition">
                Choose Plan
              </button>
            </div>

            <div className="bg-[#1e293b] text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition border-t-4 border-blue-500 scale-105">
              <h3 className="text-xl font-bold mb-2">🔵 Standard</h3>
              <p className="text-4xl font-extrabold mb-1">$99</p>
              <p className="text-gray-300 text-sm mb-6">
                Weekly diagnostics, CBS & fraud checks, network audits.
              </p>
              <ul className="text-sm text-left space-y-2 pl-4 text-gray-300">
                <li>✅ Fraud AI scan & reports</li>
                <li>✅ CBS latency analysis</li>
              </ul>
              <button className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition">
                Choose Plan
              </button>
            </div>

            <div className="bg-[#1e293b] text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition border-t-4 border-purple-500">
              <h3 className="text-xl font-bold mb-2">🟣 Premium</h3>
              <p className="text-4xl font-extrabold mb-1">$149</p>
              <p className="text-gray-300 text-sm mb-6">
                24/7 AI monitoring, full hardware/software care, on-call help.
              </p>
              <ul className="text-sm text-left space-y-2 pl-4 text-gray-300">
                <li>✅ 24x7 on-site dispatch</li>
                <li>✅ Full-service SLA tracking</li>
              </ul>
              <button className="mt-6 px-6 py-2 bg-purple-500 text-white font-semibold rounded-full hover:bg-purple-600 transition">
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <footer className="text-center py-12 space-y-4">
        <h3 className="text-2xl font-bold" style={{ color: "#0099b5" }}>
          🚀 Ready to Protect Your Bank?
        </h3>
        <p className="text-gray-600">
          Click below to explore our full maintenance offerings.
        </p>

        <button
          className="text-white px-8 py-2 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          style={{
            backgroundImage: "linear-gradient(to right, #0099b5, #434343)",
            boxShadow: "0 10px 10px rgba(0, 0, 0, 0.95)",
          }}
        >
          🛒 Buy Maintenance Services
        </button>
      </footer>
    </div>
  );
}

export default MaintenanceShowcase;

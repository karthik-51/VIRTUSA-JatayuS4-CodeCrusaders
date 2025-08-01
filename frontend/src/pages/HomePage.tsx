import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  Landmark,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const images = [
  "https://www.itp.net/cloud/2022/09/19/shutterstock_2060538899.jpg",
  "https://img.freepik.com/premium-vector/banking-finance-concept-illustration_387612-169.jpg?w=740",
  "https://www.nelsonmullins.com/storage/4oWnpn9tVo1G7Qzs3WoOdzMtgMrgxpFP75fXcBzD.jpg",
];

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-screen overflow-x-hidden m-0 p-0 -ml-8 -mt-6">
      <div
        className="relative w-full h-[90vh] px-4 py-16 bg-cover bg-center text-gray-800 transition-all duration-500"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
        }}
      >
        {/* Hero Section */}
        <section className="relative z-30 flex items-center justify-center text-center h-full">
          {/* Overlay box */}
          <div
            className="bg-[#232323]/50 rounded-3xl p-10 max-w-2xl text-white backdrop-blur-md shadow-2xl"
            style={{
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.95)",
            }}
          >
            <div className="flex justify-center items-center py-6">
              <Landmark className="h-20 w-20 text-[#0099b5]" />
            </div>

            <h1 className="text-2xl font-bold mb-4">
              Predictive Maintenance for Banking Infrastructure
            </h1>
            <p className="text-base font-medium text-white/90 mb-8">
              Prevent downtime, reduce costs, and optimize your banking
              infrastructure with our advanced predictive maintenance solutions.
            </p>

            {!localStorage.getItem("token") && (
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/SignUp"
                  className="inline-flex items-center px-6 py-2 text-white rounded-full shadow-lg transform hover:scale-105 transition duration-300"
                  style={{
                    backgroundImage:
                      "linear-gradient(to left, #333333, #000000)",
                    boxShadow: "0 4px 16px 0 rgba(35,35,35,0.98)",
                  }}
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/Login"
                  className="inline-flex items-center px-6 py-2 text-white rounded-full shadow-lg transform hover:scale-105 transition duration-300"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #0099b5, #434343)",
                    boxShadow: "0 4px 16px 0 rgba(35,35,35,0.98)",
                  }}
                >
                  Login <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="bg-white w-full py-16">
        {/* Features Section */}
        <section className="mb-20 px-4 py-12 bg-white -mt-10">
          <div className="flex items-center justify-center gap-2 mb-12">
            <BadgeCheck className="h-8 w-8 text-[#0099b5]" />
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Key Features
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div
              className="bg-white rounded-2xl overflow-hidden transition transform hover:scale-105 w-[350px]"
              style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.65)" }}
            >
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.xzEElLepqTFToE1Vw4sk6wHaEO?pid=Api&P=0&h=180"
                alt="Proactive Protection"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg mb-4 mx-auto"
                  style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)" }}
                >
                  <Shield className="h-8 w-8 text-gray-900 mb-2" />
                </div>
                <h3
                  style={{
                    color: "#00188c",
                    fontWeight: "700",
                    fontSize: "16px",
                    marginBottom: "8px",
                  }}
                >
                  PROACTIVE PROTECTION
                </h3>
                <p className="text-sm text-gray-700">
                  Identify and address potential issues before they impact your
                  banking operations.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="bg-white rounded-2xl overflow-hidden transition transform hover:scale-105 w-[350px]"
              style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.65)" }}
            >
              <img
                src="https://tse3.mm.bing.net/th/id/OIP.0vjry5mNBYo4h9fXkDwSywHaDt?pid=Api&P=0&h=180"
                alt="Real-time Monitoring"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg mb-4 mx-auto"
                  style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)" }}
                >
                  <Clock className="h-8 w-8 text-gray-900 mb-2" />
                </div>
                <h3
                  style={{
                    color: "#00188c",
                    fontWeight: "700",
                    fontSize: "16px",
                    marginBottom: "8px",
                  }}
                >
                  REAL-TIME MONITORING
                </h3>
                <p className="text-sm text-gray-700">
                  24/7 monitoring of your hardware and software infrastructure
                  components.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="bg-white rounded-2xl overflow-hidden transition transform hover:scale-105 w-[350px]"
              style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.65)" }}
            >
              <img
                src="https://i.pinimg.com/originals/16/af/1a/16af1afd82b9a6639cc972c45a797192.jpg"
                alt="Predictive Analytics"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg mb-4 mx-auto"
                  style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)" }}
                >
                  <TrendingUp className="h-8 w-8 text-gray-900 mb-2" />
                </div>
                <h3
                  style={{
                    color: "#00188c",
                    fontWeight: "700",
                    fontSize: "16px",
                    marginBottom: "8px",
                  }}
                >
                  PREDICTIVE ANALYTICS
                </h3>
                <p className="text-sm text-gray-700">
                  Advanced analytics to forecast maintenance needs and optimize
                  performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section
          className="relative h-[300px] bg-cover bg-center overflow-hidden -mt-[30px] mx-auto"
          style={{
            backgroundImage:
              "url('https://revenuesandprofits.com/wp-content/uploads/2019/05/trading.jpeg')",
            width: "1200px",
            borderRadius: "15px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.95)",
          }}
        >
          {/* Left text block */}
          <div
            className="absolute left-10 top-1/2 transform -translate-y-1/2 z-10 p-10 rounded-3xl shadow-xl max-w-md"
            style={{
              backgroundColor: "rgba(35, 35, 35, 0.9)",
              backdropFilter: "blur(6px)",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.95)",
            }}
          >
            <h2
              className="text-3xl font-bold mb-4 text-center"
              style={{ color: "#0099b5" }}
            >
              🏆 Why Choose Our Solution?
            </h2>
            <p className="text-base text-[#d3d4d5] leading-relaxed text-center">
              Discover how our predictive maintenance enhances uptime, reduces
              cost, and accelerates response.
            </p>
          </div>

          {/* Horizontal scroll cards */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 overflow-hidden z-0 w-[800px] mr-[20px] ">
            <div
              className="flex gap-8 animate-slide-horizontal w-max"
              style={{ animationDuration: "20s" }}
            >
              {Array(3)
                .fill([
                  { number: "99.9%", text: "System Uptime" },
                  { number: "45%", text: "Cost Reduction" },
                  { number: "2x", text: "Faster Response" },
                ])
                .flat()
                .map((stat, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] max-w-[200px] bg-white/90 text-gray-900 p-6 rounded-xl shadow-xl text-center"
                    style={{ boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.55)" }}
                  >
                    <p className="text-3xl font-bold text-[#00188c]">
                      {stat.number}
                    </p>
                    <p className="mt-2 text-sm font-medium">{stat.text}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Animation CSS */}
          <style>{`
            @keyframes slide-horizontal {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-slide-horizontal {
              animation: slide-horizontal 20s linear infinite;
            }
          `}</style>
        </section>

        {/* CTA Section */}
        <section className="text-center px-4 py-16 bg-gradient-to-br from-[#fdfdfd] to-[#f3f4f6]">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#232323] mb-6 tracking-tight leading-tight">
            🏦 Ready to Optimize Your Banking Infrastructure?
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-10 max-w-3xl mx-auto">
            Start preventing issues before they occur with our predictive
            maintenance platform — smarter insights, fewer downtimes.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/hardware"
              className="inline-flex items-center px-4 py-2 text-white rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: "linear-gradient(to right, #00baec, #434343)",
                boxShadow: "0 8px 10px rgba(0, 0, 0, 0.95)",
              }}
            >
              ⚙️ Explore Hardware Solutions
            </Link>

            <Link
              to="/software"
              className="inline-flex items-center px-4 py-2 border-1 border-[#232323] text-[#232323] bg-white rounded-full font-semibold hover:bg-[#f2f2f2] shadow-md transform hover:scale-105 transition duration-300 h-[40px]"
              style={{ boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.95)" }}
            >
              💻 Explore Software Solutions
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;

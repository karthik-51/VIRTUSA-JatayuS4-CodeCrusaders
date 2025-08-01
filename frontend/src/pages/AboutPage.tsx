import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const testimonials = [
  {
    name: "Neha Sharma",

    feedback:
      "Jatayu transformed how we manage ATM maintenance. With real-time alerts and AI-based predictions, our downtime dropped significantly.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rohan Mehta",
    feedback:
      "The system’s ability to analyze both hardware and software performance has helped us prevent major failures. Reporting is intuitive too.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Anjali Rao",
    feedback:
      "Secure monitoring and anomaly detection helps us stay ahead of threats. We trust Jatayu with our critical infrastructure.",
    image: "https://randomuser.me/api/portraits/women/41.jpg",
  },
  {
    name: "Kunal Verma",
    feedback:
      "The prediction modules are reliable and accurate. We've been able to schedule hardware replacements well before issues arise.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Priya Desai",
    feedback:
      "Jatayu's integration was smooth. It’s now a key part of how we operate and maintain our digital banking infrastructure.",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
  },
];

const NotificationPanel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((index + 1) % testimonials.length);
  const prev = () =>
    setIndex((index - 1 + testimonials.length) % testimonials.length);

  const visible = [
    testimonials[(index - 1 + testimonials.length) % testimonials.length],
    testimonials[index],
    testimonials[(index + 1) % testimonials.length],
  ];

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center gap-20 p-6">
      {/* === About Us Section === */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-20 lg:gap-x-16 max-w-6xl w-full">
        <div className="lg:w-1/2 text-gray-900 px-4 text-center lg:text-left ml-[-15px] lg:mr-8">
          <h2 className="text-4xl font-bold text-[#0099b5] mb-6 text-center">
            About Us
          </h2>
          <p className="mb-6 text-base leading-relaxed text-justify">
            At{" "}
            <span className="font-semibold text-[#0099b5]">
              Jatayu Banking Infrastructure Services
            </span>
            , we transform traditional banking maintenance using cutting-edge
            technologies like <strong>AI</strong>, <strong>ML</strong>. Our goal
            is to help banks shift from reactive to predictive maintenance
            strategies, ensuring reduced downtime, uninterrupted banking
            services, and optimized resource usage.
          </p>
          <p className="text-base leading-relaxed text-justify">
            Our intelligent systems monitor <strong>ATMs</strong>,{" "}
            <strong>servers</strong>, and
            <strong> online platforms</strong> by analyzing real-time and
            historical data to detect patterns and anomalies. We automate
            alerts, extend asset lifespans, and reduce costs. By converting data
            into actionable insights, we empower financial institutions to boost
            operational efficiency and deliver a seamless banking experience to
            their customers.
          </p>

          <section className="text-white py-8 px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
              {[
                { icon: <Cpu size={20} />, title: "Predictive Maintenance" },
                {
                  icon: <ShieldCheck size={20} />,
                  title: "Secure System Monitoring",
                },
                {
                  icon: <Activity size={20} />,
                  title: "AI & ML-Based Insights",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#274e84] p-4 rounded-3xl shadow-md flex flex-col items-center space-y-2 w-[150px] h-[110px]"
                  style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.95)" }}
                >
                  <div className="bg-[#3e6fb4] p-2 rounded-full flex justify-center items-center">
                    {item.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-semibold leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div
          className="relative w-72 h-72 shrink-0 lg:ml-8"
          style={{
            filter: "drop-shadow(20px 30px 30px rgba(0,0,0,0.95))",
            WebkitFilter: "drop-shadow(20px 30px 30px rgba(0,0,0,0.95))",
          }}
        >
          <div
            className="w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: "url('https://logodix.com/logo/871229.jpg')",
              clipPath: "polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-center -mb-2 text-[#0099b5]">
        Explore Jatayu Banking Infrastructure{" "}
        <span className="text-[#232323]">Services</span>
      </h1>

      {[
        {
          title: "Notifications",
          text: `Users can customize their notification preferences by selecting alert types and setting a timer interval for how often alerts are sent.`,
          image:
            "https://interestingengineering.com/_next/image?url=https:%2F%2Fimages.interestingengineering.com%2F2023%2F03%2F03%2Fimage%2Fjpeg%2F8ny9fjZXd94458iqKgCyskgeEKssPLfW4cWYZt8M.jpg&w=3840&q=75",
          badge:
            "https://cdn4.vectorstock.com/i/1000x1000/81/53/notification-message-bell-icon-vector-41248153.jpg",
        },
        {
          title: "Software Predictions",
          text: `The SoftwarePrediction component monitors banking software in real-time by assessing key metrics like error rate, response time, crash frequency, and uptime.`,
          image:
            "https://mycomputerworks.com/wp-content/uploads/2023/04/shutterstock_2058513980-scaled.jpg",
        },
        {
          title: "Hardware Predictions",
          text: `The HardwarePrediction component monitors ATM hardware by fetching key metrics like CPU, memory, temperature, vibration, and power.`,
          image:
            "https://cdn.sigma.software/wp-content/uploads/2022/01/blog-data-AI-banking.png",
        },
        {
          title: "Comprehensive Alert Reporting",
          text: `Report Component generates detailed performance reports by selecting a date range to analyze hardware and software alerts.`,
          image:
            "https://img.freepik.com/premium-photo/ai-generated-screen-displaying-multiple-financial-reports-graphs-pie_441362-5034.jpg",
          badge:
            "https://tse4.mm.bing.net/th/id/OIP.M1j60NUSs4m-hyJ9gYadEQHaGw?pid=Api&P=0&h=180",
        },
      ].map((block, idx) => (
        <div
          key={idx}
          className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl w-full last:-mb-20"
        >
          <div className="relative md:w-[400px] w-full h-[200px] flex justify-center">
            <img
              src={block.image}
              alt="Tech Visual"
              className="object-cover w-full h-72 md:h-full rounded-[30px]"
              style={{ boxShadow: "10px 15px 20px rgba(0, 0, 0, 0.95)" }}
            />
            {block.badge && (
              <img
                src={block.badge}
                alt="Notification Icon"
                className="absolute -top-10 -left-10 w-20 h-20 rounded-full p-1"
                style={{ boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.95)" }}
              />
            )}
          </div>

          <div
            className="w-full md:w-[450px] bg-[#232323] border border-gray-700 rounded-3xl p-6 h-[150px]"
            style={{ boxShadow: "10px 15px 20px rgba(0, 0, 0, 0.95)" }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-[#0099b5]">
              {block.title}
            </h2>
            <p className="text-xs text-gray-300 font-semibold text-center">
              {block.text}
            </p>
          </div>
        </div>
      ))}

      {/* === Testimonial Section === */}
      <div className="-pt-20 text-center w-full mb-20">
        <div className="pt-24 text-center w-full">
          <h2 className="text-3xl font-bold text-[#0099b5] mb-2 pb-10">
            Hear from Our Customers
          </h2>

          <div className="relative max-w-6xl mx-auto flex items-center justify-center space-x-4">
            <button onClick={prev} className="text-gray-500 hover:text-black">
              <ChevronLeft size={32} />
            </button>

            <div className="flex space-x-6 w-full justify-center">
              {visible.map((t, i) => (
                <div
                  key={t.name}
                  className={`bg-white text-gray-800 shadow-md rounded-xl px-6 py-6 transition-all duration-300 ${
                    i === 1 ? "scale-110 shadow-xl" : "scale-95 opacity-80"
                  } w-[280px]`}
                  style={{
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.85)",
                    borderRadius: "25px",
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-16 h-16 rounded-full border-4 border-white -mt-12"
                    />
                  </div>
                  <p className="text-sm text-gray-700 italic mb-3">
                    “{t.feedback}”
                  </p>
                  <h4 className="text-[#0099b5] font-bold">{t.name}</h4>
                </div>
              ))}
            </div>

            <button onClick={next} className="text-gray-500 hover:text-black">
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;

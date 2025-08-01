
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Download } from "lucide-react";
import axios from "axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Interface for alert data structure
interface Alert {
  software?: string;
  system?: string;
  atm?: string;
  status: "Healthy" | "Warning" | "Critical";
  timestamp: string;
}

// Interface for alerts data organized by bank
interface AlertsData {
  [bank: string]: Alert[];
}

const Report: React.FC = () => {
  // State variables for alerts, bank selection, date range, and loading status
  const [hardwareAlerts, setHardwareAlerts] = useState<AlertsData>({});
  const [softwareAlerts, setSoftwareAlerts] = useState<AlertsData>({});
  const [userBank, setUserBank] = useState<string | null>(null); // Bank associated with the logged-in user
  const [selectedBank, setSelectedBank] = useState<string>(""); // Bank selected in the dropdown
  const [matchedBankKey, setMatchedBankKey] = useState<string>(""); // Actual bank key found in data
  const [fromDate, setFromDate] = useState<string>(""); // Start date for filtering
  const [toDate, setToDate] = useState<string>(""); // End date for filtering
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false); // Loading indicator for PDF download

  //  function to filter alerts based on the selected date range
  const filterByDate = (alerts: Alert[] = []) => {
    if (!fromDate && !toDate) return alerts; // If no dates, return all alerts

    return alerts.filter((alert) => {
      const alertDate = new Date(alert.timestamp);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && alertDate < from) return false; // Exclude alerts before 'from' date
      if (to) {
        // For 'to' date, include the entire day up to the very end
        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);
        if (alertDate > toEnd) return false; // Exclude alerts after 'to' date
      }
      return true;
    });
  };

  // Effect hook to fetch user's bank from the backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/get-bank", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
        withCredentials: true, // Send cookies with the request
      })
      .then((res) => {
        setUserBank(res.data.bank); // Set the user's bank
      })
      .catch((err) => {
        console.error("Error fetching user bank:", err);
        setUserBank(null); // Set to null on error
      });
  }, []); // Empty dependency array means this runs once on mount

  // Effect hook to fetch hardware and software alerts data
  useEffect(() => {
    const fetchData = () => {
      // Fetch hardware alerts history
      fetch("http://localhost:5000/api/hardware-alerts")
        .then((res) => res.json())
        .then((data) => setHardwareAlerts(data))
        .catch((err) => console.error("Error fetching hardware alerts:", err));

      // Fetch software alerts history
      fetch("http://localhost:5000/api/software-alerts")
        .then((res) => res.json())
        .then((data) => setSoftwareAlerts(data))
        .catch((err) => console.error("Error fetching software alerts:", err));
    };

    fetchData(); // Fetch data initially
    const interval = setInterval(fetchData, 20000); // Refresh data every 20 seconds
    return () => clearInterval(interval); 
  }, []); // Empty dependency array means this runs once on mount

  // Effect hook to determine the matched bank key based on userBank or selectedBank
  useEffect(() => {
    const allBankKeys = Array.from(
      new Set([...Object.keys(hardwareAlerts), ...Object.keys(softwareAlerts)])
    );

    let currentSelection = selectedBank;
    if (userBank && !selectedBank) {
      currentSelection = userBank;
    }

    const match = allBankKeys.find(
      (key) =>
        key.toLowerCase().replace(/\s+/g, "") ===
          currentSelection.toLowerCase().replace(/\s+/g, "") ||
        key.toLowerCase().includes(currentSelection.toLowerCase()) ||
        currentSelection.toLowerCase().includes(key.toLowerCase())
    );
    setMatchedBankKey(match || currentSelection); 
    if (userBank && !selectedBank) {
      setSelectedBank(match || userBank); 
    }
  }, [selectedBank, hardwareAlerts, softwareAlerts, userBank]);

  // Helper function to count alerts by status (Healthy, Warning, Critical)
  const getStatusCounts = (alerts: Alert[] = []) => {
    const counts = { Healthy: 0, Warning: 0, Critical: 0 };
    alerts.forEach((alert) => {
      counts[alert.status] = (counts[alert.status] || 0) + 1;
    });
    return counts;
  };

  // Filtered alerts for display on the frontend
  const filteredHardwareAlerts = filterByDate(
    hardwareAlerts[matchedBankKey] || []
  );
  const filteredSoftwareAlerts = filterByDate(
    softwareAlerts[matchedBankKey] || []
  );

  // Get status counts for filtered alerts
  const hardwareStatusCounts = getStatusCounts(filteredHardwareAlerts);
  const softwareStatusCounts = getStatusCounts(filteredSoftwareAlerts);

  // Calculate total alerts
  const totalHardwareAlerts = filteredHardwareAlerts.length;
  const totalSoftwareAlerts = filteredSoftwareAlerts.length;

  // Data for Hardware Pie Chart (Warning and Critical only)
  const hardwarePieData = {
    labels: ["Warning", "Critical"],
    datasets: [
      {
        label: "Hardware Status",
        data: [
          hardwareStatusCounts.Warning || 0,
          hardwareStatusCounts.Critical || 0,
        ],
        backgroundColor: ["#facc15", "#ef4444"], 
        borderWidth: 1,
      },
    ],
  };

  // Data for Software Pie Chart (Warning and Critical only)
  const softwarePieData = {
    labels: ["Warning", "Critical"],
    datasets: [
      {
        label: "Software Status",
        data: [
          softwareStatusCounts.Warning || 0,
          softwareStatusCounts.Critical || 0,
        ],
        backgroundColor: ["#f97316", "#dc2626"], 
        borderWidth: 1,
      },
    ],
  };

  // Data for Hardware Bar Chart (Warning and Critical only)
  const hardwareChartData = {
    labels: ["Warning", "Critical"],
    datasets: [
      {
        label: "Hardware Alerts",
        data: [
          hardwareStatusCounts.Warning || 0,
          hardwareStatusCounts.Critical || 0,
        ],
        backgroundColor: ["#facc15", "#ef4444"],
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  // Data for Software Bar Chart (Warning and Critical only)
  const softwareChartData = {
    labels: ["Warning", "Critical"],
    datasets: [
      {
        label: "Software Alerts",
        data: [
          softwareStatusCounts.Warning || 0,
          softwareStatusCounts.Critical || 0,
        ],
        backgroundColor: ["#f97316", "#dc2626"],
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  // Common options for Bar charts (white text for dark background)
  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#ffffff" } },
      tooltip: { bodyColor: "#fff", titleColor: "#fff" },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  // Options for Pie charts (white legend text)
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
      tooltip: {
        bodyColor: "#fff",
        titleColor: "#fff",
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw;
            const dataset = context.dataset;
            const dataArr = dataset.data;
            const total = dataArr.reduce(
              (acc: number, curr: number) => acc + curr,
              0
            );
            if (total === 0) return label; // avoid division by zero and empty labels when no data
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Data for ATM-wise breakdown Bar Chart
  const atms = Array.from(
    new Set(filteredHardwareAlerts.map((a) => a.atm))
  ).filter(Boolean);
  const hardwareAtmWarningData = atms.map(
    (atm) =>
      filteredHardwareAlerts.filter(
        (a) => a.atm === atm && a.status === "Warning"
      ).length
  );
  const hardwareAtmCriticalData = atms.map(
    (atm) =>
      filteredHardwareAlerts.filter(
        (a) => a.atm === atm && a.status === "Critical"
      ).length
  );
  const atmBreakdownData = {
    labels: atms,
    datasets: [
      {
        label: "Warning",
        data: hardwareAtmWarningData,
        backgroundColor: "#facc15",
      },
      {
        label: "Critical",
        data: hardwareAtmCriticalData,
        backgroundColor: "#ef4444",
      },
    ],
  };
  const atmBreakdownOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: {
        ticks: { color: "#fff", maxRotation: 60, minRotation: 30 },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
    },
  };

  // Data for Software-System breakdown Bar Chart
  const swKeys = Array.from(
    new Set(filteredSoftwareAlerts.map((a) => `${a.software}|||${a.system}`))
  ).filter((key) => key !== "undefined|||undefined");
  const softwareSystemWarningData = swKeys.map((key) => {
    const [software, system] = key.split("|||");
    return filteredSoftwareAlerts.filter(
      (a) =>
        a.software === software && a.system === system && a.status === "Warning"
    ).length;
  });
  const softwareSystemCriticalData = swKeys.map((key) => {
    const [software, system] = key.split("|||");
    return filteredSoftwareAlerts.filter(
      (a) =>
        a.software === software &&
        a.system === system &&
        a.status === "Critical"
    ).length;
  });
  const softwareSystemLabels = swKeys.map((key) => {
    const [software, system] = key.split("|||");
    return `${software} - ${system}`;
  });
  const softwareSystemBreakdownData = {
    labels: softwareSystemLabels,
    datasets: [
      {
        label: "Warning",
        data: softwareSystemWarningData,
        backgroundColor: "#f97316",
      },
      {
        label: "Critical",
        data: softwareSystemCriticalData,
        backgroundColor: "#dc2626",
      },
    ],
  };
  const softwareSystemBreakdownOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: {
        ticks: { color: "#fff", maxRotation: 60, minRotation: 30 },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
    },
  };

  // Function to handle PDF report download
  const downloadPdfReport = async () => {
    if (!matchedBankKey) {
      alert("Please select a bank to generate the PDF report.");
      return;
    }

    setIsDownloadingPdf(true); 

    // Prepare parameters to send to backend
    const reportParams = {
      bankName: matchedBankKey,
      fromDate: fromDate,
      toDate: toDate,
    };

    try {
      // Make POST request to Flask backend for PDF generation
      const response = await axios.post(
        "http://localhost:5000/api/generate-report-pdf",
        reportParams,
        {
          responseType: "blob", // Crucial for receiving binary data (PDF)
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${(matchedBankKey || selectedBank).replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}_performance_report.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Release the object URL
    } catch (error) {
      console.error("Error downloading PDF report:", error);
      // Use a custom message box or alert for user feedback
      alert(
        "Failed to generate PDF report. Please check the console for details."
      );
    } finally {
      setIsDownloadingPdf(false); // Deactivate loading indicator
    }
  };

  // Get all available bank keys for the dropdown, sorted alphabetically
  const allAvailableBanks = Array.from(
    new Set([...Object.keys(hardwareAlerts), ...Object.keys(softwareAlerts)])
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/026/827/665/non_2x/banking-and-finance-concept-illustration-vector.jpg')",
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
      <div className="bg-white bg-opacity-80 p-6 space-y-6 rounded-xl shadow-2xl max-w-8xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#232323]">
              Monthly Performance Report
            </h1>
            <p className="text-[#00188c] font-bold">March 2025</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <button
              onClick={downloadPdfReport}
              className="flex items-center px-4 py-2  text-white rounded hover:bg-[#00baec] transition"
              style={{
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.85)",
                borderRadius: "9999px",
                backgroundImage: "linear-gradient(to right, #00baec, #434343)",
              }}
              disabled={isDownloadingPdf}
            >
              {isDownloadingPdf ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF Report
                </>
              )}
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-lg font-medium text-[#232323]">Bank:</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-[#232323]"
            style={{
              borderRadius: "30px",
              padding: "8px 16px",
              width: "135px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.85)",
              outline: "none",
              fontSize: "16px",
              backgroundColor: "#fff",
              color: "#60636c",
            }}
            disabled={!!userBank}
          >
            <option value="">{userBank ? userBank : "Select Bank"}</option>
            {userBank &&
              (() => {
                const allBankKeys = Array.from(
                  new Set([
                    ...Object.keys(hardwareAlerts),
                    ...Object.keys(softwareAlerts),
                  ])
                );
                const match = allBankKeys.find(
                  (key) =>
                    key.toLowerCase().replace(/\s+/g, "") ===
                      userBank.toLowerCase().replace(/\s+/g, "") ||
                    key.toLowerCase().includes(userBank.toLowerCase()) ||
                    userBank.toLowerCase().includes(key.toLowerCase())
                );
                return match ? <option value={match}>{match}</option> : null;
              })()}
          </select>

          {/* Date range pickers */}
          <label className="text-lg font-medium text-[#232323] ml-4">
            From:
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-[#232323]"
            style={{
              borderRadius: "30px",
              backgroundColor: "#fff",
              color: "#60636c",
              boxShadow: "0 10px 10px rgba(0, 0, 0, 0.50)",
            }}
            max={toDate || undefined}
          />
          <label className="text-lg font-medium text-[#232323] ml-2">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-[#232323]"
            style={{
              borderRadius: "30px",
              backgroundColor: "#fff",
              color: "#60636c",
              boxShadow: "0 10px 10px rgba(0, 0, 0, 0.50)",
            }}
            min={fromDate || undefined}
          />
        </div>

        {/* Detailed Charts and Tables */}
        <div className="flex flex-col gap-10 mt-6">
          <div className="flex flex-col items-center gap-10">
            {/* Hardware Section */}
            <div
              className="bg-[#232323] bg-opacity-90 p-4 rounded-2xl shadow-xl w-full flex flex-col"
              style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.85)" }}
            >
              <h2 className="text-xl font-semibold mb-4 text-white text-center">
                Hardware Alerts
              </h2>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                {/* Left: Bar + Pie */}
                <div className="flex flex-row items-center gap-6">
                  {/* Bar chart + Total Alerts */}
                  <div className="flex flex-col items-center ">
                    <Bar data={hardwareChartData} options={options} />
                    <p className="mt-2 text-gray-300 text-center">
                      Total Alerts: {totalHardwareAlerts}
                    </p>
                  </div>

                  {/* Pie chart + Status Distribution label */}
                  <div className="flex flex-col items-center">
                    <div style={{ width: "230px", height: "230px" }}>
                      <Pie
                        data={hardwarePieData}
                        options={pieOptions}
                      />
                    </div>
                    <p className="mt-2 text-gray-300 text-center">
                      Status Distribution
                    </p>
                  </div>
                </div>

                {/* Right: ATM-wise Breakdown */}
                <div className="w-full md:w-[450px] mt-6 md:mt-0">
                  <h3 className="text-lg font-semibold text-white mb-2 text-center">
                    ATM-wise Alert Breakdown
                  </h3>
                  {(() => {
                    const atms = Array.from(
                      new Set(filteredHardwareAlerts.map((a) => a.atm))
                    ).filter(Boolean);
                    const warningData = atms.map(
                      (atm) =>
                        filteredHardwareAlerts.filter(
                          (a) => a.atm === atm && a.status === "Warning"
                        ).length
                    );
                    const criticalData = atms.map(
                      (atm) =>
                        filteredHardwareAlerts.filter(
                          (a) => a.atm === atm && a.status === "Critical"
                        ).length
                    );
                    const data = {
                      labels: atms,
                      datasets: [
                        {
                          label: "Warning",
                          data: warningData,
                          backgroundColor: "#facc15",
                        },
                        {
                          label: "Critical",
                          data: criticalData,
                          backgroundColor: "#ef4444",
                        },
                      ],
                    };
                    return atms.length > 0 ? (
                      <Bar
                        data={data}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { labels: { color: "#fff" } },
                          },
                          scales: {
                            x: {
                              ticks: { color: "#fff" },
                              grid: { color: "rgba(255,255,255,0.1)" },
                            },
                            y: {
                              ticks: { color: "#fff" },
                              grid: { color: "rgba(255,255,255,0.1)" },
                            },
                          },
                        }}
                        height={200}
                      />
                    ) : (
                      <p className="text-gray-300 text-center">
                        No ATM alerts in selected range.
                      </p>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Software Section */}
            <div
              className="bg-[#232323] bg-opacity-90 p-4 rounded-2xl shadow-xl w-full flex flex-col"
              style={{ boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.85)" }}
            >
              <h2 className="text-xl font-semibold mb-4 text-white text-center">
                Software Alerts
              </h2>

              {/* Container for Software Alerts and System Breakdown side by side */}
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                {/* Left: Software Alerts (Bar + Pie + Total) */}
                <div className="flex flex-col items-center w-full md:w-1/2">
                  <div className="flex flex-row gap-6 items-center justify-center w-full">
                    {/* Bar chart + Total Alerts */}
                    <div className="flex flex-col items-center">
                      <Bar data={softwareChartData} options={options} />
                      <p className="mt-2 text-gray-300 text-center">
                        Total Alerts: {totalSoftwareAlerts}
                      </p>
                    </div>

                    {/* Pie chart + Status Distribution */}
                    <div className="flex flex-col items-center">
                      <div style={{ width: "230px", height: "230px" }}>
                        <Pie
                          data={softwarePieData}
                          options={pieOptions}
                        />
                      </div>
                      <p className="mt-2 text-gray-300 text-center">
                        Status Distribution
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Software-System Alert Breakdown */}
                <div className="w-full md:w-[550px] mt-6 md:mt-0">
                  <h3 className="text-lg font-semibold text-white mb-2 text-center">
                    Software-System Alert Breakdown
                  </h3>
                  {(() => {
                    const swKeys = Array.from(
                      new Set(
                        filteredSoftwareAlerts.map(
                          (a) => `${a.software}|||${a.system}`
                        )
                      )
                    ).filter((key) => key !== "undefined|||undefined");

                    const warningData = swKeys.map((key) => {
                      const [software, system] = key.split("|||");
                      return filteredSoftwareAlerts.filter(
                        (a) =>
                          a.software === software &&
                          a.system === system &&
                          a.status === "Warning"
                      ).length;
                    });

                    const criticalData = swKeys.map((key) => {
                      const [software, system] = key.split("|||");
                      return filteredSoftwareAlerts.filter(
                        (a) =>
                          a.software === software &&
                          a.system === system &&
                          a.status === "Critical"
                      ).length;
                    });

                    const labels = swKeys.map((key) => {
                      const [software, system] = key.split("|||");
                      return `${software} - ${system}`;
                    });

                    const data = {
                      labels,
                      datasets: [
                        {
                          label: "Warning",
                          data: warningData,
                          backgroundColor: "#f97316",
                        },
                        {
                          label: "Critical",
                          data: criticalData,
                          backgroundColor: "#dc2626",
                        },
                      ],
                    };

                    return swKeys.length > 0 ? (
                      <Bar
                        data={data}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { labels: { color: "#fff" } },
                          },

                          scales: {
                            x: {
                              ticks: {
                                color: "#fff",
                                maxRotation: 60,
                                minRotation: 30,
                              },
                              grid: { color: "rgba(255,255,255,0.1)" },
                            },
                            y: {
                              ticks: { color: "#fff" },
                              grid: { color: "rgba(255,255,255,0.1)" },
                            },
                          },
                        }}
                        height={200}
                      />
                    ) : (
                      <p className="text-gray-300 text-center">
                        No software alerts in selected range.
                      </p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[#232323]">
          <h2 className="text-2xl font-semibold mb-5 mt-20">
            📈 Investment Impact & Benefits
          </h2>

          <p className="leading-relaxed mb-10">
            The implementation of this intelligent monitoring system has led to
            a significant{" "}
            <span className="font-medium text-green-600">
              reduction in unplanned downtimes
            </span>
            , enabling banks to respond faster to system anomalies in both
            software and ATM infrastructure. Through real-time alerting and
            predictive diagnostics, banks have experienced:
          </p>
        </div>

        <div className="relative overflow-hidden w-[1150px] mx-auto">
          <div
            className="flex gap-4 animate-slide-left w-max px-2"
            style={{ animationDuration: "40s" }}
          >
            {[...Array(2)].flatMap((_, outerIdx) =>
              [
                {
                  title: "🔔 Early Detection of Failures",
                  desc: "Identifies software and hardware risks before they escalate into major outages.",
                },
                {
                  title: "⏱️ Reduced Incident Response Time",
                  desc: "Automated alerts allow for immediate action, improving SLAs and customer satisfaction.",
                },
                {
                  title: "💰 Cost Optimization",
                  desc: "Minimizing system failures saves on emergency maintenance and customer loss.",
                },
                {
                  title: "📊 Data-Driven Decisions",
                  desc: "Visualized trends enable informed budgeting and strategic IT planning.",
                },
                {
                  title: "🛡️ Increased System Uptime",
                  desc: "Higher availability boosts trust and ensures continuous digital banking services.",
                },
                {
                  title: "🌍 Scalable Monitoring",
                  desc: "Easily adaptable for additional banks, branches, or systems with minimal setup effort.",
                },
              ].map((item, i) => (
                <div
                  key={`${item.title}-${outerIdx}-${i}`}
                  className="min-w-[300px] max-w-[300px] bg-[#ff6a00] bg-opacity-50 text-white p-4 rounded-3xl shadow-lg flex flex-col items-center text-center mr-4"
                  style={{
                    boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.75)",
                  }}
                >
                  <h3 className="font-bold mb-2 text-[#232323]  mb-15px">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#232323]/70">
                    {item.desc}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
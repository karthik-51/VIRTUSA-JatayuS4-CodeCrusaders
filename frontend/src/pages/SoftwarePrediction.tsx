import { useState, useEffect, useCallback } from "react";
import { Database, Server, Cpu, Zap, Landmark } from "lucide-react";

const bankSoftware: Record<string, string[]> = {
  "State Bank of India (SBI)": ["YONO SBI", "Online SBI"],
  "HDFC Bank": ["PayZapp", "HDFC Sky"],
  "ICICI Bank": ["iMobile", "Pockets"],
  "Axis Bank": ["Axis Mobile"],
  "Punjab National Bank (PNB)": ["PNB One"],
  "Kotak Mahindra Bank": ["Kotak 811"],
  "Bank of Baroda": ["Baroda Connect"],
  "Union Bank of India": ["Union Mobile"],
  "Canara Bank": ["Canara mBanking"],
  "IDBI Bank": ["IDBI Go"],
};

interface SoftwarePredictionProps {
  userBank: string;
}

interface Prediction {
  system: string;
  icon: JSX.Element;
  status: "Healthy" | "Warning" | "Critical";
  risk: "Low" | "Medium" | "High";
  errorRate: number;
  responseTime: number;
  crashFrequency: number;
  uptime: number;
}

const evaluateRiskAndStatus = (metric: {
  errorRate: number;
  responseTime: number;
  crashFrequency: number;
  uptime: number;
}) => {
  let risk: "Low" | "Medium" | "High" = "Low";
  let status: "Healthy" | "Warning" | "Critical" = "Healthy";

  if (
    metric.errorRate > 3.5 ||
    metric.responseTime > 1100 ||
    metric.crashFrequency > 2 ||
    metric.uptime < 96
  ) {
    risk = "High";
    status = "Critical";
  } else if (
    metric.errorRate > 2 ||
    metric.responseTime > 850 ||
    metric.crashFrequency > 1 ||
    metric.uptime < 98
  ) {
    risk = "Medium";
    status = "Warning";
  }

  return { risk, status };
};

function SoftwarePrediction({ userBank }: SoftwarePredictionProps) {
  const [selectedSoftware, setSelectedSoftware] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const matchedBank =
    Object.keys(bankSoftware).find((b) =>
      b.toLowerCase().includes(userBank?.toLowerCase())
    ) || "";

  const softwareList = matchedBank ? bankSoftware[matchedBank] : [];

  const fetchMetrics = useCallback(async () => {
    if (!matchedBank || !selectedSoftware) return;

    try {
      const res = await fetch("http://localhost:5000/api/software-metrics");
      const data = await res.json();

      const softwareData = data[matchedBank]?.[selectedSoftware];
      if (!softwareData) return;

      const icons: Record<string, JSX.Element> = {
        "Core Banking System": <Database className="h-6 w-6 text-indigo-500" />,
        "Payment Gateway": <Server className="h-6 w-6 text-orange-500" />,
        "Mobile App Services": <Cpu className="h-6 w-6 text-blue-600" />,
        "Notification Engine": <Zap className="h-6 w-6 text-purple-500" />,
        "Fraud Detection Engine": <Zap className="h-6 w-6 text-pink-500" />,
        "Loan Approval System": <Cpu className="h-6 w-6 text-green-600" />,
      };

      const enriched: Prediction[] = Object.entries(softwareData).map(
        ([systemName, metrics]) => {
          const m = metrics as {
            "Error Rate": number;
            "Response Time": number;
            "Crashes/Week": number;
            Uptime: number;
          };

          const { errorRate, responseTime, crashFrequency, uptime } = {
            errorRate: m["Error Rate"],
            responseTime: m["Response Time"],
            crashFrequency: m["Crashes/Week"],
            uptime: m["Uptime"],
          };

          const { risk, status } = evaluateRiskAndStatus({
            errorRate,
            responseTime,
            crashFrequency,
            uptime,
          });

          return {
            system: systemName,
            icon: icons[systemName] || (
              <Zap className="h-6 w-6 text-gray-400" />
            ),
            errorRate,
            responseTime,
            crashFrequency,
            uptime,
            risk,
            status,
          };
        }
      );

      const severityRank = { Critical: 0, Warning: 1, Healthy: 2 };
      enriched.sort((a, b) => severityRank[a.status] - severityRank[b.status]);

      setPredictions(enriched);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching software metrics:", err);
    }
  }, [matchedBank, selectedSoftware]);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 20000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundImage:
          "url('https://i.pinimg.com/originals/72/c0/55/72c05566763a3d799eae1928879e6f78.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        width: "100vw",
        padding: "20px",
        margin: 0,
        marginRight: "50px",
        marginLeft: "-30px",
        marginTop: "-24px",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl p-8 max-w-4xl w-full shadow-2xl">
        <img
          src="https://mycomputerworks.com/wp-content/uploads/2023/04/shutterstock_2058513980-scaled.jpg"
          alt="Rounded Image"
          className="w-40 h-40 rounded-full object-cover mx-auto"
          style={{
            boxShadow: "0 20px 35px rgba(0, 0, 0, 0.90)",
            marginBottom: "20px",
          }}
        />

        <header className="mb-10 space-y-2 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Software Prediction Dashboard
          </h1>

          <p className="text-base font-bold" style={{ color: "#00188c" }}>
            Real-time prediction and monitoring of banking software systems.
          </p>

          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Landmark className="w-4 h-4 text-[#00188c]" />
              Logged-in Bank:{" "}
              <strong className="text-gray-800">{matchedBank || "N/A"}</strong>
            </p>
          </div>

          {lastUpdated && (
            <div className="flex justify-center items-center">
              <p className="text-lg">⏱️</p>
              <p className="text-sm text-gray-500 italic flex items-center gap-1">
                Last Updated: {lastUpdated}
              </p>
            </div>
          )}
        </header>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <select
            value={selectedSoftware}
            onChange={(e) => setSelectedSoftware(e.target.value)}
            style={{
              borderRadius: "30px",
              padding: "10px 16px",
              width: "260px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
              outline: "none",
              fontSize: "16px",
              backgroundColor: "#60636c",
              color: "#fff",
            }}
            disabled={!matchedBank}
          >
            <option value="">Select Banking Software</option>
            {softwareList.map((software) => (
              <option key={software} value={software}>
                {software}
              </option>
            ))}
          </select>
        </div>

        {selectedSoftware && predictions.length > 0 && (
          <div
            className="overflow-x-auto rounded-lg shadow-lg"
            style={{
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.95)",
              borderRadius: "30px",
            }}
          >
            <table className="min-w-full bg-white text-sm text-gray-700 border">
              <thead className="bg-gradient-to-r from-indigo-100 to-indigo-200 text-xs font-semibold text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">System</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Risk</th>
                  <th className="px-6 py-3 text-left">Error Rate</th>
                  <th className="px-6 py-3 text-left">Response Time</th>
                  <th className="px-6 py-3 text-left">Crashes/Week</th>
                  <th className="px-6 py-3 text-left">Uptime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {predictions.map((item, index) => (
                  <tr key={index} className="hover:bg-indigo-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      {item.icon}
                      <span>{item.system}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge risk={item.risk} />
                    </td>
                    <td className="px-6 py-4">{item.errorRate.toFixed(2)} %</td>
                    <td className="px-6 py-4">{item.responseTime} ms</td>
                    <td className="px-6 py-4">{item.crashFrequency}</td>
                    <td className="px-6 py-4">{item.uptime.toFixed(2)} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "Healthy" | "Warning" | "Critical";
}) {
  const colors = {
    Healthy: "bg-green-100 text-green-800",
    Warning: "bg-yellow-100 text-yellow-800",
    Critical: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${colors[status]}`}
    >
      {status}
    </span>
  );
}

function RiskBadge({ risk }: { risk: "Low" | "Medium" | "High" }) {
  const colors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${colors[risk]}`}
    >
      {risk}
    </span>
  );
}

export default SoftwarePrediction;

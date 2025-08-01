import React, { useState, useEffect } from "react";
import {
  HardDrive,
  Cpu,
  MemoryStick as Memory,
  Thermometer,
  Activity,
  BatteryCharging,
} from "lucide-react";

const atms = ["ATM 1", "ATM 2"];

interface HardwareComponentMetrics {
  cpu: number;
  memory: number;
  storage: number;
  temperature: number;
}

interface HardwareComponent {
  component: string;
  metrics: HardwareComponentMetrics;
}

const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  unit?: string;
}> = ({ icon, title, value, unit = "" }) => (
  <div
    style={{
      padding: "16px",
      background: "#f7f7f7",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
    }}
  >
    <div className="flex items-center space-x-2">
      {icon}
      <h3 className="text-lg font-semibold text-[#232323]">{title}</h3>
    </div>
    <p className="mt-2 text-2xl font-bold text-[#232323]">
      {value} {unit}
    </p>
  </div>
);

const ProgressBar: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm font-semibold text-[#232323]">{label}</p>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full"
        style={{ width: `${value}%`, backgroundColor: "#60636c" }}
      ></div>
    </div>
  </div>
);

interface HardwarePredictionProps {
  userBank: string;
}

function HardwarePrediction({ userBank }: HardwarePredictionProps) {
  const [selectedATM, setSelectedATM] = useState("");
  const [hardwareMetrics, setHardwareMetrics] = useState<HardwareComponent[]>(
    []
  );
  const [vibration, setVibration] = useState(0);
  const [powerSupply, setPowerSupply] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchHardwareMetrics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hardware-metrics");
      const data = await res.json();

      const normalizedUserBank = userBank.trim().toLowerCase();
      const matchedBankKey = Object.keys(data).find(
        (key) =>
          key.trim().toLowerCase().includes(normalizedUserBank) ||
          normalizedUserBank.includes(key.trim().toLowerCase())
      );

      const bankData = matchedBankKey ? data[matchedBankKey] : undefined;
      if (bankData && bankData[selectedATM]) {
        const atmData = bankData[selectedATM];

        const components: HardwareComponent[] = Object.entries(
          atmData.components
        ).map(([name, metrics]) => ({
          component: name,
          metrics: metrics as HardwareComponentMetrics,
        }));

        setHardwareMetrics(components);
        setVibration(atmData.vibration);
        setPowerSupply(atmData.power);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setHardwareMetrics([]);
        setVibration(0);
        setPowerSupply(0);
      }
    } catch (err) {
      console.error("Error fetching hardware metrics:", err);
    }
  };

  useEffect(() => {
    fetchHardwareMetrics();
    const interval = setInterval(fetchHardwareMetrics, 20000);
    return () => clearInterval(interval);
  }, [userBank, selectedATM]);

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
        minHeight: "100vh",
        width: "100vw",
        padding: "20px",
        margin: 0,
        marginRight: "50px",
        marginLeft: "-30px",
        marginTop: "-24px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "30px",
          borderRadius: "20px",
          maxWidth: "800px",
          width: "100%",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
        }}
      >
        <img
          src="https://tse2.mm.bing.net/th/id/OIP.y65LN__fxKS4a1_UK7TBoAHaE7?pid=Api&P=0&h=180"
          alt="Rounded Image"
          className="w-40 h-40 rounded-full object-cover mx-auto"
          style={{
            boxShadow: "0 20px 35px rgba(0, 0, 0, 0.90)",
            marginBottom: "20px",
          }}
        />
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Hardware System Analysis
          </h1>
          <p
            className="text-base font-bold"
            style={{ color: "#00188c", marginBottom: "5px", marginTop: "5px" }}
          >
            Real-time monitoring and prediction of hardware components
          </p>
          <div className="flex justify-center items-center">
            <p className="text-lg">⏱️</p>
            <p className="text-sm text-gray-500 italic flex items-center gap-1">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div
            className="p-2 bg-gray-200 rounded text-[#232323] shadow text-center"
            style={{
              borderRadius: "30px",
              padding: "8px 16px",
              width: "220px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.85)",
              outline: "none",
              fontSize: "16px",
              backgroundColor: "#60636c",
              color: "#fff",
            }}
          >
            <strong>Bank:</strong> {userBank || "Not Logged In"}
          </div>

          <select
            className="p-2 border rounded text-[#232323] shadow"
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
            value={selectedATM}
            onChange={(e) => setSelectedATM(e.target.value)}
          >
            <option value="">Select ATM</option>
            {atms.map((atm, index) => (
              <option key={index} value={atm}>
                {atm}
              </option>
            ))}
          </select>
        </div>

        {userBank && selectedATM && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard
                icon={<Activity className="h-6 w-6 text-purple-500" />}
                title="ATM Vibration"
                value={vibration}
                unit="%"
              />
              <MetricCard
                icon={<BatteryCharging className="h-6 w-6 text-green-500" />}
                title="Power Supply"
                value={powerSupply}
                unit="%"
              />
            </div>

            {hardwareMetrics.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 mt-6">
                {hardwareMetrics.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
                    <h2 className="text-xl font-semibold text-[#232323]">
                      {item.component}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <MetricCard
                        icon={<Cpu className="h-6 w-6 text-blue-600" />}
                        title="CPU Usage"
                        value={item.metrics.cpu}
                      />
                      <MetricCard
                        icon={<Memory className="h-6 w-6 text-yellow-600" />}
                        title="Memory"
                        value={item.metrics.memory}
                      />
                      <MetricCard
                        icon={<HardDrive className="h-6 w-6 text-indigo-500" />}
                        title="Storage"
                        value={item.metrics.storage}
                      />
                      <MetricCard
                        icon={<Thermometer className="h-6 w-6 text-red-500" />}
                        title="Temperature"
                        value={item.metrics.temperature}
                        unit="°C"
                      />
                    </div>
                    <div className="mt-6 space-y-4">
                      <ProgressBar label="CPU Load" value={item.metrics.cpu} />
                      <ProgressBar
                        label="Memory Usage"
                        value={item.metrics.memory}
                      />
                      <ProgressBar
                        label="Storage Usage"
                        value={item.metrics.storage}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-500 text-center font-medium mt-4">
                ⚠️ No hardware metrics available for this ATM.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HardwarePrediction;

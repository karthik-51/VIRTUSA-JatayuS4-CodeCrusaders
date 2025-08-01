 
import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  Send,
  BellRing,
  ServerCrash,
  Bug,
  Building2,
  XCircle,
} from "lucide-react";
import { Snackbar, Alert } from "@mui/material";

const banks = [
  "State Bank of India (SBI)",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank (PNB)",
  "Kotak Mahindra Bank",
  "Bank of Baroda",
  "Union Bank of India",
  "Canara Bank",
  "IDBI Bank",
];

type HardwareAlert = {
  atm: string;
  status: string;
  timestamp: string;
};

type SoftwareAlert = {
  software: string;
  system: string;
  status: string;
  timestamp: string;
};

const Notifications: React.FC = () => {
  
  const [bank, setBank] = useState("");
  const [userBank, setUserBank] = useState<string | null>(null);
  const [matchedBankKey, setMatchedBankKey] = useState("");
  const [alertType, setAlertType] = useState("");
  const [hardwareAlerts, setHardwareAlerts] = useState<HardwareAlert[]>([]);
  const [softwareAlerts, setSoftwareAlerts] = useState<SoftwareAlert[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [timer, setTimer] = useState("");

  // state for showing info message after clicking the link
  const [showInfo, setShowInfo] = useState(false);

  // filter recent alerts (last 30 seconds)
  const filterRecentAlerts = <T extends { timestamp: string }>(
    alerts: T[]
  ): T[] => {
    const now = new Date().getTime();
    return alerts.filter((alert) => {
      const timeDiff = now - new Date(alert.timestamp).getTime();
      return timeDiff <= 30 * 1000; // Only last 30 seconds
    });
  };

  useEffect(() => {
    if (userBank) {
      const fetchAndSet = async () => {
        const [hwRes, swRes] = await Promise.all([
          fetch("http://localhost:5000/api/software-alerts"),
          fetch("http://localhost:5000/api/hardware-alerts"),
        ]);
        const hwData = await hwRes.json();
        const swData = await swRes.json();
        const allBankKeys = Array.from(
          new Set([...Object.keys(hwData), ...Object.keys(swData)])
        );
        const match =
          allBankKeys.find(
            (key) =>
              key.toLowerCase().replace(/\s+/g, "") ===
                userBank.toLowerCase().replace(/\s+/g, "") ||
              key.toLowerCase().includes(userBank.toLowerCase()) ||
              userBank.toLowerCase().includes(key.toLowerCase())
          ) || userBank;
        setMatchedBankKey(match);
        setBank(match);
      };
      fetchAndSet();
    }
  }, [userBank]);

  const fetchAlerts = useCallback(
    async (typeOverride?: string) => {
      try {
        const [hwRes, swRes] = await Promise.all([
          fetch("http://localhost:5000/api/hardware-alerts"),
          fetch("http://localhost:5000/api/software-alerts"),
        ]);
        const hwData = await hwRes.json();
        const swData = await swRes.json();
        let key = bank;
        const allBankKeys = Array.from(
          new Set([...Object.keys(hwData), ...Object.keys(swData)])
        );
        const match =
          allBankKeys.find(
            (k) =>
              k.toLowerCase().replace(/\s+/g, "") ===
                bank.toLowerCase().replace(/\s+/g, "") ||
              k.toLowerCase().includes(bank.toLowerCase()) ||
              bank.toLowerCase().includes(k.toLowerCase())
          ) || bank;
        key = match;
        const type = typeOverride || alertType;
        if (type === "Hardware") {
          setHardwareAlerts(filterRecentAlerts(hwData[key] || []));
          setSoftwareAlerts([]);
        } else if (type === "Software") {
          setHardwareAlerts([]);
          setSoftwareAlerts(filterRecentAlerts(swData[key] || []));
        } else if (type === "Both") {
          setHardwareAlerts(filterRecentAlerts(hwData[key] || []));
          setSoftwareAlerts(filterRecentAlerts(swData[key] || []));
        } else {
          setHardwareAlerts(filterRecentAlerts(hwData[key] || []));
          setSoftwareAlerts(filterRecentAlerts(swData[key] || []));
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    },
    [bank, alertType]
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/get-bank", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        setUserBank(res.data.bank);
      })
      .catch(() => setUserBank(null));
  }, []);

  useEffect(() => {
    if (bank) {
      fetchAlerts();
      const interval = setInterval(() => fetchAlerts(), 20000);
      return () => clearInterval(interval);
    }
  }, [bank, fetchAlerts]);

  useEffect(() => {
    if (bank && alertType) {
      fetchAlerts(alertType);
    }
  }, [alertType, bank, fetchAlerts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bank || !alertType || !timer) {
      setSnackbarSeverity("warning");
      setStatusMessage("⚠ Please fill all fields, including timer.");
      setOpenSnackbar(true);
      return;
    }

    // Store timer in backend
    try {
      const token = localStorage.getItem("token");
      const timerRes = await axios.put(
        "http://localhost:5000/api/timer",
        { timer },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (timerRes.data?.message) {
        setSnackbarSeverity("success");
        setStatusMessage("Timer set successfully!");
        setOpenSnackbar(true);
      }
    } catch (err: any) {
      setSnackbarSeverity("error");
      setStatusMessage(err?.response?.data?.error || "Failed to set timer");
      setOpenSnackbar(true);
      return;
    }

    let payload;

    if (alertType === "Both") {
      if (!hardwareAlerts.length && !softwareAlerts.length) {
        setSnackbarSeverity("info");
        setStatusMessage(
          `ℹ️ No recent hardware or software alerts for ${bank}`
        );
        setOpenSnackbar(true);
        return;
      }

      payload = {
        bank_name: bank,
        alert_type: "both",
        alerts: {
          hardware: hardwareAlerts,
          software: softwareAlerts,
        },
      };
    } else if (alertType === "Hardware") {
      if (!hardwareAlerts.length) {
        setSnackbarSeverity("info");
        setStatusMessage(`ℹ️ No recent hardware alerts for ${bank}`);
        setOpenSnackbar(true);
        return;
      }

      payload = {
        bank_name: bank,
        alert_type: "hardware",
        alerts: hardwareAlerts,
      };
    } else if (alertType === "Software") {
      if (!softwareAlerts.length) {
        setSnackbarSeverity("info");
        setStatusMessage(`ℹ️ No recent software alerts for ${bank}`);
        setOpenSnackbar(true);
        return;
      }

      payload = {
        bank_name: bank,
        alert_type: "software",
        alerts: softwareAlerts,
      };
    }

    try {
      const response = await axios.post(
        "http://192.168.0.104:5000/api/send-alert",
        payload
      );
      setSnackbarSeverity("success");
      setStatusMessage(response.data.message || "✅ Alert sent successfully!");
      setOpenSnackbar(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setSnackbarSeverity("error");
        setStatusMessage(
          error.response?.data?.error || "❌ Failed to send alert."
        );
        setOpenSnackbar(true);
      } else {
        setSnackbarSeverity("error");
        setStatusMessage("❌ Failed to send alert.");
        setOpenSnackbar(true);
      }
    }
  };

  const handleStopAlerts = async () => {
    if (!bank) {
      setSnackbarSeverity("warning");
      setStatusMessage("⚠ Please select a bank to stop alerts.");
      setOpenSnackbar(true);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/timer",
        { timer: "none" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setSnackbarSeverity("success");
      setStatusMessage("Alerts stopped successfully");
      setOpenSnackbar(false);
      setTimeout(() => setOpenSnackbar(true), 100); 
      setTimer("");
      setAlertType("");
    } catch (error: any) {
      setSnackbarSeverity("error");
      if (axios.isAxiosError(error)) {
        setStatusMessage(
          error.response?.data?.error || "Failed to stop alerts."
        );
      } else {
        setStatusMessage("Failed to stop alerts.");
      }
      setOpenSnackbar(false);
      setTimeout(() => setOpenSnackbar(true), 100); 
    }
  };

  // Handlers for inline info prompt
  const handleShowInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowInfo(true);
  };
  const handleDismissInfo = () => {
    setShowInfo(false);
  };

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
        className="mx-auto p-10 rounded-3xl bg-white bg-opacity-[0.96] shadow-[0_6px_32px_rgba(31,41,55,0.2)] text-[#232323]"
        style={{ maxWidth: "1200px", width: "900px" }}
      >
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
          <BellRing className="text-[#00188c]" /> Send Notifications
        </h1>

        {/* Inline info prompt with clickable link */}
        <p className="mb-6 text-sm text-blue-700">
          If you're new here, please{" "}
          <a
            href="#"
            onClick={handleShowInfo}
            className="underline cursor-pointer font-semibold hover:text-blue-900"
          >
            click here
          </a>{" "}
          to learn more about notifications.
        </p>

        {/* Conditionally shown info banner after clicking link */}
        {showInfo && (
          <div
            className="relative p-5 mb-6 border-l-4 border-blue-500 rounded-md bg-blue-50 text-blue-900 shadow-lg animate-slide-in"
            role="alert"
          >
            <div className="flex items-start">
              <div className="text-2xl mr-3">ℹ️</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  Welcome to the Alert Center 👋
                </h3>
                <p className="text-sm">
                  You can customize alert notifications by setting your
                  preferred timer and also stop alerts anytime.
                </p>
              </div>
              <button
                onClick={handleDismissInfo}
                aria-label="Dismiss notification info"
                className="text-blue-600 hover:text-blue-800 text-xl font-bold ml-4"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div
            className="flex items-center gap-3 bg-white p-3 rounded-lg"
            style={{ border: "1px solid #00baec" }}
          >
            <Building2 className="text-blue-600" />
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="bg-transparent w-full outline-none"
              disabled={!!userBank}
            >
              <option value="">{userBank || "Select Bank"}</option>
              {userBank && matchedBankKey ? (
                <option value={matchedBankKey}>{matchedBankKey}</option>
              ) : (
                banks.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))
              )}
            </select>
          </div>

          <div
            className="flex items-center gap-3 bg-white p-3 rounded-lg"
            style={{ border: "1px solid #00baec" }}
          >
            <AlertCircle className="text-purple-600" />
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="bg-transparent w-full outline-none"
            >
              <option value="">Select Alert Type</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div
            className="flex items-center gap-3 bg-white p-3 rounded-lg md:col-span-2"
            style={{ border: "1px solid #00baec" }}
          >
            <label htmlFor="timer" className="text-gray-700 font-semibold mr-2">
              Timer (minutes):
            </label>
            <input
              id="timer"
              type="number"
              min="1"
              placeholder="Enter timer in minutes"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              className="bg-transparent w-full outline-none"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-center gap-6">
            <button
              type="submit"
              className="text-white font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2 hover:opacity-90"
              style={{
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.55)",
                backgroundImage: "linear-gradient(to right, #ff2200, #434343)",
                width: "220px",
              }}
            >
              <Send className="w-4 h-4 text-white" /> Send Alert
            </button>
            <button
              type="button"
              onClick={handleStopAlerts}
              className="text-white font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2 hover:opacity-90"
              style={{
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.55)",
                backgroundImage: "linear-gradient(to right, #434343, #ff2200)",
                width: "220px",
              }}
            >
              <XCircle className="w-4 h-4 text-white" /> Stop Alerts
            </button>
          </div>
        </form>

        {(hardwareAlerts.length > 0 || softwareAlerts.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {(alertType === "Hardware" || alertType === "Both") && (
              <div>
                <h2 className="text-lg font-semibold text-[#00188c] mb-2 flex items-center gap-2">
                  <ServerCrash className="text-red-600 w-5 h-5" />
                  Recent Hardware Alerts
                </h2>
                {hardwareAlerts.length ? (
                  <table className="w-full bg-white shadow-md rounded-xl overflow-hidden border border-gray-300">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                      <tr>
                        <th className="p-3 text-left">ATM</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hardwareAlerts.map((a, i) => (
                        <tr key={i} className="hover:bg-orange-100">
                          <td className="p-3 border-b">{a.atm}</td>
                          <td className="p-3 border-b text-red-600 font-semibold">
                            {a.status}
                          </td>
                          <td className="p-3 border-b text-sm text-gray-600">
                            {a.timestamp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600">
                    No recent hardware alerts found.
                  </p>
                )}
              </div>
            )}

            {(alertType === "Software" || alertType === "Both") && (
              <div>
                <h2 className="text-lg font-semibold text-[#00188c] mb-2 flex items-center gap-2">
                  <Bug className="text-yellow-600 w-5 h-5" />
                  Recent Software Alerts
                </h2>
                {softwareAlerts.length ? (
                  <table className="w-full bg-white border border-orange-300 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-2 text-left">Software</th>
                        <th className="p-2 text-left">System</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {softwareAlerts.map((a, i) => (
                        <tr key={i} className="hover:bg-gray-100">
                          <td className="p-2">{a.software}</td>
                          <td className="p-2">{a.system}</td>
                          <td className="p-2 text-yellow-500 font-semibold">
                            {a.status}
                          </td>
                          <td className="p-2 text-sm text-gray-600">
                            {a.timestamp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600">
                    No recent software alerts found.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <Snackbar
          key={statusMessage} // force remount on message change
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ mt: 2 }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              backgroundColor:
                snackbarSeverity === "success"
                  ? "#4caf50"
                  : snackbarSeverity === "error"
                  ? "#f44336"
                  : snackbarSeverity === "warning"
                  ? "#ff9800"
                  : "#2196f3",
              color: "white",
              fontWeight: 600,
            }}
            variant="filled"
          >
            {statusMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Notifications;

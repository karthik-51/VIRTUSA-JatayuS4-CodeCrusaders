
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SoftwarePrediction from "./pages/SoftwarePrediction";
import HardwarePrediction from "./pages/HardwarePrediction";
import Maintenance from "./pages/Maintenance";
import Report from "./pages/Report";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Notifications from "./pages/Notification";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import AboutPage from "./pages/AboutPage";

function App() {
  const [user, setUser] = useState<{ email: string; bank: string } | null>(
    null
  );

  const isAuthenticated = () => Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/get-bank", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          let email = "";
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            email = payload.sub || payload.identity || "";
          } catch {}
          setUser({ email, bank: data.bank });
        })
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    if (!isAuthenticated()) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/software"
              element={
                <ProtectedRoute>
                  <SoftwarePrediction userBank={user?.bank || ""} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hardware"
              element={
                <ProtectedRoute>
                  <HardwarePrediction userBank={user?.bank || ""} />
                </ProtectedRoute>
              }
            />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

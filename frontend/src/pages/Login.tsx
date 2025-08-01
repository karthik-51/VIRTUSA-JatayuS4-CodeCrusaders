import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";

interface LoginProps {
  setUser: (user: { email: string; bank: string } | null) => void;
}

function Login({ setUser }: LoginProps) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", 
  });


  // login check 
      useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
         
          navigate("/home", { replace: true });
        }
      }, [navigate]); 
  

  // Forgot Password dialog state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotShowPassword, setForgotShowPassword] = useState(false);
  const [forgotShowConfirm, setForgotShowConfirm] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      newErrors.identifier = "Enter a valid email or 10-digit mobile number.";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email: identifier,
        password: password,
      });

      localStorage.setItem("token", res.data.access_token);
      // Fetch user info and set user state in App
      try {
        const token = res.data.access_token;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.sub || payload.identity || "";
        // Fetch bank info
        const bankRes = await axios.get("http://localhost:5000/api/get-bank", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser({ email, bank: bankRes.data.bank });
      } catch {
        setUser(null);
      }
      showSnackbar("✅ Login successful!", "success");
      setTimeout(() => navigate("/home"), 2000);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || "❌ Login failed", "error");
    }
  };

  // Forgot Password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/change_password", {
        emai: forgotEmail, 
        new_password: forgotNewPassword,
      });
      showSnackbar(res.data.message || "Password changed successfully", "success");
      setForgotOpen(false);
      setForgotEmail("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || "❌ Failed to change password", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={loginStyles.page}>
      <form style={loginStyles.form} onSubmit={handleLogin}>
        <h2 style={loginStyles.title}>🔐 User Login</h2>

        <div style={loginStyles.group}>
          <label htmlFor="identifier" style={loginStyles.label}>
            Email
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={loginStyles.input}
            required
          />
          {errors.identifier && (
            <div style={loginStyles.error}>{errors.identifier}</div>
          )}
        </div>

        <div style={loginStyles.group}>
          <label htmlFor="loginPassword" style={loginStyles.label}>
            Password
          </label>
          <div style={loginStyles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="loginPassword"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={loginStyles.input}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={loginStyles.eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && (
            <div style={loginStyles.error}>{errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          style={{
            ...loginStyles.button,
            transform: isClicked ? "scale(1.05)" : "scale(1)",
          }}
          onClick={() => {
            setIsClicked(true);
            setTimeout(() => setIsClicked(false), 300);
          }}
        >
          Login
        </button>

        <div style={loginStyles.linkRow}>
          <span
            style={loginStyles.link}
            onClick={() => setForgotOpen(true)}
          >
            Forgot Password?
          </span>
          <span
            style={{ ...loginStyles.link, float: "right" }}
            onClick={() => navigate("/signup")}
          >
            Register
          </span>
        </div>
      </form>

      {/* Forgot Password Dialog */}
      {forgotOpen && (
        <div style={forgotDialogStyles.overlay}>
          <div style={forgotDialogStyles.dialog}>
            <h3 style={{ marginBottom: 12 }}>🔑 Reset Password</h3>
            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontWeight: 600 }}>Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  style={forgotDialogStyles.input}
                  required
                />
              </div>
              <div style={{ marginBottom: 10, position: "relative" }}>
                <label style={{ fontWeight: 600 }}>New Password</label>
                <input
                  type={forgotShowPassword ? "text" : "password"}
                  value={forgotNewPassword}
                  onChange={e => setForgotNewPassword(e.target.value)}
                  style={forgotDialogStyles.input}
                  required
                />
                <span
                  onClick={() => setForgotShowPassword(v => !v)}
                  style={forgotDialogStyles.eyeIcon}
                >
                  {forgotShowPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div style={{ marginBottom: 16, position: "relative" }}>
                <label style={{ fontWeight: 600 }}>Confirm Password</label>
                <input
                  type={forgotShowConfirm ? "text" : "password"}
                  value={forgotConfirmPassword}
                  onChange={e => setForgotConfirmPassword(e.target.value)}
                  style={forgotDialogStyles.input}
                  required
                />
                <span
                  onClick={() => setForgotShowConfirm(v => !v)}
                  style={forgotDialogStyles.eyeIcon}
                >
                  {forgotShowConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  style={forgotDialogStyles.cancelBtn}
                  onClick={() => setForgotOpen(false)}
                  disabled={forgotLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={forgotDialogStyles.submitBtn}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

const loginStyles: any = {
  page: {
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
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    width: "350px",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#222",
  },
  group: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#222",
    fontSize: "15px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "5px",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#666",
  },
  linkRow: {
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#007bff",
  },
  link: {
    cursor: "pointer",
    color: "#007bff",
    textDecoration: "underline",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundImage: "linear-gradient(to right, #00baec, #434343)", // gradient
    color: "white",
    border: "none",
    borderRadius: "9999px", // full circle border
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 16px 0 rgba(35,35,35,0.68)",
    transition: "all 0.1s ease-in-out", 
    transform: "scale(1)", 
    height: "40px",
    marginBottom: "15px",
  },
};


// Simple styles for the forgot password dialog
const forgotDialogStyles: any = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.3)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialog: {
    background: "#fff",
    borderRadius: 10,
    padding: 24,
    minWidth: 320,
    boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
    zIndex: 1001,
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    border: "1px solid #ccc",
    marginTop: 4,
    paddingRight: 32, 
  },
  eyeIcon: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#666",
    fontSize: 18,
  },
  cancelBtn: {
    background: "#eee",
    color: "#333",
    border: "none",
    borderRadius: 5,
    padding: "7px 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
  submitBtn: {
    background: "#00baec",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    padding: "7px 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Login;

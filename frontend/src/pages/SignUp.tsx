import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone_no: "",
    email: "",
    bank: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  // login check ---
  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^[6-9]\d{9}$/;

    if (formData.name.trim().length < 2)
      newErrors.name = "Please enter a valid name.";
    if (!phoneRegex.test(formData.phone_no))
      newErrors.phone_no = "Enter a valid 10-digit mobile number.";
    if (!formData.email.includes("@"))
      newErrors.email = "Enter a valid email address.";
    if (!formData.bank) newErrors.bank = "Please select a bank.";
    if (formData.designation.trim().length < 2)
      newErrors.designation = "Enter a valid designation.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        {
          name: formData.name,
          phone_no: formData.phone_no,
          email: formData.email,
          bank: formData.bank,
          designation: formData.designation,
          password: formData.password,
        },
        { withCredentials: true }
      );

      showSnackbar("✅ Registration successful!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.error || "❌ Registration failed!";
      showSnackbar(message, "error");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.title}>🏦 Bank Registration</h2>

          {[
            { label: "🧑 Full Name", name: "name", type: "text" },
            { label: "📱 Mobile Number", name: "phone_no", type: "tel" },
            { label: "📧 Email Address", name: "email", type: "email" },
          ].map(({ label, name, type }) => (
            <div key={name} style={styles.group}>
              <label htmlFor={name} style={styles.label}>
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                required
                style={styles.input}
              />
              {errors[name] && <div style={styles.error}>{errors[name]}</div>}
            </div>
          ))}

          <div style={styles.group}>
            <label htmlFor="bank" style={styles.label}>
              🏦 Select Bank
            </label>
            <select
              name="bank"
              id="bank"
              value={formData.bank}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">-- Choose Bank --</option>
              {[
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
              ].map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {errors.bank && <div style={styles.error}>{errors.bank}</div>}
          </div>

          <div style={styles.group}>
            <label htmlFor="designation" style={styles.label}>
              💼 Designation
            </label>
            <input
              type="text"
              name="designation"
              id="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {errors.designation && (
              <div style={styles.error}>{errors.designation}</div>
            )}
          </div>

          <div style={styles.group}>
            <label htmlFor="password" style={styles.label}>
              🔒 Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <div style={styles.error}>{errors.password}</div>
            )}
          </div>

          <div style={styles.group}>
            <label htmlFor="confirmPassword" style={styles.label}>
              🔒✅ Confirm Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && (
              <div style={styles.error}>{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              transform: isClicked ? "scale(1.05)" : "scale(1)",
            }}
            onClick={() => {
              setIsClicked(true);
              setTimeout(() => setIsClicked(false), 200);
            }}
          >
            Register
          </button>
        </form>
      </div>

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

const styles: any = {
  page: {
    backgroundImage: "url('https://wallpaperaccess.com/full/2312019.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100vw",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "50px",
    marginLeft: "-30px",
    marginTop: "-24px",
  },
  overlay: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.8)",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#222",
    fontSize: "24px",
    fontWeight: "700",
  },
  group: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
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
    color: "#555",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "5px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundImage: "linear-gradient(to right,#00baec, #434343)",
    color: "white",
    border: "none",
    borderRadius: "9999px",
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

export default SignUp;
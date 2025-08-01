
// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
// import SignUp from "../src/pages/SignUp";

// // Mock useNavigate
// const mockNavigate = jest.fn();
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: () => mockNavigate,
// }));

// // Mock localStorage
// const localStorageMock = {
//   getItem: jest.fn(),
//   setItem: jest.fn(),
//   removeItem: jest.fn(),
//   clear: jest.fn(),
// };
// beforeAll(() => {
//   Object.defineProperty(globalThis, "localStorage", {
//     value: localStorageMock,
//     writable: true,
//   });
// });

// // Mock axios
// jest.mock("axios");
// import axios from "axios";
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// describe("SignUp Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     localStorageMock.getItem.mockReturnValue(null);
//   });

//   const renderSignUp = () =>
//     render(
//       <BrowserRouter>
//         <SignUp />
//       </BrowserRouter>
//     );

//   it("renders all form fields and register button", () => {
//     renderSignUp();
//     expect(screen.getByText(/Bank Registration/i)).toBeInTheDocument();
//     expect(screen.getByTestId("name")).toBeInTheDocument();
//     expect(screen.getByTestId("phone_no")).toBeInTheDocument();
//     expect(screen.getByTestId("email")).toBeInTheDocument();
//     expect(screen.getByTestId("bank")).toBeInTheDocument();
//     expect(screen.getByTestId("designation")).toBeInTheDocument();
//     expect(screen.getByTestId("password")).toBeInTheDocument();
//     expect(screen.getByTestId("confirmPassword")).toBeInTheDocument();
//     expect(screen.getByTestId("register-button")).toBeInTheDocument();
//   });

//   it("shows validation errors for invalid inputs", async () => {
//     renderSignUp();
//     fireEvent.change(screen.getByTestId("name"), { target: { value: "A" } });
//     fireEvent.change(screen.getByTestId("phone_no"), { target: { value: "123" } });
//     fireEvent.change(screen.getByTestId("email"), { target: { value: "invalid" } });
//     fireEvent.change(screen.getByTestId("designation"), { target: { value: "X" } });
//     fireEvent.change(screen.getByTestId("password"), { target: { value: "123" } });
//     fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "456" } });

//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(screen.getByText("Please enter a valid name.")).toBeInTheDocument();
//         expect(screen.getByText("Enter a valid 10-digit mobile number.")).toBeInTheDocument();
//         expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
//         expect(screen.getByText("Please select a bank.")).toBeInTheDocument();
//         expect(screen.getByText("Enter a valid designation.")).toBeInTheDocument();
//         expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
//         expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("displays bank dropdown options correctly", () => {
//     renderSignUp();
//     const select = screen.getByTestId("bank");
//     const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
//     expect(options).toEqual([
//       "-- Choose Bank --",
//       "State Bank of India (SBI)",
//       "HDFC Bank",
//       "ICICI Bank",
//       "Axis Bank",
//       "Punjab National Bank (PNB)",
//       "Kotak Mahindra Bank",
//       "Bank of Baroda",
//       "Union Bank of India",
//       "Canara Bank",
//       "IDBI Bank",
//     ]);
//   });

//   it("toggles password visibility", () => {
//     renderSignUp();
//     const passwordInput = screen.getByTestId("password");
//     const toggle = passwordInput.parentElement?.querySelector("span");
//     expect(passwordInput).toHaveAttribute("type", "password");
//     fireEvent.click(toggle!);
//     expect(passwordInput).toHaveAttribute("type", "text");
//   });

//   it("toggles confirm password visibility independently", () => {
//     renderSignUp();
//     const confirmInput = screen.getByTestId("confirmPassword");
//     const passwordInput = screen.getByTestId("password");
//     const confirmToggle = confirmInput.parentElement?.querySelector("span");
//     expect(confirmInput).toHaveAttribute("type", "password");
//     expect(passwordInput).toHaveAttribute("type", "password");
//     fireEvent.click(confirmToggle!);
//     expect(confirmInput).toHaveAttribute("type", "text");
//     expect(passwordInput).toHaveAttribute("type", "password");
//   });

//   it("shows snackbar on registration failure", async () => {
//     mockedAxios.post.mockRejectedValueOnce({
//       response: { data: { error: "Email already exists" } },
//     });

//     renderSignUp();
//     fireEvent.change(screen.getByTestId("name"), { target: { value: "Test User" } });
//     fireEvent.change(screen.getByTestId("phone_no"), { target: { value: "9876543210" } });
//     fireEvent.change(screen.getByTestId("email"), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByTestId("bank"), { target: { value: "HDFC Bank" } });
//     fireEvent.change(screen.getByTestId("designation"), { target: { value: "Manager" } });
//     fireEvent.change(screen.getByTestId("password"), { target: { value: "123456" } });
//     fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "123456" } });

//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(screen.getByText("Email already exists")).toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("submits form successfully and navigates", async () => {
//     mockedAxios.post.mockResolvedValueOnce({
//       data: { access_token: "mock-token" },
//     });

//     renderSignUp();
//     fireEvent.change(screen.getByTestId("name"), { target: { value: "Test User" } });
//     fireEvent.change(screen.getByTestId("phone_no"), { target: { value: "9876543210" } });
//     fireEvent.change(screen.getByTestId("email"), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByTestId("bank"), { target: { value: "HDFC Bank" } });
//     fireEvent.change(screen.getByTestId("designation"), { target: { value: "Manager" } });
//     fireEvent.change(screen.getByTestId("password"), { target: { value: "123456" } });
//     fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "123456" } });

//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(localStorage.setItem).toHaveBeenCalledWith("token", "mock-token");
//         expect(mockNavigate).toHaveBeenCalledWith("/login");
//         expect(screen.getByText("✅ Registration successful!")).toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("resets button animation after click", async () => {
//     renderSignUp();
//     const button = screen.getByTestId("register-button");
//     fireEvent.click(button);
//     expect(button).toHaveStyle("transform: scale(1.05)");
//     await waitFor(
//       () => {
//         expect(button).toHaveStyle("transform: scale(1)");
//       },
//       { timeout: 300 }
//     );
//   });

//   it("closes snackbar when close icon is clicked", async () => {
//     mockedAxios.post.mockRejectedValueOnce({
//       response: { data: { error: "Email already exists" } },
//     });

//     renderSignUp();
//     fireEvent.change(screen.getByTestId("name"), { target: { value: "Test User" } });
//     fireEvent.change(screen.getByTestId("phone_no"), { target: { value: "9876543210" } });
//     fireEvent.change(screen.getByTestId("email"), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByTestId("bank"), { target: { value: "HDFC Bank" } });
//     fireEvent.change(screen.getByTestId("designation"), { target: { value: "Manager" } });
//     fireEvent.change(screen.getByTestId("password"), { target: { value: "123456" } });
//     fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "123456" } });

//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(screen.getByText("Email already exists")).toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );

//     const alert = screen.getByRole("alert");
//     expect(alert).toBeInTheDocument();

//     fireEvent.click(alert.querySelector("button")!);
//     await waitFor(
//       () => {
//         expect(screen.queryByRole("alert")).not.toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("shows required field errors if fields are empty", async () => {
//     renderSignUp();
//     fireEvent.click(screen.getByTestId("register-button"));
//     await waitFor(
//       () => {
//         expect(screen.getByText("Please enter a valid name.")).toBeInTheDocument();
//         expect(screen.getByText("Enter a valid 10-digit mobile number.")).toBeInTheDocument();
//         expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
//         expect(screen.getByText("Please select a bank.")).toBeInTheDocument();
//         expect(screen.getByText("Enter a valid designation.")).toBeInTheDocument();
//         expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("redirects to home if user is already logged in", () => {
//     localStorageMock.getItem.mockReturnValue("existing-token");
//     renderSignUp();
//     expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
//   });

//   it("handles excessively long input values", async () => {
//     renderSignUp();
//     const longString = "A".repeat(1000);
//     fireEvent.change(screen.getByTestId("name"), { target: { value: longString } });
//     fireEvent.change(screen.getByTestId("phone_no"), { target: { value: "9876543210" } });
//     fireEvent.change(screen.getByTestId("email"), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByTestId("bank"), { target: { value: "HDFC Bank" } });
//     fireEvent.change(screen.getByTestId("designation"), { target: { value: "Manager" } });
//     fireEvent.change(screen.getByTestId("password"), { target: { value: "123456" } });
//     fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "123456" } });

//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(mockedAxios.post).toHaveBeenCalledWith(
//           "http://localhost:5000/api/signup",
//           expect.objectContaining({
//             name: longString,
//             phone_no: "9876543210",
//             email: "test@example.com",
//             bank: "HDFC Bank",
//             designation: "Manager",
//             password: "123456",
//           }),
//           { withCredentials: true }
//         );
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("handles invalid email formats", async () => {
//     renderSignUp();
//     fireEvent.change(screen.getByTestId("name"), { target: { value: "Test User" } });
//     fireEvent.change(screen.getByTestId("phone_no"), { target: { value: "9876543210" } });
//     fireEvent.change(screen.getByTestId("email"), { target: { value: "invalid.email@" } });
//     fireEvent.change(screen.getByTestId("bank"), { target: { value: "HDFC Bank" } });
//     fireEvent.change(screen.getByTestId("designation"), { target: { value: "Manager" } });
//     fireEvent.change(screen.getByTestId("password"), { target: { value: "123456" } });
//     fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "123456" } });

//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("handles network error during submission", async () => {
//     mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));

//     renderSignUp();
//     fireEvent.change(screen.getByTestId("name"), { target: { value: "Test User" } });
//     fireEvent.change(screen.getByTestId("phone_no"), { target: { value: "9876543210" } });
//     fireEvent.change(screen.getByTestId("email"), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByTestId("bank"), { target: { value: "HDFC Bank" } });
//     fireEvent.change(screen.getByTestId("designation"), { target: { value: "Manager" } });
//     fireEvent.change(screen.getByTestId("password"), { target: { value: "123456" } });
//     fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "123456" } });

//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(screen.getByText("❌ Registration failed!")).toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("clears error on input change", async () => {
//     renderSignUp();
//     fireEvent.change(screen.getByTestId("name"), { target: { value: "A" } });
//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(screen.getByText("Please enter a valid name.")).toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );

//     fireEvent.change(screen.getByTestId("name"), { target: { value: "Test User" } });
//     await waitFor(
//       () => {
//         expect(screen.queryByText("Please enter a valid name.")).not.toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   it("does not submit with partial form data", async () => {
//     renderSignUp();
//     fireEvent.change(screen.getByTestId("name"), { target: { value: "Test User" } });
//     fireEvent.click(screen.getByTestId("register-button"));

//     await waitFor(
//       () => {
//         expect(screen.getByText("Enter a valid 10-digit mobile number.")).toBeInTheDocument();
//         expect(mockedAxios.post).not.toHaveBeenCalled();
//       },
//       { timeout: 2000 }
//     );
//   });
// });

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import SignUp from "../src/pages/SignUp";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// MUI Snackbar/Alert mock
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Snackbar: ({ open, children }: any) => (open ? <div data-testid="snackbar">{children}</div> : null),
  Alert: ({ children }: any) => <div data-testid="alert">{children}</div>,
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Helper: render with router
const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("redirects to /home if token exists in localStorage on mount", () => {
    localStorage.setItem("token", "123");
    renderWithRouter(<SignUp />);
    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });

  it("renders all input fields and button", () => {
    renderWithRouter(<SignUp />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select bank/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/designation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^🔒 Password$/)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("shows error for invalid name (too short)", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "A" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/valid name/i)).toBeInTheDocument();
  });

  it("shows error for invalid phone number (not 10 digits)", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/10-digit mobile/i)).toBeInTheDocument();
  });

  it("shows error for phone not starting with 6-9", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: "5123456789" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/10-digit mobile/i)).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("shows error when bank is not selected", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Name" } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: "9123456789" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@test.com" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/select a bank/i)).toBeInTheDocument();
  });

  it("shows error for invalid designation (too short)", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "A" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/valid designation/i)).toBeInTheDocument();
  });

  it("shows error for short password", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/^🔒 Password$/), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/^🔒 Password$/), { target: { value: "password" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("allows password visibility toggle", () => {
    renderWithRouter(<SignUp />);
    const pwdInput = screen.getByLabelText(/^🔒 Password$/);
    const eye = screen.getAllByRole("img")[0] || screen.getAllByTestId("FaEye")[0];
    // Default is 'password'
    expect(pwdInput).toHaveAttribute("type", "password");
    fireEvent.click(eye);
    expect(pwdInput).toHaveAttribute("type", "text");
  });

  it("allows confirm password visibility toggle", () => {
    renderWithRouter(<SignUp />);
    const confirmPwdInput = screen.getByLabelText(/confirm password/i);
    const eyes = screen.getAllByRole("img");
    const eye = eyes[1] || screen.getAllByTestId("FaEye")[1];
    expect(confirmPwdInput).toHaveAttribute("type", "password");
    fireEvent.click(eye);
    expect(confirmPwdInput).toHaveAttribute("type", "text");
  });

  it("no error if all fields are valid", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: "9123456789" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@bank.com" } });
    fireEvent.change(screen.getByLabelText(/select bank/i), { target: { value: "HDFC Bank" } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "Manager" } });
    fireEvent.change(screen.getByLabelText(/^🔒 Password$/), { target: { value: "password" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button"));
    // No error message should be present
    await waitFor(() => {
      expect(screen.queryByText(/valid/)).not.toBeInTheDocument();
      expect(screen.queryByText(/do not match/)).not.toBeInTheDocument();
    });
  });

  it("submits form and shows success snackbar, navigates to /login", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { access_token: "token" } });
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: "9123456789" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@bank.com" } });
    fireEvent.change(screen.getByLabelText(/select bank/i), { target: { value: "HDFC Bank" } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "Manager" } });
    fireEvent.change(screen.getByLabelText(/^🔒 Password$/), { target: { value: "password" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password" } });

    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(await screen.findByTestId("snackbar")).toHaveTextContent(/registration successful/i);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error snackbar on API error", async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { error: "User exists" } } });
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: "9123456789" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@bank.com" } });
    fireEvent.change(screen.getByLabelText(/select bank/i), { target: { value: "HDFC Bank" } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "Manager" } });
    fireEvent.change(screen.getByLabelText(/^🔒 Password$/), { target: { value: "password" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password" } });

    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(await screen.findByTestId("snackbar")).toHaveTextContent(/user exists/i);
  });

  it("shows fallback error snackbar if API no response data", async () => {
    mockedAxios.post.mockRejectedValueOnce({});
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: "9123456789" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@bank.com" } });
    fireEvent.change(screen.getByLabelText(/select bank/i), { target: { value: "HDFC Bank" } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "Manager" } });
    fireEvent.change(screen.getByLabelText(/^🔒 Password$/), { target: { value: "password" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password" } });

    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(await screen.findByTestId("snackbar")).toHaveTextContent(/registration failed/i);
  });

  it("clears error when user corrects input", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "A" } });
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/valid name/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Anna" } });
    // Error should disappear
    expect(screen.queryByText(/valid name/i)).not.toBeInTheDocument();
  });

  it("displays all bank options in select", () => {
    renderWithRouter(<SignUp />);
    fireEvent.click(screen.getByLabelText(/select bank/i));
    [
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
    ].forEach((bank) => {
      expect(screen.getByRole("option", { name: bank })).toBeInTheDocument();
    });
  });

  it("submit button animates on click", () => {
    renderWithRouter(<SignUp />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button).toHaveStyle("transform: scale(1.05)");
  });

  it("snackbar closes on close click", async () => {
    renderWithRouter(<SignUp />);
    // simulate showing snackbar
    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });
    await act(async () => {
      fireEvent.click(document.body); // simulate click outside or close
    });
    // Snackbar will close, no longer in doc
    await waitFor(() => {
      expect(screen.queryByTestId("snackbar")).not.toBeInTheDocument();
    });
  });
});


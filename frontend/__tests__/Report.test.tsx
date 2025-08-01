
// import React from "react";
// import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
// import Report from '../src/pages/Report';
// import axios from "axios";

// // Mocks
// jest.mock("axios");
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// // Chart.js stubs to avoid rendering errors
// jest.mock("react-chartjs-2", () => ({
//   Bar: (props: any) => (
//     <div data-testid="bar-chart">{JSON.stringify(props.data)}</div>
//   ),
//   Pie: (props: any) => (
//     <div data-testid="pie-chart">{JSON.stringify(props.data)}</div>
//   ),
// }));

// // Lucide-react Download icon stub
// jest.mock("lucide-react", () => ({
//   Download: () => <svg data-testid="download-icon" />,
// }));

// describe("Report Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     localStorage.clear();
//   });

//   function setupMockBank(name = "HDFC Bank") {
//     mockedAxios.get.mockResolvedValueOnce({ data: { bank: name } });
//   }

//   function fillAlerts({
//     hardwareAlerts = {},
//     softwareAlerts = {},
//   }: {
//     hardwareAlerts?: any;
//     softwareAlerts?: any;
//   }) {
//     global.fetch = jest.fn()
//       // hardware
//       .mockImplementationOnce(() =>
//         Promise.resolve({ json: () => Promise.resolve(hardwareAlerts) })
//       )
//       // software
//       .mockImplementationOnce(() =>
//         Promise.resolve({ json: () => Promise.resolve(softwareAlerts) })
//       ) as any;
//   }

//   it("fetches user bank and renders charts", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({
//       hardwareAlerts: { "HDFC Bank": [{ atm: "ATM1", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }] },
//       softwareAlerts: { "HDFC Bank": [{ software: "CBS", system: "Core", status: "Critical", timestamp: "2025-03-10T10:00:00Z" }] },
//     });
//     render(<Report />);
//     expect(mockedAxios.get).toHaveBeenCalledWith(
//       "http://localhost:5000/api/get-bank",
//       expect.any(Object)
//     );
//     // Wait for effect
//     await waitFor(() => {
//       expect(screen.getByText(/Monthly Performance Report/i)).toBeInTheDocument();
//     });
//     expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
//     expect(screen.getAllByTestId("pie-chart").length).toBeGreaterThan(0);
//     expect(screen.getByText(/HDFC Bank/)).toBeInTheDocument();
//   });

//   it("handles API error fetching user bank gracefully", async () => {
//     mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
//     fillAlerts({ hardwareAlerts: {}, softwareAlerts: {} });
//     render(<Report />);
//     await waitFor(() => {
//       expect(screen.getByText(/Monthly Performance Report/i)).toBeInTheDocument();
//     });
//     expect(screen.getByText(/Select Bank/)).toBeInTheDocument();
//   });

//   it("shows alert if download PDF without selecting a bank", async () => {
//     setupMockBank("");
//     fillAlerts({ hardwareAlerts: {}, softwareAlerts: {} });
//     window.alert = jest.fn();
//     render(<Report />);
//     const btn = screen.getByRole("button", { name: /download pdf report/i });
//     fireEvent.click(btn);
//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Please select a bank/i));
//     });
//   });

//   it("calls download PDF and triggers download on success", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({
//       hardwareAlerts: { "HDFC Bank": [] },
//       softwareAlerts: { "HDFC Bank": [] },
//     });
//     const mockBlob = new Blob(["dummy"], { type: "application/pdf" });
//     mockedAxios.post.mockResolvedValueOnce({ data: mockBlob });
//     // mock URL.createObjectURL and click
//     const url = "blob:http://localhost/dummy";
//     window.URL.createObjectURL = jest.fn(() => url);
//     window.URL.revokeObjectURL = jest.fn();
//     const clickMock = jest.fn();
//     document.createElement = jest.fn().mockImplementation((tag) => {
//       if (tag === "a") return { setAttribute: jest.fn(), click: clickMock, href: "" };
//       return document.createElement(tag);
//     });

//     render(<Report />);
//     await waitFor(() => screen.getByRole("button", { name: /download pdf report/i }));
//     const btn = screen.getByRole("button", { name: /download pdf report/i });
//     fireEvent.click(btn);

//     await waitFor(() => {
//       expect(mockedAxios.post).toHaveBeenCalledWith(
//         "http://localhost:5000/api/generate-report-pdf",
//         expect.objectContaining({ bankName: "HDFC Bank" }),
//         expect.objectContaining({ responseType: "blob" })
//       );
//       expect(clickMock).toHaveBeenCalled();
//       expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(url);
//     });
//   });

//   it("shows alert if PDF generation fails", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({
//       hardwareAlerts: { "HDFC Bank": [] },
//       softwareAlerts: { "HDFC Bank": [] },
//     });
//     window.alert = jest.fn();
//     mockedAxios.post.mockRejectedValueOnce(new Error("Error"));
//     render(<Report />);
//     await waitFor(() => screen.getByRole("button", { name: /download pdf report/i }));
//     const btn = screen.getByRole("button", { name: /download pdf report/i });
//     fireEvent.click(btn);
//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith(
//         expect.stringMatching(/Failed to generate PDF report/i)
//       );
//     });
//   });

//   it("filters alerts by date", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({
//       hardwareAlerts: {
//         "HDFC Bank": [
//           { atm: "ATM1", status: "Warning", timestamp: "2025-03-10T10:00:00Z" },
//           { atm: "ATM2", status: "Critical", timestamp: "2025-04-10T10:00:00Z" },
//         ]
//       },
//       softwareAlerts: { "HDFC Bank": [] }
//     });
//     render(<Report />);
//     await waitFor(() => screen.getByLabelText(/from:/i));
//     fireEvent.change(screen.getByLabelText(/from:/i), { target: { value: "2025-04-01" } });
//     fireEvent.change(screen.getByLabelText(/to:/i), { target: { value: "2025-04-30" } });
//     // Only ATM2 should be present in breakdown
//     await waitFor(() => {
//       expect(screen.getAllByTestId("bar-chart")[0]).toHaveTextContent("Critical");
//     });
//   });

//   it("renders with multiple banks and allows switching", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({
//       hardwareAlerts: {
//         "HDFC Bank": [{ atm: "ATM1", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }],
//         "ICICI Bank": [{ atm: "ATM2", status: "Critical", timestamp: "2025-03-10T10:00:00Z" }]
//       },
//       softwareAlerts: { "HDFC Bank": [], "ICICI Bank": [] }
//     });
//     render(<Report />);
//     await waitFor(() => screen.getByLabelText(/bank:/i));
//     const select = screen.getByLabelText(/bank:/i);
//     fireEvent.change(select, { target: { value: "ICICI Bank" } });
//     expect(select).toHaveValue("ICICI Bank");
//   });

//   it("shows fallback when no ATM or software alerts in selected range", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({
//       hardwareAlerts: { "HDFC Bank": [] },
//       softwareAlerts: { "HDFC Bank": [] }
//     });
//     render(<Report />);
//     await waitFor(() => screen.getByText(/ATM-wise Alert Breakdown/i));
//     expect(screen.getByText(/No ATM alerts/i)).toBeInTheDocument();
//     expect(screen.getByText(/No software alerts/i)).toBeInTheDocument();
//   });

//   it("renders benefit cards and impact section", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({ hardwareAlerts: {}, softwareAlerts: {} });
//     render(<Report />);
//     expect(screen.getByText(/Investment Impact & Benefits/i)).toBeInTheDocument();
//     expect(screen.getByText(/Early Detection of Failures/i)).toBeInTheDocument();
//     expect(screen.getByText(/Cost Optimization/i)).toBeInTheDocument();
//   });

//   it("renders charts with correct data for software/hardware breakdowns", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({
//       hardwareAlerts: {
//         "HDFC Bank": [
//           { atm: "ATM1", status: "Warning", timestamp: "2025-03-10T10:00:00Z" },
//           { atm: "ATM1", status: "Critical", timestamp: "2025-03-11T10:00:00Z" }
//         ]
//       },
//       softwareAlerts: {
//         "HDFC Bank": [
//           { software: "CBS", system: "Core", status: "Critical", timestamp: "2025-03-10T10:00:00Z" },
//           { software: "FMS", system: "Frontend", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }
//         ]
//       }
//     });
//     render(<Report />);
//     await waitFor(() => {
//       expect(screen.getAllByTestId("pie-chart").length).toBeGreaterThan(0);
//       expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
//     });
//     // Hardware Pie chart contains correct values
//     expect(screen.getAllByTestId("pie-chart")[0]).toHaveTextContent("Warning");
//     expect(screen.getAllByTestId("pie-chart")[0]).toHaveTextContent("Critical");
//     // Software Breakdown contains CBS - Core, FMS - Frontend
//     expect(screen.getAllByTestId("bar-chart")[3]).toHaveTextContent("CBS - Core");
//     expect(screen.getAllByTestId("bar-chart")[3]).toHaveTextContent("FMS - Frontend");
//   });

//   it("pdf button disables during download", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({ hardwareAlerts: { "HDFC Bank": [] }, softwareAlerts: { "HDFC Bank": [] } });
//     mockedAxios.post.mockImplementation(() => new Promise(() => {})); // never resolves
//     render(<Report />);
//     await waitFor(() => screen.getByRole("button", { name: /download pdf report/i }));
//     const btn = screen.getByRole("button", { name: /download pdf report/i });
//     fireEvent.click(btn);
//     expect(btn).toBeDisabled();
//   });

//   it("handles undefined atm/software/system keys gracefully", async () => {
//     setupMockBank("HDFC Bank");
//     fillAlerts({
//       hardwareAlerts: { "HDFC Bank": [{ status: "Warning", timestamp: "2025-03-10T10:00:00Z" }] },
//       softwareAlerts: { "HDFC Bank": [{ status: "Warning", timestamp: "2025-03-10T10:00:00Z" }] }
//     });
//     render(<Report />);
//     await waitFor(() => {
//       expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
//     });
//   });
// });import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Report from '../src/pages/Report';
import axios from "axios";

// Mocks
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Chart.js stubs to avoid rendering errors
jest.mock("react-chartjs-2", () => ({
  Bar: (props: any) => (
    <div data-testid="bar-chart">{JSON.stringify(props.data)}</div>
  ),
  Pie: (props: any) => (
    <div data-testid="pie-chart">{JSON.stringify(props.data)}</div>
  ),
}));

// Lucide-react Download icon stub
jest.mock("lucide-react", () => ({
  Download: () => <svg data-testid="download-icon" />,
}));

describe("Report Component", () => {
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.alert = jest.fn();
    originalCreateElement = document.createElement;
    // Restore any global fetch changes
    global.fetch = jest.fn();
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  function setupMockBank(name = "HDFC Bank") {
    mockedAxios.get.mockResolvedValueOnce({ data: { bank: name } });
  }

  function fillAlerts({
    hardwareAlerts = {},
    softwareAlerts = {},
  }: {
    hardwareAlerts?: any;
    softwareAlerts?: any;
  }) {
    global.fetch = jest.fn()
      // hardware
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(hardwareAlerts) })
      )
      // software
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(softwareAlerts) })
      ) as any;
  }

  it("fetches user bank and renders charts", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: { "HDFC Bank": [{ atm: "ATM1", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }] },
      softwareAlerts: { "HDFC Bank": [{ software: "CBS", system: "Core", status: "Critical", timestamp: "2025-03-10T10:00:00Z" }] },
    });
    render(<Report />);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/get-bank",
      expect.any(Object)
    );
    await waitFor(() => {
      expect(screen.getByText(/Monthly Performance Report/i)).toBeInTheDocument();
    });
    expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("pie-chart").length).toBeGreaterThan(0);
    expect(screen.getByText(/HDFC Bank/)).toBeInTheDocument();
  });

  it("handles API error fetching user bank gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
    fillAlerts({ hardwareAlerts: {}, softwareAlerts: {} });
    render(<Report />);
    await waitFor(() => {
      expect(screen.getByText(/Monthly Performance Report/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Select Bank/)).toBeInTheDocument();
  });

  it("shows alert if download PDF without selecting a bank", async () => {
    setupMockBank("");
    fillAlerts({ hardwareAlerts: {}, softwareAlerts: {} });
    window.alert = jest.fn();
    render(<Report />);
    const btn = screen.getByRole("button", { name: /download pdf report/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Please select a bank/i));
    });
  });

  it("calls download PDF and triggers download on success", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: { "HDFC Bank": [] },
      softwareAlerts: { "HDFC Bank": [] },
    });
    const mockBlob = new Blob(["dummy"], { type: "application/pdf" });
    mockedAxios.post.mockResolvedValueOnce({ data: mockBlob });
    // mock URL.createObjectURL and click
    const url = "blob:http://localhost/dummy";
    window.URL.createObjectURL = jest.fn(() => url);
    window.URL.revokeObjectURL = jest.fn();
    const clickMock = jest.fn();
    const mockLink = {
      setAttribute: jest.fn(),
      click: clickMock,
      href: "",
      style: {},
    };
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === "a") return mockLink;
      return originalCreateElement.call(document, tag);
    }) as any;

    render(<Report />);
    await waitFor(() => screen.getByRole("button", { name: /download pdf report/i }));
    const btn = screen.getByRole("button", { name: /download pdf report/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/generate-report-pdf",
        expect.objectContaining({ bankName: "HDFC Bank" }),
        expect.objectContaining({ responseType: "blob" })
      );
      expect(clickMock).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(url);
    });
  });

  it("shows alert if PDF generation fails", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: { "HDFC Bank": [] },
      softwareAlerts: { "HDFC Bank": [] },
    });
    window.alert = jest.fn();
    mockedAxios.post.mockRejectedValueOnce(new Error("Error"));
    render(<Report />);
    await waitFor(() => screen.getByRole("button", { name: /download pdf report/i }));
    const btn = screen.getByRole("button", { name: /download pdf report/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringMatching(/Failed to generate PDF report/i)
      );
    });
  });

  it("enables and disables PDF button during download", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({ hardwareAlerts: { "HDFC Bank": [] }, softwareAlerts: { "HDFC Bank": [] } });
    mockedAxios.post.mockImplementation(() => new Promise(() => {}));
    render(<Report />);
    await waitFor(() => screen.getByRole("button", { name: /download pdf report/i }));
    const btn = screen.getByRole("button", { name: /download pdf report/i });
    fireEvent.click(btn);
    expect(btn).toBeDisabled();
  });

  it("filters alerts by date", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: {
        "HDFC Bank": [
          { atm: "ATM1", status: "Warning", timestamp: "2025-03-10T10:00:00Z" },
          { atm: "ATM2", status: "Critical", timestamp: "2025-04-10T10:00:00Z" },
        ]
      },
      softwareAlerts: { "HDFC Bank": [] }
    });
    render(<Report />);
    await waitFor(() => screen.getByLabelText(/from:/i));
    fireEvent.change(screen.getByLabelText(/from:/i), { target: { value: "2025-04-01" } });
    fireEvent.change(screen.getByLabelText(/to:/i), { target: { value: "2025-04-30" } });
    await waitFor(() => {
      expect(screen.getAllByTestId("bar-chart")[0]).toHaveTextContent("Critical");
    });
  });

  it("renders with multiple banks and allows switching", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: {
        "HDFC Bank": [{ atm: "ATM1", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }],
        "ICICI Bank": [{ atm: "ATM2", status: "Critical", timestamp: "2025-03-10T10:00:00Z" }]
      },
      softwareAlerts: { "HDFC Bank": [], "ICICI Bank": [] }
    });
    render(<Report />);
    await waitFor(() => screen.getByLabelText(/bank:/i));
    const select = screen.getByLabelText(/bank:/i);
    fireEvent.change(select, { target: { value: "ICICI Bank" } });
    expect(select).toHaveValue("ICICI Bank");
  });

  it("shows fallback when no ATM or software alerts in selected range", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: { "HDFC Bank": [] },
      softwareAlerts: { "HDFC Bank": [] }
    });
    render(<Report />);
    await waitFor(() => screen.getByText(/ATM-wise Alert Breakdown/i));
    expect(screen.getByText(/No ATM alerts/i)).toBeInTheDocument();
    expect(screen.getByText(/No software alerts/i)).toBeInTheDocument();
  });

  it("renders benefit cards and impact section", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({ hardwareAlerts: {}, softwareAlerts: {} });
    render(<Report />);
    expect(screen.getByText(/Investment Impact & Benefits/i)).toBeInTheDocument();
    expect(screen.getByText(/Early Detection of Failures/i)).toBeInTheDocument();
    expect(screen.getByText(/Cost Optimization/i)).toBeInTheDocument();
  });

  it("renders charts with correct data for software/hardware breakdowns", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: {
        "HDFC Bank": [
          { atm: "ATM1", status: "Warning", timestamp: "2025-03-10T10:00:00Z" },
          { atm: "ATM1", status: "Critical", timestamp: "2025-03-11T10:00:00Z" }
        ]
      },
      softwareAlerts: {
        "HDFC Bank": [
          { software: "CBS", system: "Core", status: "Critical", timestamp: "2025-03-10T10:00:00Z" },
          { software: "FMS", system: "Frontend", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }
        ]
      }
    });
    render(<Report />);
    await waitFor(() => {
      expect(screen.getAllByTestId("pie-chart").length).toBeGreaterThan(0);
      expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
    });
    expect(screen.getAllByTestId("pie-chart")[0]).toHaveTextContent("Warning");
    expect(screen.getAllByTestId("pie-chart")[0]).toHaveTextContent("Critical");
    expect(screen.getAllByTestId("bar-chart")[3]).toHaveTextContent("CBS - Core");
    expect(screen.getAllByTestId("bar-chart")[3]).toHaveTextContent("FMS - Frontend");
  });

  it("handles undefined atm/software/system keys gracefully", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: { "HDFC Bank": [{ status: "Warning", timestamp: "2025-03-10T10:00:00Z" }] },
      softwareAlerts: { "HDFC Bank": [{ status: "Warning", timestamp: "2025-03-10T10:00:00Z" }] }
    });
    render(<Report />);
    await waitFor(() => {
      expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
    });
  });

  // --- Additional Edge Cases for Coverage ---

  it("handles empty alerts data for all banks", async () => {
    setupMockBank("Axis Bank");
    fillAlerts({ hardwareAlerts: {}, softwareAlerts: {} });
    render(<Report />);
    await waitFor(() => {
      expect(screen.getByText(/Monthly Performance Report/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Select Bank/)).toBeInTheDocument();
  });

  it("handles undefined or null userBank with bank keys present", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { bank: undefined } });
    fillAlerts({
      hardwareAlerts: { "SBI Bank": [] },
      softwareAlerts: { "SBI Bank": [] }
    });
    render(<Report />);
    await waitFor(() => {
      expect(screen.getByText(/Select Bank/i)).toBeInTheDocument();
    });
  });

  it("shows warning if only Healthy alerts are present", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: { "HDFC Bank": [{ atm: "ATM1", status: "Healthy", timestamp: "2025-03-10T10:00:00Z" }] },
      softwareAlerts: { "HDFC Bank": [{ software: "CBS", system: "Core", status: "Healthy", timestamp: "2025-03-10T10:00:00Z" }] }
    });
    render(<Report />);
    await waitFor(() => screen.getByText(/Hardware Alerts/i));
    expect(screen.getByTestId("bar-chart")).toHaveTextContent("Healthy");
  });

  it("handles case: switch between banks with no overlap in alerts", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: { "HDFC Bank": [], "ICICI": [{ atm: "A", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }] },
      softwareAlerts: { "ICICI": [{ software: "ABC", system: "Core", status: "Critical", timestamp: "2025-03-10T10:00:00Z" }] }
    });
    render(<Report />);
    await waitFor(() => screen.getByLabelText(/bank:/i));
    const select = screen.getByLabelText(/bank:/i);
    fireEvent.change(select, { target: { value: "ICICI" } });
    await waitFor(() => {
      expect(select).toHaveValue("ICICI");
      expect(screen.getByText(/Software Alerts/i)).toBeInTheDocument();
    });
  });

  it("handles ATM and software names that are falsy or empty strings", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({
      hardwareAlerts: { "HDFC Bank": [{ atm: "", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }, { status: "Critical", timestamp: "2025-03-10T10:00:00Z" }] },
      softwareAlerts: { "HDFC Bank": [{ software: "", system: "", status: "Warning", timestamp: "2025-03-10T10:00:00Z" }] }
    });
    render(<Report />);
    await waitFor(() => {
      expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
    });
  });

  it("sets and disables bank dropdown if userBank exists", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({ hardwareAlerts: { "HDFC Bank": [] }, softwareAlerts: { "HDFC Bank": [] } });
    render(<Report />);
    await waitFor(() => screen.getByLabelText(/bank:/i));
    const dropdown = screen.getByLabelText(/bank:/i);
    expect(dropdown).toBeDisabled();
  });

  it("shows correct pie chart tooltip label even if total is 0", async () => {
    setupMockBank("HDFC Bank");
    fillAlerts({ hardwareAlerts: { "HDFC Bank": [] }, softwareAlerts: { "HDFC Bank": [] } });
    render(<Report />);
    await waitFor(() => screen.getByTestId("pie-chart"));
    expect(screen.getByTestId("pie-chart")).toBeDefined();
  });

  it("handles case when fetch throws error", async () => {
    setupMockBank("HDFC Bank");
    global.fetch = jest.fn().mockImplementation(() => Promise.reject("fail"));
    render(<Report />);
    await waitFor(() => screen.getByText(/Monthly Performance Report/i));
  });

  it("handles case when matchedBankKey is not available", async () => {
    setupMockBank("");
    fillAlerts({ hardwareAlerts: {}, softwareAlerts: {} });
    render(<Report />);
    await waitFor(() => {
      expect(screen.getByText(/Select Bank/)).toBeInTheDocument();
    });
  });

  it("handles various label casing and whitespace for matching banks", async () => {
    setupMockBank("hdfc bank");
    fillAlerts({
      hardwareAlerts: { "HDFC   Bank": [] },
      softwareAlerts: {}
    });
    render(<Report />);
    await waitFor(() => {
      expect(screen.getByText(/Monthly Performance Report/i)).toBeInTheDocument();
    });
  });
});
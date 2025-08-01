// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import SoftwarePrediction from '../src/pages/SoftwarePrediction';

// describe('SoftwarePrediction', () => {
//   it('renders dashboard and dropdowns', () => {
//     render(<SoftwarePrediction userBank="HDFC Bank" />);
//     expect(screen.getByText(/Software Prediction Dashboard/i)).toBeInTheDocument();
//     expect(screen.getByRole('combobox')).toBeInTheDocument();
//   });

//   it('shows software dropdown options for selected bank', () => {
//     render(<SoftwarePrediction userBank="HDFC Bank" />);
//     const dropdowns = screen.getAllByRole('combobox');
//     expect(dropdowns.length).toBeGreaterThan(1);
//     fireEvent.change(dropdowns[0], { target: { value: 'HDFC Bank' } });
//     fireEvent.change(dropdowns[1], { target: { value: 'PayZapp' } });
//     expect(screen.getByDisplayValue('PayZapp')).toBeInTheDocument();
//   });

//   it('fetches and renders software system metrics', async () => {
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({
//           'HDFC Bank': {
//             'PayZapp': {
//               'Core Banking System': {
//                 "Error Rate": 1.5,
//                 "Response Time": 850,
//                 "Crashes/Week": 1,
//                 "Uptime": 98.5
//               },
//               'Payment Gateway': {
//                 "Error Rate": 2.2,
//                 "Response Time": 900,
//                 "Crashes/Week": 1,
//                 "Uptime": 97.5
//               }
//             },
//           },
//         }),
//       })
//     ) as jest.Mock;

//     render(<SoftwarePrediction userBank="HDFC Bank" />);
//     const dropdowns = screen.getAllByRole('combobox');
//     expect(dropdowns.length).toBeGreaterThan(1);
//     fireEvent.change(dropdowns[0], { target: { value: 'HDFC Bank' } });
//     fireEvent.change(dropdowns[1], { target: { value: 'PayZapp' } });

//     await waitFor(() => {
//       expect(screen.getByText(/System Predictions/i)).toBeInTheDocument();
//       expect(screen.getByText(/Core Banking System/)).toBeInTheDocument();
//       expect(screen.getByText(/Payment Gateway/)).toBeInTheDocument();
//     });
//   });

//   it('shows warning if no software metrics available', async () => {
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({
//           'HDFC Bank': {
//             'HDFC Sky': {},
//           },
//         }),
//       })
//     ) as jest.Mock;

//     render(<SoftwarePrediction userBank="HDFC Bank" />);
//     fireEvent.change(screen.getByRole('combobox'), { target: { value: 'HDFC Sky' } });

//     await waitFor(() => {
//       // Should not find system predictions table
//       expect(screen.queryByText(/System Predictions/i)).not.toBeInTheDocument();
//     });
//   });

//   it('renders correct bank name in the UI', () => {
//     render(<SoftwarePrediction userBank="ICICI Bank" />);
//     expect(screen.getByText(/ICICI Bank/)).toBeInTheDocument();
//   });

//   it('disables software dropdown if no bank is selected', () => {
//     render(<SoftwarePrediction userBank="" />);
//     const dropdowns = screen.getAllByRole('combobox');
//     // If only one dropdown, software dropdown is not rendered
//     if (dropdowns.length > 1) {
//       expect(dropdowns[1]).toBeDisabled();
//     } else {
//       expect(dropdowns.length).toBe(1);
//     }
//   });

//   it('shows no options in software dropdown if bank has no software', () => {
//     render(<SoftwarePrediction userBank="Nonexistent Bank" />);
//     const dropdowns = screen.getAllByRole('combobox');
//     if (dropdowns.length > 1) {
//       fireEvent.change(dropdowns[0], { target: { value: 'Nonexistent Bank' } });
//       expect(dropdowns[1].children.length).toBe(1); // Only default option
//     } else {
//       expect(dropdowns.length).toBe(1);
//     }
//   });

//   it('renders fallback UI if no predictions are available', async () => {
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({
//           'HDFC Bank': {
//             'PayZapp': null,
//           },
//         }),
//       })
//     ) as jest.Mock;

//     render(<SoftwarePrediction userBank="HDFC Bank" />);
//     const dropdowns = screen.getAllByRole('combobox');
//     if (dropdowns.length > 1) {
//       fireEvent.change(dropdowns[0], { target: { value: 'HDFC Bank' } });
//       fireEvent.change(dropdowns[1], { target: { value: 'PayZapp' } });
//     }

//     await waitFor(() => {
//       expect(screen.queryByText(/System Predictions/i)).not.toBeInTheDocument();
//     });
//   });

//   it('renders with empty userBank and does not crash', () => {
//     render(<SoftwarePrediction userBank="" />);
//     expect(screen.getByText(/Software Prediction Dashboard/i)).toBeInTheDocument();
//   });
// });


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SoftwarePrediction from '../src/pages/SoftwarePrediction';

describe('SoftwarePrediction', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders dashboard and dropdowns', () => {
    render(<SoftwarePrediction userBank="HDFC Bank" />);
    expect(screen.getByText(/Software Prediction Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows software dropdown options for selected bank', () => {
    render(<SoftwarePrediction userBank="HDFC Bank" />);
    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'PayZapp' } });
    expect(screen.getByDisplayValue('PayZapp')).toBeInTheDocument();
  });

  it('fetches and renders software system metrics', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          'HDFC Bank': {
            'PayZapp': {
              'Core Banking System': {
                "Error Rate": 1.5,
                "Response Time": 850,
                "Crashes/Week": 1,
                "Uptime": 98.5
              },
              'Payment Gateway': {
                "Error Rate": 2.2,
                "Response Time": 900,
                "Crashes/Week": 1,
                "Uptime": 97.5
              }
            }
          }
        }),
      })
    ) as jest.Mock;

    render(<SoftwarePrediction userBank="HDFC Bank" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PayZapp' } });

    await waitFor(() => {
      expect(screen.getByText(/Core Banking System/i)).toBeInTheDocument();
      expect(screen.getByText(/Payment Gateway/i)).toBeInTheDocument();
    });
  });

  it('shows warning if no software metrics available', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          'HDFC Bank': {
            'HDFC Sky': {},
          },
        }),
      })
    ) as jest.Mock;

    render(<SoftwarePrediction userBank="HDFC Bank" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'HDFC Sky' } });

    await waitFor(() => {
      expect(screen.queryByText(/Core Banking System/i)).not.toBeInTheDocument();
    });
  });

  it('renders correct bank name in the UI', () => {
    render(<SoftwarePrediction userBank="ICICI Bank" />);
    expect(screen.getByText(/ICICI Bank/)).toBeInTheDocument();
  });

  it('disables software dropdown if no bank is selected', () => {
    render(<SoftwarePrediction userBank="" />);
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeDisabled();
  });

  it('shows no options in software dropdown if bank has no software', () => {
    render(<SoftwarePrediction userBank="Nonexistent Bank" />);
    const dropdown = screen.getByRole('combobox');
    expect(dropdown.children.length).toBe(1); // Only default option
  });

  it('renders fallback UI if no predictions are available', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          'HDFC Bank': {
            'PayZapp': null,
          },
        }),
      })
    ) as jest.Mock;

    render(<SoftwarePrediction userBank="HDFC Bank" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PayZapp' } });

    await waitFor(() => {
      expect(screen.queryByText(/Core Banking System/i)).not.toBeInTheDocument();
    });
  });

  it('renders with empty userBank and does not crash', () => {
    render(<SoftwarePrediction userBank="" />);
    expect(screen.getByText(/Software Prediction Dashboard/i)).toBeInTheDocument();
  });

  it('handles empty fetch response gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    render(<SoftwarePrediction userBank="HDFC Bank" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PayZapp' } });

    await waitFor(() => {
      expect(screen.queryByText(/Core Banking System/i)).not.toBeInTheDocument();
    });
  });

  it('handles unexpected metric format from API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          'HDFC Bank': {
            'PayZapp': {
              'Core Banking System': null,
            },
          },
        }),
      })
    ) as jest.Mock;

    render(<SoftwarePrediction userBank="HDFC Bank" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PayZapp' } });

    await waitFor(() => {
      expect(screen.queryByText(/Core Banking System/i)).not.toBeInTheDocument();
    });
  });

  it('handles rapid software switching without crashing', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          'HDFC Bank': {
            'PayZapp': {
              'Core Banking System': {
                "Error Rate": 1,
                "Response Time": 500,
                "Crashes/Week": 1,
                "Uptime": 99,
              },
            },
            'HDFC Sky': {
              'Payment Gateway': {
                "Error Rate": 1,
                "Response Time": 600,
                "Crashes/Week": 0,
                "Uptime": 98.5,
              },
            },
          },
        }),
      })
    ) as jest.Mock;

    render(<SoftwarePrediction userBank="HDFC Bank" />);
    const dropdown = screen.getByRole('combobox');

    fireEvent.change(dropdown, { target: { value: 'PayZapp' } });
    fireEvent.change(dropdown, { target: { value: 'HDFC Sky' } });

    await waitFor(() => {
      expect(screen.getByText(/Payment Gateway/i)).toBeInTheDocument();
    });
  });

  it('displays correct status and risk badges', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          'ICICI Bank': {
            'iMobile': {
              'Mobile App Services': {
                "Error Rate": 4,
                "Response Time": 1200,
                "Crashes/Week": 3,
                "Uptime": 92,
              },
            },
          },
        }),
      })
    ) as jest.Mock;

    render(<SoftwarePrediction userBank="ICICI Bank" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'iMobile' } });

    await waitFor(() => {
      expect(screen.getByText(/Critical/i)).toBeInTheDocument();
      expect(screen.getByText(/High/i)).toBeInTheDocument();
    });
  });

  it('handles case-insensitive and partial bank name matches', () => {
    render(<SoftwarePrediction userBank="hdfc" />);
    expect(screen.getByText(/HDFC Bank/)).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject("API failure")) as jest.Mock;

    render(<SoftwarePrediction userBank="HDFC Bank" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PayZapp' } });

    await waitFor(() => {
      expect(screen.queryByText(/Core Banking System/i)).not.toBeInTheDocument();
    });
  });
});

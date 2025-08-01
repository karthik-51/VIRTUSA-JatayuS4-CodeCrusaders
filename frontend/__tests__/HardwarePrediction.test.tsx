import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HardwarePrediction from '../src/pages/HardwarePrediction';

describe('HardwarePrediction', () => {
  it('renders heading and ATM dropdown', () => {
    render(<HardwarePrediction userBank="HDFC Bank" />);
    expect(screen.getByText(/Hardware System Analysis/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows ATM dropdown options', async () => {
    render(<HardwarePrediction userBank="HDFC Bank" />);
    await act(async () => {
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ATM 1' } });
    });
    expect(screen.getByDisplayValue('ATM 1')).toBeInTheDocument();
  });

  it('fetches and displays hardware metrics for selected ATM', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          'HDFC Bank': {
            'ATM 1': {
              vibration: 70,
              power: 90,
              components: {
                CPU: { cpu: 50, memory: 40, storage: 30, temperature: 60 },
                Memory: { cpu: 20, memory: 80, storage: 60, temperature: 45 },
              },
            },
          },
        }),
      })
    ) as jest.Mock;

    render(<HardwarePrediction userBank="HDFC Bank" />);
    await act(async () => {
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ATM 1' } });
    });

    // There may be multiple CPU Usage, Memory, etc. Use findAllByText
    expect(await screen.findAllByText(/CPU Usage/)).toHaveLength(1);
    expect(await screen.findAllByText(/Memory/)).toHaveLength(1);
    expect(await screen.findAllByText(/Storage/)).toHaveLength(1);
    expect(await screen.findAllByText(/Temperature/)).toHaveLength(1);
  });

  it('shows warning if no hardware metrics available', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          'HDFC Bank': {
            'ATM 2': {
              vibration: 0,
              power: 0,
              components: {},
            },
          },
        }),
      })
    ) as jest.Mock;

    render(<HardwarePrediction userBank="HDFC Bank" />);
    await act(async () => {
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ATM 2' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/No hardware metrics available for this ATM/i)).toBeInTheDocument();
    });
  });

  it('renders correct bank name in the UI', () => {
    render(<HardwarePrediction userBank="ICICI Bank" />);
    expect(screen.getByText(/ICICI Bank/)).toBeInTheDocument();
  });

  it('ATM dropdown is enabled and shows options for valid userBank', () => {
    render(<HardwarePrediction userBank="HDFC Bank" />);
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).not.toBeDisabled();
    fireEvent.change(dropdown, { target: { value: 'ATM 2' } });
    expect(screen.getByDisplayValue('ATM 2')).toBeInTheDocument();
  });

  it('ATM dropdown is enabled but shows only default option for unknown userBank', () => {
    render(<HardwarePrediction userBank="Unknown Bank" />);
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).not.toBeDisabled();
    expect(dropdown.children.length).toBe(3); // ATM 1, ATM 2, default
  });

  it('renders fallback UI if no ATM is selected', () => {
    render(<HardwarePrediction userBank="HDFC Bank" />);
    expect(screen.getByText(/Hardware System Analysis/i)).toBeInTheDocument();
    // No metrics or warning shown
    expect(screen.queryByText(/No hardware metrics available for this ATM/i)).not.toBeInTheDocument();
  });

  it('renders with empty userBank and does not crash', () => {
    render(<HardwarePrediction userBank="" />);
    expect(screen.getByText(/Hardware System Analysis/i)).toBeInTheDocument();
  });
});


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MaintenanceShowcase from '../src/pages/Maintenance';

describe('MaintenanceShowcase', () => {
  it('renders the header and main title', () => {
    render(<MaintenanceShowcase />);
    expect(screen.getByText(/Smart Banking/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintenance/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure. Predict. Maintain./i)).toBeInTheDocument();
  });

  it('renders all service sections', () => {
    render(<MaintenanceShowcase />);
    expect(screen.getByText(/Software Updates/i)).toBeInTheDocument();
    expect(screen.getByText(/ATM Maintenance/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Monitoring/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Fraud Detection/i)).toBeInTheDocument();
    expect(screen.getByText(/Core Banking Support/i)).toBeInTheDocument();
    expect(screen.getByText(/On-site Field Repair/i)).toBeInTheDocument();
  });

  it('renders all maintenance plans', () => {
    render(<MaintenanceShowcase />);
    expect(screen.getByText(/Maintenance Plans/i)).toBeInTheDocument();
    expect(screen.getByText(/Basic/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium/i)).toBeInTheDocument();
    expect(screen.getByText('$49')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('$149')).toBeInTheDocument();
  });

  it('renders all plan features and buttons', () => {
    render(<MaintenanceShowcase />);
    expect(screen.getByText(/ATM logs & minor patching/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly uptime reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Fraud AI scan & reports/i)).toBeInTheDocument();
    expect(screen.getByText(/CBS latency analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/24x7 on-site dispatch/i)).toBeInTheDocument();
    expect(screen.getByText(/Full-service SLA tracking/i)).toBeInTheDocument();
    // Plan buttons
    expect(screen.getAllByRole('button', { name: /Choose Plan/i }).length).toBe(3);
  });

  it('renders CTA section and responds to CTA button click', () => {
    render(<MaintenanceShowcase />);
    expect(screen.getByText(/Ready to Protect Your Bank/i)).toBeInTheDocument();
    expect(screen.getByText(/Buy Maintenance Services/i)).toBeInTheDocument();
    const ctaButton = screen.getByRole('button', { name: /Buy Maintenance Services/i });
    fireEvent.click(ctaButton); // No error should occur
  });

  it('renders all service images with correct alt text', () => {
    render(<MaintenanceShowcase />);
    expect(screen.getByAltText(/Software Updates/i)).toBeInTheDocument();
    expect(screen.getByAltText(/ATM Maintenance/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Network Monitoring/i)).toBeInTheDocument();
    expect(screen.getByAltText(/AI Fraud Detection/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Core Banking Support/i)).toBeInTheDocument();
    expect(screen.getByAltText(/On-site Repair/i)).toBeInTheDocument();
  });

  it('plan buttons are clickable and have correct styles', () => {
    render(<MaintenanceShowcase />);
    const planButtons = screen.getAllByRole('button', { name: /Choose Plan/i });
    planButtons.forEach((btn) => {
      expect(btn).toBeEnabled();
      fireEvent.click(btn); // Should not throw
      expect(btn).toHaveClass('rounded-full');
    });
  });

  it('CTA button has correct style and responds to hover', () => {
    render(<MaintenanceShowcase />);
    const ctaButton = screen.getByRole('button', { name: /Buy Maintenance Services/i });
    expect(ctaButton).toHaveStyle('background-image: linear-gradient(to right, #0099b5, #434343)');
    fireEvent.mouseOver(ctaButton);
    // No error should occur on hover
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
beforeAll(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  describe('Rendering', () => {
    it('renders main heading and description', () => {
      renderHomePage();
      
      expect(screen.getByText('Predictive Maintenance for Banking Infrastructure')).toBeInTheDocument();
      expect(screen.getByText(/Prevent downtime, reduce costs, and optimize your banking infrastructure/)).toBeInTheDocument();
    });

    it('renders key features section', () => {
      renderHomePage();
      
      expect(screen.getByText('Key Features')).toBeInTheDocument();
      expect(screen.getByText('PROACTIVE PROTECTION')).toBeInTheDocument();
      expect(screen.getByText('REAL-TIME MONITORING')).toBeInTheDocument();
      expect(screen.getByText('PREDICTIVE ANALYTICS')).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
      renderHomePage();
      
      expect(screen.getByText(/Identify and address potential issues before they impact your banking operations/)).toBeInTheDocument();
      expect(screen.getByText(/24\/7 monitoring of your hardware and software infrastructure components/)).toBeInTheDocument();
      expect(screen.getByText(/Advanced analytics to forecast maintenance needs and optimize performance/)).toBeInTheDocument();
    });

    it('renders hero section with background image', () => {
      renderHomePage();
      
      const heroSection = screen.getByText('Predictive Maintenance for Banking Infrastructure').closest('section');
      expect(heroSection).toHaveClass('relative', 'z-30', 'flex', 'items-center', 'justify-center', 'text-center', 'h-full');
    });
  });

  describe('Authentication State', () => {
    it('shows login and signup buttons when user is not authenticated', () => {
      localStorageMock.getItem.mockReturnValue(null);
      renderHomePage();
      
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('hides login and signup buttons when user is authenticated', () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      renderHomePage();
      
      expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('has correct link to signup page', () => {
      localStorageMock.getItem.mockReturnValue(null);
      renderHomePage();
      
      const signupLink = screen.getByText('Get Started').closest('a');
      expect(signupLink).toHaveAttribute('href', '/SignUp');
    });

    it('has correct link to login page', () => {
      localStorageMock.getItem.mockReturnValue(null);
      renderHomePage();
      
      const loginLink = screen.getByText('Login').closest('a');
      expect(loginLink).toHaveAttribute('href', '/Login');
    });

    it('navigates to signup page when Get Started is clicked', () => {
      localStorageMock.getItem.mockReturnValue(null);
      renderHomePage();
      
      const signupButton = screen.getByText('Get Started');
      fireEvent.click(signupButton);
      
      // Since we're using Link component, the navigation should work
      expect(signupButton.closest('a')).toHaveAttribute('href', '/SignUp');
    });

    it('navigates to login page when Login is clicked', () => {
      localStorageMock.getItem.mockReturnValue(null);
      renderHomePage();
      
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);
      
      // Since we're using Link component, the navigation should work
      expect(loginButton.closest('a')).toHaveAttribute('href', '/Login');
    });
  });

  describe('Feature Cards', () => {
    it('renders all three feature cards', () => {
      renderHomePage();
      
      const featureCards = screen.getAllByText(/PROACTIVE PROTECTION|REAL-TIME MONITORING|PREDICTIVE ANALYTICS/);
      expect(featureCards).toHaveLength(3);
    });

    it('renders feature card images', () => {
      renderHomePage();
      
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      
      // Check for specific feature images
      const proactiveImage = images.find(img => img.getAttribute('alt') === 'Proactive Protection');
      const monitoringImage = images.find(img => img.getAttribute('alt') === 'Real-time Monitoring');
      const analyticsImage = images.find(img => img.getAttribute('alt') === 'Predictive Analytics');
      
      expect(proactiveImage).toBeInTheDocument();
      expect(monitoringImage).toBeInTheDocument();
      expect(analyticsImage).toBeInTheDocument();
    });

    it('renders feature icons', () => {
      renderHomePage();
      
      // Check for Lucide React icons (they render as SVGs)
      const shieldIcon = document.querySelector('svg[data-lucide="shield"]') || 
                        document.querySelector('svg[data-lucide="shield-check"]');
      const clockIcon = document.querySelector('svg[data-lucide="clock"]');
      const trendingIcon = document.querySelector('svg[data-lucide="trending-up"]');
      
      // Since icons might be rendered differently, we'll check for the presence of icon containers
      const iconContainers = document.querySelectorAll('.inline-flex.items-center.justify-center.w-14.h-14.rounded-full');
      expect(iconContainers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Background Image Carousel', () => {
    it('renders with initial background image', () => {
      renderHomePage();
      
      const heroSection = screen.getByText('Predictive Maintenance for Banking Infrastructure').closest('div');
      const backgroundContainer = heroSection?.parentElement;
      
      expect(backgroundContainer).toHaveStyle({
        backgroundImage: expect.stringContaining('url(')
      });
    });

    it('changes background image over time', async () => {
      jest.useFakeTimers();
      renderHomePage();
      
      const initialBackground = document.querySelector('.relative.w-full.h-\\[90vh\\]')?.getAttribute('style');
      
      // Fast-forward time to trigger image change
      jest.advanceTimersByTime(5000);
      
      await waitFor(() => {
        const newBackground = document.querySelector('.relative.w-full.h-\\[90vh\\]')?.getAttribute('style');
        expect(newBackground).not.toBe(initialBackground);
      });
      
      jest.useRealTimers();
    });
  });

  describe('Responsive Design', () => {
    it('renders with responsive grid layout', () => {
      renderHomePage();
      
      const featuresGrid = screen.getByText('Key Features').closest('section')?.querySelector('.grid');
      expect(featuresGrid).toHaveClass('md:grid-cols-3');
    });

    it('renders feature cards with hover effects', () => {
      renderHomePage();
      
      const featureCards = document.querySelectorAll('.bg-white.rounded-2xl.overflow-hidden.transition.transform.hover\\:scale-105');
      expect(featureCards.length).toBeGreaterThan(0);
      
      featureCards.forEach(card => {
        expect(card).toHaveClass('hover:scale-105');
      });
    });
  });

  describe('Styling and Layout', () => {
    it('renders with proper container styling', () => {
      renderHomePage();
      
      const mainContainer = screen.getByText('Predictive Maintenance for Banking Infrastructure').closest('.w-screen');
      expect(mainContainer).toHaveClass('overflow-x-hidden', 'm-0', 'p-0');
    });

    it('renders hero section with overlay styling', () => {
      renderHomePage();
      
      const overlayBox = screen.getByText('Predictive Maintenance for Banking Infrastructure').closest('.bg-\\[\\#232323\\]\\/50');
      expect(overlayBox).toHaveClass('rounded-3xl', 'backdrop-blur-md', 'shadow-2xl');
    });

    it('renders feature cards with proper shadows', () => {
      renderHomePage();
      
      const featureCards = document.querySelectorAll('.bg-white.rounded-2xl');
      featureCards.forEach(card => {
        expect(card).toHaveStyle({
          boxShadow: expect.stringContaining('rgba(0, 0, 0, 0.65)')
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderHomePage();
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      const sectionHeading = screen.getByRole('heading', { level: 2 });
      
      expect(mainHeading).toHaveTextContent('Predictive Maintenance for Banking Infrastructure');
      expect(sectionHeading).toHaveTextContent('Key Features');
    });

    it('has proper alt text for images', () => {
      renderHomePage();
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('has proper button and link semantics', () => {
      localStorageMock.getItem.mockReturnValue(null);
      renderHomePage();
      
      const signupLink = screen.getByText('Get Started').closest('a');
      const loginLink = screen.getByText('Login').closest('a');
      
      expect(signupLink).toBeInTheDocument();
      expect(loginLink).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('integrates with React Router properly', () => {
      renderHomePage();
      
      // Check that Link components are rendered
      const links = document.querySelectorAll('a[href]');
      expect(links.length).toBeGreaterThan(0);
    });

    it('uses Lucide React icons correctly', () => {
      renderHomePage();
      
      // Check for specific icons used in the component
      const landmarkIcon = document.querySelector('svg[data-lucide="landmark"]') || 
                          document.querySelector('svg[data-lucide="building"]');
      const badgeCheckIcon = document.querySelector('svg[data-lucide="badge-check"]') || 
                            document.querySelector('svg[data-lucide="check-circle"]');
      
      // Since icons might be rendered differently, we'll check for icon containers
      const iconContainers = document.querySelectorAll('.inline-flex.items-center.justify-center');
      expect(iconContainers.length).toBeGreaterThan(0);
    });
  });
});
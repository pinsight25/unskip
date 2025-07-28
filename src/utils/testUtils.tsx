// Test utilities and mock data for comprehensive testing

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/contexts/UserContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import { OfferProvider } from '@/contexts/OfferContext';
import { CityProvider } from '@/contexts/CityContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Mock data for testing
export const mockUser = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+91 98765 43210',
  userType: 'individual' as const,
  is_verified: true,
  dealer_registration_completed: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockDealerUser = {
  ...mockUser,
  id: 'test-dealer-id',
  name: 'Test Dealer',
  userType: 'dealer' as const,
  dealer_registration_completed: true
};

export const mockCar = {
  id: 'test-car-id',
  title: 'Test Car',
  price: 500000,
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  seller_id: 'test-user-id',
  status: 'active' as const,
  fuel_type: 'petrol',
  transmission: 'automatic',
  kilometers_driven: 50000,
  number_of_owners: 1,
  area: 'Chennai',
  city: 'Chennai',
  color: 'White',
  variant: 'XLE',
  description: 'Well maintained car in excellent condition',
  featured: false,
  verified: true,
  views: 100,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  car_images: [
    {
      id: 'image-1',
      image_url: 'https://example.com/car1.jpg',
      is_cover: true,
      sort_order: 1
    }
  ]
};

export const mockDealer = {
  id: 'test-dealer-id',
  user_id: 'test-dealer-id',
  slug: 'test-dealer',
  business_name: 'Test Dealer',
  contact_person: 'John Doe',
  business_category: 'Automotive',
  brands_deal_with: ['Toyota', 'Honda', 'BMW'],
  specialization: 'Luxury Cars',
  shop_address: '123 Test Street, Chennai',
  pincode: '600001',
  establishment_year: 2010,
  verification_status: 'verified' as const,
  total_sales: 50,
  member_since: '2020-01-01',
  created_at: '2020-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  shop_photos_urls: ['https://example.com/shop1.jpg'],
  carsInStock: 10,
  accessoriesInStock: 5
};

export const mockAccessory = {
  id: 'test-accessory-id',
  name: 'Test Accessory',
  brand: 'Test Brand',
  category: 'Wheels',
  condition: 'excellent',
  description: 'High quality accessory',
  price_min: 5000,
  price_max: 8000,
  location: 'Chennai',
  phone: '+91 98765 43210',
  email: 'test@example.com',
  seller_id: 'test-user-id',
  status: 'active' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  images: ['https://example.com/accessory1.jpg']
};

export const mockOffer = {
  id: 'test-offer-id',
  car_id: 'test-car-id',
  buyer_id: 'test-user-id',
  seller_id: 'test-dealer-id',
  amount: 480000,
  message: 'I am interested in this car',
  status: 'pending' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockChat = {
  id: 'test-chat-id',
  car_id: 'test-car-id',
  buyer_id: 'test-user-id',
  seller_id: 'test-dealer-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  last_message: {
    id: 'message-1',
    content: 'Hello, I am interested in your car',
    sender_id: 'test-user-id',
    created_at: '2024-01-01T00:00:00Z'
  }
};

export const mockMessage = {
  id: 'message-1',
  chat_id: 'test-chat-id',
  sender_id: 'test-user-id',
  receiver_id: 'test-dealer-id',
  content: 'Hello, I am interested in your car',
  is_read: false,
  created_at: '2024-01-01T00:00:00Z'
};

export const mockNotification = {
  id: 'test-notification-id',
  user_id: 'test-user-id',
  type: 'offer_received' as const,
  title: 'New Offer Received',
  message: 'You have received a new offer for your car',
  data: { car_id: 'test-car-id', offer_id: 'test-offer-id' },
  is_read: false,
  created_at: '2024-01-01T00:00:00Z'
};

// Test wrapper with all providers
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <AuthModalProvider>
            <OfferProvider>
              <CityProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </CityProvider>
            </OfferProvider>
          </AuthModalProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function with providers
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return render(ui, { wrapper: TestWrapper, ...options });
};

// Test utilities
export const testUtils = {
  // Wait for element to be in document
  waitForElement: async (testId: string) => {
    return await waitFor(() => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  },

  // Wait for element to disappear
  waitForElementToDisappear: async (testId: string) => {
    return await waitFor(() => {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
    });
  },

  // Click element by test ID
  clickByTestId: (testId: string) => {
    fireEvent.click(screen.getByTestId(testId));
  },

  // Type in input by test ID
  typeByTestId: (testId: string, value: string) => {
    fireEvent.change(screen.getByTestId(testId), { target: { value } });
  },

  // Submit form by test ID
  submitForm: (testId: string) => {
    fireEvent.submit(screen.getByTestId(testId));
  },

  // Select option from dropdown
  selectOption: (selectTestId: string, optionValue: string) => {
    const select = screen.getByTestId(selectTestId);
    fireEvent.change(select, { target: { value: optionValue } });
  },

  // Check if element has text
  hasText: (testId: string, text: string) => {
    expect(screen.getByTestId(testId)).toHaveTextContent(text);
  },

  // Check if element is visible
  isVisible: (testId: string) => {
    expect(screen.getByTestId(testId)).toBeVisible();
  },

  // Check if element is not visible
  isNotVisible: (testId: string) => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  },

  // Mock API responses
  mockApiResponse: (data: any, delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  },

  // Mock API error
  mockApiError: (error: string, delay = 0) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(error)), delay);
    });
  }
};

// Performance testing utilities
export const performanceUtils = {
  // Measure render time
  measureRenderTime: (component: React.ReactElement) => {
    const start = performance.now();
    renderWithProviders(component);
    const end = performance.now();
    return end - start;
  },

  // Measure component update time
  measureUpdateTime: (component: React.ReactElement, updateFn: () => void) => {
    const { rerender } = renderWithProviders(component);
    const start = performance.now();
    updateFn();
    rerender(component);
    const end = performance.now();
    return end - start;
  },

  // Check if render time is acceptable
  isRenderTimeAcceptable: (renderTime: number, threshold = 100) => {
    return renderTime < threshold;
  }
};

// Accessibility testing utilities
export const accessibilityUtils = {
  // Check if element has proper ARIA label
  hasAriaLabel: (testId: string, expectedLabel: string) => {
    const element = screen.getByTestId(testId);
    expect(element).toHaveAttribute('aria-label', expectedLabel);
  },

  // Check if element is focusable
  isFocusable: (testId: string) => {
    const element = screen.getByTestId(testId);
    element.focus();
    expect(element).toHaveFocus();
  },

  // Check if element has proper role
  hasRole: (testId: string, expectedRole: string) => {
    const element = screen.getByTestId(testId);
    expect(element).toHaveAttribute('role', expectedRole);
  },

  // Check keyboard navigation
  testKeyboardNavigation: (elements: string[]) => {
    elements.forEach((testId, index) => {
      const element = screen.getByTestId(testId);
      element.focus();
      expect(element).toHaveFocus();
      
      if (index < elements.length - 1) {
        fireEvent.keyDown(element, { key: 'Tab' });
        const nextElement = screen.getByTestId(elements[index + 1]);
        expect(nextElement).toHaveFocus();
      }
    });
  }
};

// Mock functions for testing
export const mockFunctions = {
  // Mock navigation
  mockNavigate: jest.fn(),
  
  // Mock toast
  mockToast: jest.fn(),
  
  // Mock API calls
  mockApiCall: jest.fn(),
  
  // Mock localStorage
  mockLocalStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  
  // Mock sessionStorage
  mockSessionStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
};

// Setup mock functions
export const setupMocks = () => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockFunctions.mockLocalStorage,
    writable: true
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: mockFunctions.mockSessionStorage,
    writable: true
  });

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Clean up after tests
export const cleanupMocks = () => {
  jest.clearAllMocks();
  jest.clearAllTimers();
}; 
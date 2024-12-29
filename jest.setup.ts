/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(() => null),
  [Symbol.iterator]: jest.fn(),
};

// Extend localStorage mock with Jest's mock functions
const mockGetItem = localStorageMock.getItem as jest.Mock;
Object.assign(mockGetItem, {
  mockReturnValueOnce: jest.fn().mockReturnThis(),
});

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
const locationMock = new URL('http://localhost');
Object.defineProperty(window, 'location', {
  value: locationMock,
  writable: true,
}); 
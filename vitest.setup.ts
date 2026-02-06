import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver
import ResizeObserverPolyfill from 'resize-observer-polyfill';

// Check if ResizeObserver is already available (in newer environments)
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = ResizeObserverPolyfill;
}
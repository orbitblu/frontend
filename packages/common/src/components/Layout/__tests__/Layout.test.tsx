import React from 'react';
import { render, screen } from '@testing-library/react';
import { jest, describe, it, expect } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Layout } from '../Layout';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    mode: 'light',
    common: { black: '#000', white: '#fff' },
    background: {
      paper: '#fff',
      default: '#fff',
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 300,
      fontSize: '6rem',
      lineHeight: 1.167,
      letterSpacing: '-0.01562em',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: (factor: number) => factor * 8,
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          boxSizing: 'border-box',
          WebkitTextSizeAdjust: '100%',
        },
        '*, *::before, *::after': {
          boxSizing: 'inherit',
        },
        'strong, b': {
          fontWeight: 700,
        },
        body: {
          margin: 0,
          color: 'rgba(0, 0, 0, 0.87)',
          lineHeight: 1.5,
          backgroundColor: '#fff',
        },
      },
    },
  },
});

describe('Layout', () => {
  it('should render children', () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </ThemeProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide theme context', () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout>
          <div data-testid="theme-test" style={{ color: '#1976d2' }}>
            Theme Test
          </div>
        </Layout>
      </ThemeProvider>
    );

    const element = screen.getByTestId('theme-test');
    expect(window.getComputedStyle(element).color).toBe('rgb(25, 118, 210)');
  });

  it('should render with proper structure', () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout>
          <div>Content</div>
        </Layout>
      </ThemeProvider>
    );

    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toContainHTML('<div>Content</div>');
  });

  it('should apply CssBaseline', () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout>
          <div>Content</div>
        </Layout>
      </ThemeProvider>
    );

    const body = document.body;
    const computedStyle = window.getComputedStyle(body);

    expect(computedStyle.margin).toBe('0px');
    expect(computedStyle.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(computedStyle.lineHeight).toBe('1.5');
  });
}); 
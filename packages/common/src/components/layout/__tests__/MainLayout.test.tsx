import React from 'react';
import { render, screen } from '@testing-library/react';
import { jest, describe, it, expect } from '@jest/globals';
import { MainLayout } from '../MainLayout';

describe('MainLayout', () => {
  it('renders children content', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    render(
      <MainLayout header={<div>Header Content</div>}>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders sidebar when provided', () => {
    render(
      <MainLayout sidebar={<div>Sidebar Content</div>}>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <MainLayout footer={<div>Footer Content</div>}>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <MainLayout isLoading>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Loading...');
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('applies correct ARIA attributes when loading', () => {
    render(
      <MainLayout isLoading>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('main').parentElement?.parentElement).toHaveAttribute('aria-busy', 'true');
  });

  it('renders main content with correct role', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
}); 
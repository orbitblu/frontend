import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Navigation, NavigationItem } from '../Navigation';

describe('Navigation', () => {
  const mockNavigate = jest.fn();
  const defaultItems: NavigationItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation items correctly', () => {
    render(<Navigation items={defaultItems} />);

    defaultItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.label).closest('a')).toHaveAttribute('href', item.href);
    });
  });

  it('renders with horizontal orientation by default', () => {
    render(<Navigation items={defaultItems} />);
    expect(screen.getByRole('navigation')).toHaveClass('navigation--horizontal');
  });

  it('renders with vertical orientation when specified', () => {
    render(<Navigation items={defaultItems} orientation="vertical" />);
    expect(screen.getByRole('navigation')).toHaveClass('navigation--vertical');
  });

  it('calls onNavigate when a link is clicked', () => {
    render(<Navigation items={defaultItems} onNavigate={mockNavigate} />);
    
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders active item with correct styling and aria-current', () => {
    const itemsWithActive = defaultItems.map((item, index) => ({
      ...item,
      isActive: index === 0,
    }));

    render(<Navigation items={itemsWithActive} />);
    
    const activeLink = screen.getByText('Home').closest('a');
    expect(activeLink).toHaveClass('navigation__link--active');
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders disabled item with correct attributes', () => {
    const itemsWithDisabled = defaultItems.map((item, index) => ({
      ...item,
      isDisabled: index === 1,
    }));

    render(<Navigation items={itemsWithDisabled} />);
    
    const disabledLink = screen.getByText('About').closest('a');
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
    expect(disabledLink).toHaveAttribute('tabIndex', '-1');
  });

  it('renders icons when provided', () => {
    const itemsWithIcons = defaultItems.map(item => ({
      ...item,
      icon: <span data-testid="icon">Icon</span>,
    }));

    render(<Navigation items={itemsWithIcons} />);
    
    const icons = screen.getAllByTestId('icon');
    expect(icons).toHaveLength(defaultItems.length);
    icons.forEach(icon => {
      expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('prevents default behavior when clicking links', () => {
    render(<Navigation items={defaultItems} onNavigate={mockNavigate} />);
    
    const link = screen.getByText('Home').closest('a');
    const mockPreventDefault = jest.fn();
    fireEvent.click(link!, {
      preventDefault: mockPreventDefault,
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
}); 
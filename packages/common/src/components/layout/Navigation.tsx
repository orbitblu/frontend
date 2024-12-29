import React from 'react';
import './layout.css';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: (href: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  orientation = 'horizontal',
  onNavigate,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate?.(href);
  };

  return (
    <nav className={`navigation navigation--${orientation}`} role="navigation">
      <ul className="navigation__list">
        {items.map((item, index) => (
          <li key={index} className="navigation__item">
            <a
              href={item.href}
              className={`navigation__link ${item.isActive ? 'navigation__link--active' : ''}`}
              onClick={(e) => handleClick(e, item.href)}
              aria-current={item.isActive ? 'page' : undefined}
              aria-disabled={item.isDisabled}
              tabIndex={item.isDisabled ? -1 : 0}
            >
              {item.icon && (
                <span className="navigation__icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="navigation__label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}; 
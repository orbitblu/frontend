import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './layout.css';

interface HeaderProps {
  title?: string;
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Blu AI',
  logo,
  navigation,
  actions,
}) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header" role="banner">
      <div className="header__brand">
        {logo && <div className="header__logo">{logo}</div>}
        <h1 className="header__title">{title}</h1>
      </div>
      
      {navigation && (
        <nav className="header__nav" role="navigation">
          {navigation}
        </nav>
      )}
      
      <div className="header__actions">
        {actions}
        {isAuthenticated && (
          <button
            onClick={logout}
            className="header__logout"
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}; 
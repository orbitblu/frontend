import React from 'react';
import './layout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header,
  sidebar,
  footer,
  isLoading = false,
}) => {
  return (
    <div className="main-layout" aria-busy={isLoading}>
      {header && <header className="main-layout__header">{header}</header>}
      <div className="main-layout__content">
        {sidebar && <aside className="main-layout__sidebar">{sidebar}</aside>}
        <main className="main-layout__main" role="main">
          {isLoading ? (
            <div className="main-layout__loading" role="alert" aria-live="polite">
              Loading...
            </div>
          ) : (
            children
          )}
        </main>
      </div>
      {footer && <footer className="main-layout__footer">{footer}</footer>}
    </div>
  );
}; 
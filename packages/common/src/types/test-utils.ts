import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Define proper types for test utilities
export type RenderResult = ReturnType<typeof render>;

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Record<string, unknown>;
  route?: string;
}

export interface WrapperProps {
  children: React.ReactNode;
  initialState?: Record<string, unknown>;
}

export interface TestContextProps {
  children: React.ReactNode;
  initialState?: Record<string, unknown>;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { initialState: _initialState, ...renderOptions } = options;

  function Wrapper({ children }: WrapperProps): ReactElement {
    return React.createElement(React.Fragment, null, children);
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export function createTestContext(props: TestContextProps): ReactElement {
  const { children, initialState: _initialState } = props;
  return React.createElement(React.Fragment, null, children);
}

export * from '@testing-library/react'; 
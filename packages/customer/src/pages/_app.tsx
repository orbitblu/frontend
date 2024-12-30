import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from '@orbitblu/common/contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@orbitblu/common/styles/theme';
import { useRouter } from 'next/router';
import type { NextComponentType, NextPageContext } from 'next';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

interface CustomerPageProps {
  requireAuth?: boolean;
}

type CustomerAppProps = AppProps & {
  Component: NextComponentType<NextPageContext, unknown, CustomerPageProps>;
};

function AppContent({ Component, pageProps }: CustomerAppProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role === 'admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default function App(props: CustomerAppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </QueryClientProvider>
  );
} 
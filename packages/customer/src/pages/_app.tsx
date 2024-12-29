import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from '@orbitblu/common/contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@orbitblu/common/styles/theme';
import { useRouter } from 'next/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function AppContent({ Component, pageProps }: AppProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const AnyComponent = Component as any;

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
      <AnyComponent {...pageProps} />
    </ThemeProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </QueryClientProvider>
  );
} 
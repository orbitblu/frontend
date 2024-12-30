import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@orbitblu/common/contexts/AuthContext';
import { ProtectedRoute } from '@orbitblu/common/components/ProtectedRoute';
import { Layout } from '@orbitblu/common/components/Layout';

function AdminApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ProtectedRoute requiredRole="admin">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default AdminApp; 
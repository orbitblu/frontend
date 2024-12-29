import React from 'react';
import { Layout } from '@orbitblu/common/src/components/Layout';
import { Typography, Box } from '@mui/material';

export default function CustomerHome() {
  return (
    <Layout>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to OrbitBlu
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your AI-powered business solutions
        </Typography>
      </Box>
    </Layout>
  );
} 
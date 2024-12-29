import React from 'react';
import { Layout } from '@orbitblu/common/src/components/Layout';
import { Typography, Box } from '@mui/material';

export default function AdminHome() {
  return (
    <Layout>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          OrbitBlu Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome to the admin interface
        </Typography>
      </Box>
    </Layout>
  );
} 
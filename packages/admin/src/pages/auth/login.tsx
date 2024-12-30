import React from 'react';
import { LoginForm } from '@orbitblu/common/src/components/forms/LoginForm';
import { Box, Container, Typography } from '@mui/material';

export default function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
} 
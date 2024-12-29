import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../../styles/theme';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
}; 
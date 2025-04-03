import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Box, Container, useTheme } from '@mui/material';

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery({ maxWidth: 600 });
  const isTablet = useMediaQuery({ minWidth: 601, maxWidth: 960 });
  const isDesktop = useMediaQuery({ minWidth: 961 });

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.default
    }}>
      <Container 
        maxWidth={isDesktop ? 'lg' : isTablet ? 'md' : 'sm'}
        sx={{
          px: isMobile ? 2 : 3,
          py: isMobile ? 2 : 3,
          flex: 1
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default ResponsiveLayout; 
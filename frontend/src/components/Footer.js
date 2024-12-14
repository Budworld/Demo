// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        textAlign: 'center',
        padding: '10px 15x',
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body2">© 2024 AIRPLANE. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;

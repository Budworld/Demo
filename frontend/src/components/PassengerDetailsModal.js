import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const PassengerDetailsModal = ({ passenger, onClose }) => (
  <Modal open={!!passenger} onClose={onClose}>
    <Box sx={{ width: 400, padding: 2, margin: 'auto', mt: 10, backgroundColor: 'white', borderRadius: 2 }}>
      <Typography variant="h6">Chi Tiết Hành Khách</Typography>
      {passenger && (
        <Box>
          <Typography>Mã: {passenger.PassengerID}</Typography>
          <Typography>Tên: {passenger.FullName}</Typography>
          <Typography>Email: {passenger.Email}</Typography>
          <Typography>CCCD: {passenger.CCCD}</Typography>
        </Box>
      )}
      <Button onClick={onClose}>Đóng</Button>
    </Box>
  </Modal>
);

export default PassengerDetailsModal;

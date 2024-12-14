// src/components/Header.js
import React, {useState} from 'react';
import { AppBar, Toolbar, Typography, Avatar, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Icon hình ba thanh ngang
import Sidebar from './Sidebar';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Quản lý trạng thái mở/đóng Sidebar

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Đảo ngược trạng thái mở/đóng Sidebar
  };

  return (
    <>
    <AppBar position="sticky" sx={{  background: 'linear-gradient(to right, #90caf9, #64b5f6)', color: '#1b5e20', }}>
      <Toolbar>
          {/* Nút menu */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            AIRPLANE'S STAFF
          </Typography>
           {/* Phần thông tin người dùng */}
           {/* <Box sx={{ display: 'flex', alignItems: 'center' }}> */}

            {/* Ảnh đại diện
            <Avatar alt= src= />
            
            
            {/* Tên người dùng và chức vụ */}
            {/* <Typography variant="body1" style={{ marginLeft: '10px' }}>
              {StaffInfo.StaffName} - {StaffInfo.Position}
            </Typography> */}
            

          {/* </Box> */}
        </Toolbar>
    </AppBar>

    <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}/>
    </>
  );
};

export default Header;

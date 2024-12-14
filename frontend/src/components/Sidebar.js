import React, {useState} from 'react';
import {Drawer, List, ListItem, ListItemText, Divider, IconButton,Avatar,Typography,Collapse, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Icon để đóng Sidebar
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';  // Dùng Link của react-router-dom 
import {styled} from '@mui/system';

const CustomListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: '#444444', // Nền tối cho các ListItem
  color: 'white', // Màu chữ sáng để dễ đọc trên nền tối
  '&:hover': {
    background: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
    color: '#5d4037',
  },
  display: 'flex',
  marginRight: '50px',
  // marginBottom: '10px',
  // borderRadius: '10px',
  alignItems: 'center',
}));


const Sidebar = ({ open, toggleSidebar }) => {

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false); // Dropdown trạng thái

  const toggleAccountDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen); // Đóng/mở dropdown
  };
    const handleLogout = () => {
      alert("Đăng xuất");
      console.log('Đăng xuất');
    
  };

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
      
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#333333', // Thay đổi màu nền của Sidebar
          color: '#ffffff', // Màu chữ sáng để dễ đọc trên nền tối
        },
      }}
      variant="temporary" // Temporary để dễ đóng/mở trên các thiết bị
      anchor="left"
      open={open}
      onClose={toggleSidebar} // Đóng Sidebar khi bấm ngoài vùng Drawer
    >
      <div style={{ width: '240px' }}>
        {/* Nút đóng Sidebar */}
        <IconButton onClick={toggleSidebar} style={{ margin: '8px' }}>
          <CloseIcon />
        </IconButton>
      {/* Phần trên: Avatar hoặc Logo */}
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <Avatar
          alt="User Avatar"
          src="https://via.placeholder.com/100"
          sx={{ width: 80, height: 80, margin: '0 auto' }}
        />
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          John Doe
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Admin
        </Typography>
      </div>
      <Divider />

      </div>
      {/* Danh sách các mục */}
      <List>
        {/* Xem thông tin cá nhân */}
        <CustomListItem button component={Link} to='/personal-info'>
          <ListItemText primary="Xem thông tin cá nhân" />
        </CustomListItem>

        {/* Quản lý thông tin hành khách */}
        <CustomListItem button component={Link} to='/manage-passenger-info'>
          <ListItemText primary="Quản lý thông tin hành khách" />
        </CustomListItem>

        {/* Quản lý hóa đơn */}
        <CustomListItem button component={Link} to='/manage-bills'>
          <ListItemText primary="Quản lý hóa đơn" />
        </CustomListItem>

        {/* Dropdown Quản lý Account */}
        <CustomListItem button onClick={toggleAccountDropdown}>
          <ListItemText primary="Quản lý Account" />
          {accountDropdownOpen ? <ExpandLess /> : <ExpandMore />}
        </CustomListItem>
        
        <Collapse in={accountDropdownOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <CustomListItem button component={Link} to='/manage-staff' sx={{ pl: 4 }}>
              <ListItemText primary="Nhân viên" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-customer' sx={{ pl: 4 }}>
              <ListItemText primary="Khách hàng" />
            </CustomListItem>
          </List>
        </Collapse>
      </List>

      <Divider />
     {/* Nút Đăng Xuất */}
     <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 2, 
      }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            width: '80%', // Chiều rộng nút
            height: '56px', // Chiều cao nút
            fontSize: '16px', // Tăng kích thước chữ
            fontWeight: 'bold',
            borderRadius: '12px', // Bo tròn nút
          }}
        >
          Đăng Xuất
        </Button>
      </Box>

    </Drawer>
  );
};

export default Sidebar;

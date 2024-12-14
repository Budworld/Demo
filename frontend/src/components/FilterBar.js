import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    name: '',
    passengerId: '',
    flightNumber: '',
    idCard: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField label="Tên" name="name" onChange={handleChange} />
      <TextField label="Mã Hành Khách" name="passengerId" onChange={handleChange} />
      <TextField label="Số Hiệu Chuyến Bay" name="flightNumber" onChange={handleChange} />
      <TextField label="CCCD" name="idCard" onChange={handleChange} />
      <Button variant="contained" onClick={applyFilters}>
        Áp Dụng
      </Button>
    </Box>
    
  );
};

export default FilterBar;

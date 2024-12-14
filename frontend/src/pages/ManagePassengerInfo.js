import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box,
  Typography,
  Divider,
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';

import { AccountCircle, Email, Phone, Cake, Badge, CalendarToday, Male, Female, Transgender } from "@mui/icons-material";
import { StyledBox, StyledTypography, StyledPaper } from '../components/StyledComponents';
import PassengerInfoDetailsModel from '../models/PassengerInfoDetailsModel';
import { Style } from '@mui/icons-material';

const ManagePassengerInfo = () => {
  const [passengers, setPassengers] = useState([]);
  const [filters, setFilters] = useState({
    FullName: '',
    PassengerID: '',
    FlightNumber: '',
    CCCD: ''
  });
  const [loading, setLoading] = useState(true);
  const [passengerDetails, setPassengerDetails] = useState(PassengerInfoDetailsModel);
  const [modalOpen, setModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const passengersPerPage = 10;

  // Fetch passengers from backend
  const fetchPassengers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/passengers');
      setPassengers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hành khách:', error);
      setLoading(false);
    }
  };

  // Filter passengers based on filters
  const filterPassengers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/passengers/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      // if (!response.ok) throw new Error(HTTP error! status: ${response.status});

      const data = await response.json();
      setPassengers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi lọc danh sách hành khách:', error);
    }
  };

  // Fetch passenger details
  const fetchPassengerDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/passengers/${id}`);
      if (response.data) {
        // console.log(response.data);
        setPassengerDetails({
          ...response.data.PassengerResult,
          Flights: response.data.FlightsResult
        });
        setModalOpen(true);
      } else {
        console.error('Không tìm thấy thông tin hành khách.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết hành khách:', error);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setPassengerDetails(PassengerInfoDetailsModel); // Reset passenger details
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      FullName: '',
      PassengerID: '',
      FlightNumber: '',
      CCCD: ''
    });
  };

  // Pagination handling
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate current passengers for pagination
  const startIdx = (currentPage - 1) * passengersPerPage;
  const endIdx = startIdx + passengersPerPage;
  const currentPassengers = passengers.slice(startIdx, endIdx);

  // Update total pages
  useEffect(() => {
    setTotalPages(Math.ceil(passengers.length / passengersPerPage));
  }, [passengers]);

  // Fetch passengers initially
  useEffect(() => {
    fetchPassengers();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1>Quản lý thông tin hành khách</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="Tên hành khách"
          name="FullName"
          value={filters.FullName}
          onChange={handleFilterChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="ID hành khách"
          name="PassengerID"
          value={filters.PassengerID}
          onChange={handleFilterChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Số hiệu chuyến bay"
          name="FlightNumber"
          value={filters.FlightNumber}
          onChange={handleFilterChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="CCCD"
          name="CCCD"
          value={filters.CCCD}
          onChange={handleFilterChange}
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={filterPassengers}>
          Lọc
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Passenger ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Flight Number</TableCell>
              <TableCell>CCCD</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPassengers.map((passenger) => (
              <TableRow key={passenger.PassengerID}>
                <TableCell>{passenger.PassengerID}</TableCell>
                <TableCell>{passenger.FullName}</TableCell>
                <TableCell>{passenger.FlightNumber}</TableCell>
                <TableCell>{passenger.CCCD}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => fetchPassengerDetails(passenger.PassengerID)}>
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

{passengerDetails && (
  <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
  <DialogTitle variant='h4' sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
    Thông tin chi tiết hành khách
  </DialogTitle>
  <Divider sx={{ borderBottom: '1px solid black', marginBottom: 2 }} />
  <DialogContent>
    <StyledPaper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 1 }}>
        Thông tin cá nhân
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <StyledTypography>
          <AccountCircle sx={{ marginRight: 1 }} /> {passengerDetails.FullName || 'N/A'}
        </StyledTypography>
        <StyledTypography>
          <Badge sx={{ marginRight: 1 }} /> {passengerDetails.CCCD || 'N/A'}
        </StyledTypography>
        <StyledTypography>
          <Email sx={{ marginRight: 1 }} /> {passengerDetails.Email || 'N/A'}
        </StyledTypography>
        <StyledTypography>
          <Phone sx={{ marginRight: 1 }} /> {passengerDetails.Phone || 'N/A'}
        </StyledTypography>
        <StyledTypography>
          {passengerDetails.Gender === 'Male' ? (
            <Male sx={{ marginRight: 1 }} />
          ) : passengerDetails.Gender === 'Female' ? (
            <Female sx={{ marginRight: 1 }} />
          ) : (
            <Transgender sx={{ marginRight: 1 }} />
          )}{' '}
          {passengerDetails.Gender}
        </StyledTypography>
        <StyledTypography>
          <Cake sx={{ marginRight: 1 }} /> {passengerDetails.BirthDate ? new Date(passengerDetails.BirthDate).toLocaleDateString() : 'N/A'}
        </StyledTypography>
      </Box>
    </StyledPaper>

    <StyledPaper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 1 }}>
        Chuyến bay đã thực hiện
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Passenger ID</TableCell>
            <TableCell>Flight Number</TableCell>
            <TableCell>Departure Airport</TableCell>
            <TableCell>Arrival Airport</TableCell>
            <TableCell>Booking Date</TableCell>
            <TableCell>Seat Class</TableCell>
            <TableCell>Price(VNĐ)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {passengerDetails.Flights?.length > 0 ? (
            passengerDetails.Flights.map((flight, index) => (
              <TableRow key={index}>
                <TableCell>{flight.PassengerID}</TableCell>
                <TableCell>{flight.FlightNumber}</TableCell>
                <TableCell>{flight.DepartureAirport}</TableCell>
                <TableCell>{flight.ArrivalAirport}</TableCell>
                <TableCell>{flight.BookingDate ? new Date(flight.BookingDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{flight.SeatClass}</TableCell>
                <TableCell>{flight.Price.toLocaleString('vi-VN')} VNĐ</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Không có chuyến bay nào được đặt
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Divider sx={{ marginY: 2 }} />
      
       <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Tổng số chuyến bay: {passengerDetails.Flights ? passengerDetails.Flights.length : 0}
      </Typography>
      {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
      Tổng số tiền: 
      {(
        passengerDetails.Flights 
        ? passengerDetails.Flights.reduce((acc, flight) => acc + flight.Price, 0) 
        : 0
      ).toLocaleString('vi-VN')} VNĐ
    </Typography> */}
      </Box>
    </StyledPaper>
  </DialogContent>
  <Divider sx={{ borderBottom: '1px solid black', marginBottom: 2 }} />

  <DialogActions>
    <Button onClick={handleCloseModal} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

      )}

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          disabled={currentPage <= 1} 
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Trang trước
        </Button>
        <div>
          Trang {currentPage} / {totalPages}
        </div>
        <Button 
          variant="outlined" 
          disabled={currentPage >= totalPages} 
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
};

export default ManagePassengerInfo;

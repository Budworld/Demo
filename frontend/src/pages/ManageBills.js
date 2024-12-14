import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Paper,
  Tooltip,
  IconButton,
  Box,
  Typography,
  Divider,
  Button, 
  TextField, 
  Table, 
  TableContainer,
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// import { AccountCircle, Email, Phone, Cake, Badge, CalendarToday, Male, Female, Transgender } from "@mui/icons-material";
// import { StyledBox, StyledTypography, StyledPaper } from '../components/StyledComponents';
import InvoiceDetailsModels from '../models/InvoiceDetailsModel';
import { Style } from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const ManageInvoiceInfo = () => {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({


    FlightNumber: '',
    InvoiceID: '',
    InvoiceDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [invoiceDetails, setInvoiceDetails] = useState(InvoiceDetailsModels);
  const [modalOpen, setModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const invoicesPerPage = 10;

  // Fetch passengers from backend
  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/invoices');
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hóa đơn:', error);
      setLoading(false);
    }
  };

  // Filter passengers based on filters
  const filterInvoices = async () => {

    try {
      const response = await fetch('http://localhost:4000/api/invoices/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      // if (!response.ok) throw new Error(HTTP error! status: ${response.status});

      const data = await response.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi lọc danh sách hóa đơn:', error);
    }
  };

  // Fetch passenger details
  const fetchInvoiceDetails = async (id) => {
    setModalOpen(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/invoices/${id}`);
      if (response.data) {
        // console.log(response.data);
        setInvoiceDetails({
          ...response.data.InfoResult,
          InvoiceDetails: response.data.InvoiceDetailsResult
        });
        
      } else {
        console.error('Không tìm thấy thông tin hóa đơn.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết hóa đơn:', error);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setInvoiceDetails(InvoiceDetailsModels); // Reset passenger details
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      FlightNumber: '',
      InvoiceID: '',
      InvoiceDate: null,
    });
  };

  // Pagination handling
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate current passengers for pagination
  const startIdx = (currentPage - 1) * invoicesPerPage;
  const endIdx = startIdx + invoicesPerPage;
  const currentInvoices = invoices.slice(startIdx, endIdx);

  // Update total pages
  useEffect(() => {
    setTotalPages(Math.ceil(invoices.length / invoicesPerPage));
  }, [invoices]);

  // Fetch passengers initially
  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1>Quản lý hóa đơn</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>


        <TextField
          label="Mã hóa đơn"
          name="InvoiceID"
          value={filters.InvoiceID}
          onChange={handleFilterChange}
          variant="outlined"
        />

        <TextField
          label="Số hiệu chuyến bay"
          name="FlightNumber"
          value={filters.FlightNumber}
          onChange={handleFilterChange}
          variant="outlined"
        />

<LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 300 }}>
        <Tooltip title="Ngày tạo hóa đơn" arrow sx={{marginLeft: '10px'}}>
          <IconButton>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <DatePicker
          views={['day', 'month', 'year']}
          value={filters.InvoiceDate}
          onChange={(newValue) => {
            console.log("Date: ", newValue); 
            setFilters({ ...filters, InvoiceDate: newValue })
          }}
          renderInput={(params) => <TextField {...params} />}
        />

      </Box>
    </LocalizationProvider>

        <Button variant="contained" color="primary" onClick={filterInvoices}>
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
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Flight Number</TableCell>
              <TableCell>Số lượng vé</TableCell>
              <TableCell>Tổng tiền (VNĐ)</TableCell>
              <TableCell>Ngày tạo hóa đơn</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentInvoices.map((invoice) => (
              <TableRow key={invoice.InvoiceID}>
                <TableCell>{invoice.InvoiceID}</TableCell>
                <TableCell>{invoice.FlightNumber}</TableCell>
                <TableCell>{invoice.TicketCount}</TableCell>
                <TableCell>{invoice.TotalAmount.toLocaleString("vi-VN")} VNĐ</TableCell>
                <TableCell> {invoice.InvoiceDate ? new Date(invoice.InvoiceDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => fetchInvoiceDetails(invoice.InvoiceID)}>
                    Xem chi tiết hóa đơn
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

{invoiceDetails && (
  <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
  <DialogTitle
    variant="h4"
    sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', color: 'primary.main' }}
  >
    Thông tin chi tiết hóa đơn
  </DialogTitle>
  <Divider sx={{ borderBottom: '2px solid', mb: 2 }} />

  <DialogContent>
    <Paper elevation={3} sx={{ padding: 3, mb: 2 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 1 }}>
          Airplane
        </Typography>
        <Typography variant="body1" align="center">
          Mã số thuế: <strong>123456789</strong>
        </Typography>
        <Typography variant="body1" align="center">
          Số điện thoại: <strong>(123) 456-7890</strong>
        </Typography>
        <Typography variant="body1" align="center">
          Hotline: <strong>1800-123-456</strong>
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Số hiệu chuyến bay: <span style={{ color: 'primary.main' }}>{invoiceDetails.FlightNumber}</span>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Hãng hàng không: {invoiceDetails.Airline}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Loại máy bay: {invoiceDetails.Model}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Khởi hành: <strong>{invoiceDetails.Departure}</strong> &rarr; Điểm đến: <strong>{invoiceDetails.Arrival}</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thời gian cất cánh dự kiến: <strong>{new Date(invoiceDetails.DepartureTime).toLocaleString()}</strong> (UTC+7.00)
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thời gian hạ cánh dự kiến: <strong>{new Date(invoiceDetails.ArrivalTime).toLocaleString()}</strong> (UTC+7.00)
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Mã vé</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Hạng vé</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Giá vé (VNĐ)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceDetails.InvoiceDetails?.length > 0 ? (
              invoiceDetails.InvoiceDetails.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{invoice.TicketID}</TableCell>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="center">{invoice.SeatClass}</TableCell>
                  <TableCell align="center">{invoice.TicketPrice.toLocaleString('vi-VN')} VNĐ</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: 'gray.500' }}>
                  Không có chuyến bay nào được đặt
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Tổng số lượng: {invoiceDetails.TicketCount}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
          Tổng tiền: {invoiceDetails.TotalAmount.toLocaleString('vi-VN')} VNĐ
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="body1" gutterBottom>
          Mã hóa đơn: <strong>{invoiceDetails.InvoiceID}</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Ngày tạo hóa đơn: <strong>{new Date(invoiceDetails.InvoiceDate).toLocaleString()}</strong> (UTC+7.00)
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
        </Typography>
      </Box>
    </Paper>
  </DialogContent>

  <Divider sx={{ borderBottom: '2px solid', mb: 2 }} />

  <DialogActions>
    <Button onClick={handleCloseModal} variant="contained" color="primary">
      Đóng
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

export default ManageInvoiceInfo;

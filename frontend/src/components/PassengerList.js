import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Pagination, Button } from '@mui/material';
import FilterBar from '../components/FilterBar'; // Bộ lọc
import PassengerDetailsModal from '../components/PassengerDetailsModal'; // Modal xem chi tiết hành khách

const PassengerList = () => {
  const [passengers, setPassengers] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [selectedPassenger, setSelectedPassenger] = useState(null);

  useEffect(() => {
    // Gửi yêu cầu API lấy danh sách hành khách
    const fetchPassengers = async () => {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...filters, // Các bộ lọc
      });

      const response = await fetch(`/api/passengers?${params.toString()}`);
      const data = await response.json();
      setPassengers(data);
    };
    fetchPassengers();
  }, [page, filters]); // Gửi yêu cầu khi page hoặc filters thay đổi

  return (
    <>
      <FilterBar onFilterChange={setFilters} /> {/* Bộ lọc tìm kiếm */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell>Mã Hành Khách</TableCell>
            <TableCell>Số Hiệu Chuyến Bay</TableCell>
            <TableCell>Căn Cước Công Dân</TableCell>
            <TableCell>Hành Động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {passengers.map((passenger) => (
            <TableRow key={passenger.PassengerID}>
              <TableCell>{passenger.FullName}</TableCell>
              <TableCell>{passenger.PassengerID}</TableCell>
              <TableCell>{passenger.FlightNumber}</TableCell>
              <TableCell>{passenger.CCCD}</TableCell>
              <TableCell>
                <Button onClick={() => setSelectedPassenger(passenger)}>Chi Tiết</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination count={5} page={page} onChange={(e, value) => setPage(value)} />
      {selectedPassenger && (
        <PassengerDetailsModal
          passenger={selectedPassenger}
          onClose={() => setSelectedPassenger(null)}
        />
      )}
    </>
  );
};

export default PassengerList;

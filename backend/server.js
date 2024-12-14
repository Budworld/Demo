const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 4000; // Thay đổi cổng từ 3001 sang 4000

// Middleware
app.use(cors());
app.use(express.json());

// Cấu hình kết nối SQL Server
const config = {
  user: 'sa',
  password: 'AAaa@@11',
  server: 'localhost',
  database: 'NMCNPM_Test',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Kết nối tới SQL Server
sql.connect(config).then(pool => {
  console.log('Đã kết nối tới SQL Server');

  // Endpoint để lấy dữ liệu từ employees
  app.get('/api/employees', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM employees');
      res.json(result.recordset);
    } catch (err) {
      console.error('Lỗi truy vấn:', err);
      res.status(500).send('Lỗi server');
    }
  });
}).catch(err => {
  console.error('Lỗi kết nối SQL Server:', err);
});
app.use(express.json()); // Để parse JSON trong body của request

// PUT API để cập nhật thông tin nhân viên
// PUT API để cập nhật thông tin nhân viên
app.put('/api/employees/:id', async (req, res) => {
    const { id } = req.params;  // Lấy id từ URL
    const { name, email, phone, startDate, status, gender, birthDate, address, position, idNumber, department, flightsHandled, revenueGenerated } = req.body;
  
    try {
      // Kết nối với SQL Server
      const pool = await sql.connect(config);
      
      // Truy vấn SQL để cập nhật thông tin nhân viên
      const result = await pool.request()
        .input('id', sql.NVarChar, id)  // id từ URL
        .input('name', sql.NVarChar, name)
        .input('email', sql.NVarChar, email)
        .input('phone', sql.NVarChar, phone)
        .input('startDate', sql.Date, startDate)
        .input('status', sql.NVarChar, status)
        .input('gender', sql.NVarChar, gender)
        .input('birthDate', sql.Date, birthDate)
        .input('address', sql.NVarChar, address)
        .input('position', sql.NVarChar, position)
        .input('idNumber', sql.NVarChar, idNumber)
        .input('department', sql.NVarChar, department)
        .input('flightsHandled', sql.Int, flightsHandled)
        .input('revenueGenerated', sql.NVarChar, revenueGenerated)
        .query(`
          UPDATE employees
          SET name = @name,
              email = @email,
              phone = @phone,
              startDate = @startDate,
              status = @status,
              gender = @gender,
              birthDate = @birthDate,
              address = @address,
              position = @position,
              idNumber = @idNumber,
              department = @department,
              flightsHandled = @flightsHandled,
              revenueGenerated = @revenueGenerated
          WHERE id = @id
        `);
  
      // Kiểm tra xem có bản ghi nào được cập nhật không
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Trả về kết quả thành công
      res.status(200).json({ message: 'Employee data updated successfully' });
    } catch (error) {
      console.error('Error updating employee data:', error);
      res.status(500).json({ message: 'Error updating employee data' });
    }
  });
  
// 1. Lấy tất cả hành khách với thông tin cơ bản
app.get('/api/passengers', async (req, res) => {
  try {
      const query = `
          SELECT 
              pa_i.PassengerID, 
              pe_i.FullName, 
              t.FlightNumber, 
              pa_i.CCCD
          FROM 
              PassengerInfo pa_i
          JOIN 
              PersonInfo pe_i ON pa_i.CCCD = pe_i.CCCD
          LEFT JOIN 
              Tickets t ON pa_i.PassengerID = t.PassengerID
      `;

      const result = await sql.query(query);

      // Kiểm tra xem có dữ liệu không
      if (result.recordset.length === 0) {
          return res.status(404).json({ message: 'No passengers found' });
      }

      res.json(result.recordset);
  } catch (err) {
      console.error('Error fetching passengers:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to fetch passengers' });
  }
});
// 2. Bộ lọc hành khách dựa trên thông tin cơ bản
app.post('/api/passengers/filter', async (req, res) => {
  const { FullName, PassengerID, FlightNumber, CCCD } = req.body;

  try {
      const query = `
          SELECT 
              pa_i.PassengerID, 
              pe_i.FullName, 
              t.FlightNumber, 
              pa_i.CCCD
          FROM 
              PassengerInfo pa_i
          JOIN 
              PersonInfo pe_i ON pa_i.CCCD = pe_i.CCCD
          LEFT JOIN 
              Tickets t ON pa_i.PassengerID = t.PassengerID
          WHERE 
              (@FullName IS NULL OR pe_i.FullName LIKE '%' + @FullName + '%') AND
              (@PassengerID IS NULL OR pa_i.PassengerID = @PassengerID) AND
              (@FlightNumber IS NULL OR t.FlightNumber = @FlightNumber) AND
              (@CCCD IS NULL OR pa_i.CCCD = @CCCD)
      `;
      const params = {
          FullName: FullName || null,
          PassengerID: PassengerID || null,
          FlightNumber: FlightNumber || null,
          CCCD: CCCD || null,
      };

      const pool = await sql.connect(); // Đảm bảo kết nối
      const result = await pool.request()
          .input('FullName', sql.NVarChar, params.FullName)
          .input('PassengerID', sql.NVarChar, params.PassengerID)
          .input('FlightNumber', sql.NVarChar, params.FlightNumber)
          .input('CCCD', sql.NVarChar, params.CCCD)
          .query(query);

      res.json(result.recordset || []); // Đảm bảo trả về JSON hợp lệ
  } catch (err) {
      console.error('Error filtering passengers:', err.message, err.stack);
      res.status(500).send('Server error');
  }
});



// 3. Lấy toàn bộ thông tin chi tiết hành khách


app.get('/api/passengers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    

    // Truy vấn lấy thông tin hành khách
    const passengerQuery = `        
        SELECT 
            pa_i. PassengerID,
            pa_i.CCCD,
            pa_i.Email,
            pa_i.Phone,
            pe_i.FullName,
            pe_i.Gender,
            pe_i.BirthDate
        FROM PassengerInfo pa_i
        JOIN
          PersonInfo pe_i ON pe_i.CCCD = pa_i.CCCD
        WHERE pa_i.PassengerID = @id

        `;

    const flightsQuery =`
      SELECT 
            pa_i.PassengerID,
            f.FlightNumber, 
            apD.Name AS DepartureAirport, 
            apA.Name AS ArrivalAirport, 
            t.BookingDate, 
            t.SeatClass, 
            t.Price
        FROM 
            Tickets t
        INNER JOIN 
            Flights f ON t.FlightNumber = f.FlightNumber
        INNER JOIN 
            Airports apD ON apD.AirportCode = f.DepartureAirport
        INNER JOIN 
            Airports apA ON apA.AirportCode = f.ArrivalAirport
        INNER JOIN
            PassengerInfo pa_i ON pa_i.PassengerID = t.PassengerID
        WHERE 
            pa_i.CCCD = @cccd
    `;

    // Thiết lập kết nối với pool
    const pool = await sql.connect(config);

    const passengerResult = await pool.request()
      .input('id', sql.VarChar, id)
      .query(passengerQuery);

    if (passengerResult.recordset.length === 0) {
      return res.status(404).send({ message: 'Passenger not found.' });
    }

    const passengerInfo = passengerResult.recordset[0]; // Dữ liệu hành khách
    const { CCCD } = passengerInfo;

    //Truy vấn lấy thông tin chuyến bay dựa trên CCCD
    const flightsResult = await pool.request()
      .input('cccd', sql.VarChar, CCCD)
      .input('id',sql.VarChar,id )
      .query(flightsQuery);

    // Kết hợp dữ liệu hành khách và chuyến bay
    console.log(passengerInfo);
    console.log(flightsResult.recordset);
    res.json({
      PassengerResult: passengerInfo,
      FlightsResult: flightsResult.recordset,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin hành khách:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});





// 1.Lấy thông tin hóa đơn
app.get('/api/invoices', async (req, res) => {
  try {
      const query = `
          SELECT *
          FROM 
              Invoices ivc
      `;

      const result = await sql.query(query);

      // Kiểm tra xem có dữ liệu không
      if (result.recordset.length === 0) {
          return res.status(404).json({ message: 'No invoices found' });
      }

      res.json(result.recordset);
  } catch (err) {
      console.error('Error fetching invoices:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});
// 2. Bộ lọc hóa đơn dựa trên thông tin cơ bản
app.post('/api/invoices/filter', async (req, res) => {
  const { InvoiceID, FlightNumber, InvoiceDate } = req.body;
  console.log({InvoiceDate});
  try {
      const query = `
          SELECT *
          FROM 
              Invoices ivc
          WHERE 
              (@InvoiceID IS NULL OR ivc.InvoiceID= @InvoiceID) AND
              (@FlightNumber IS NULL OR ivc.FlightNumber = @FlightNumber) AND
              (@InvoiceDate IS NULL OR  CONVERT(Date, ivc.InvoiceDate) =CONVERT(Date,@InvoiceDate))
      `;
      const params = {
          InvoiceID: InvoiceID || null,
          FlightNumber: FlightNumber || null,
          InvoiceDate: InvoiceDate || null,
      };

      const pool = await sql.connect(); // Đảm bảo kết nối
      const result = await pool.request()
          .input('InvoiceID', sql.NVarChar, params.InvoiceID)
          .input('FlightNumber', sql.NVarChar, params.FlightNumber)
          .input('InvoiceDate', sql.Date, params.InvoiceDate)
          .query(query);

      console.log(result);    
      res.json(result.recordset || []); // Đảm bảo trả về JSON hợp lệ
  } catch (err) {
      console.error('Error filtering invoices:', err.message, err.stack);
      res.status(500).send('Server error');
  }
});



// 3. Lấy toàn bộ thông tin chi tiết hành khách


app.get('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;

  try {
    
    const InfoQuery =`
      SELECT 
            ivc.InvoiceID,
            ivc.FlightNumber,

            apD.Name as Departure,
            apA.Name as Arrival,

            apl.Model,
            apl.Airline,

            f.DepartureTime,
            f.ArrivalTime,

            ivc.TicketCount,
            ivc.TotalAmount,
            ivc.InvoiceDate
        FROM 
            Invoices ivc
        INNER JOIN 
            Flights f ON f.FlightNumber = ivc.FlightNumber
        INNER JOIN 
            Airports apD ON apD.AirportCode = f.DepartureAirport
        INNER JOIN 
            Airports apA ON apA.AirportCode = f.ArrivalAirport
        INNER JOIN
            Airplanes apl ON apl.AirplaneID = f.AirplaneID
        WHERE 
            ivc.InvoiceID = @id
    `;

    const InvoiceDetailsQuery = `
      SELECT 
        ivcd. TicketID,
        t.SeatClass,
        ivcd.TicketPrice
      FROM
        InvoiceDetails ivcd
      INNER JOIN
        Tickets t ON t.TicketID = ivcd.TicketID
      WHERE
        ivcd.InvoiceID = @id
    `

    // Thiết lập kết nối với pool
    const pool = await sql.connect(config);

    const InfoResult = await pool.request()
      .input('id', sql.VarChar, id)
      .query(InfoQuery);

    if (InfoResult.recordset.length === 0) {
      return res.status(404).send({ message: 'Invoice not found.' });
    }



    //Truy vấn lấy thông tin chuyến bay dựa trên CCCD
    const InvoiceDetailsResult = await pool.request()
      .input('id',sql.VarChar,id )
      .query(InvoiceDetailsQuery);

    // Kết hợp dữ liệu hành khách và chuyến bay
    console.log(InfoResult.recordset[0]);
    console.log(InvoiceDetailsResult.recordset);
    res.json({
      InfoResult: InfoResult.recordset[0],
      InvoiceDetailsResult: InvoiceDetailsResult.recordset,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin hóa đơn:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});
// Chạy server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

CREATE DATABASE NMCNPM_Test;
GO

USE NMCNPM_Test;
GO

CREATE TABLE employees (
    id NVARCHAR(50) PRIMARY KEY,            -- ID của nhân viên
    name NVARCHAR(100),                     -- Tên nhân viên
    email NVARCHAR(100),                    -- Email của nhân viên
    phone NVARCHAR(20),                     -- Số điện thoại
    startDate DATE,                          -- Ngày bắt đầu làm việc
    status NVARCHAR(50),                    -- Trạng thái công việc (đang làm việc)
    gender NVARCHAR(10),                    -- Giới tính
    birthDate DATE,                          -- Ngày sinh
    address NVARCHAR(255),                  -- Địa chỉ
    position NVARCHAR(100),                 -- Vị trí công việc
    idNumber NVARCHAR(20),                  -- Số chứng minh nhân dân
    department NVARCHAR(100),               -- Bộ phận làm việc
    flightsHandled INT,                     -- Số chuyến bay đã xử lý
    revenueGenerated NVARCHAR(50)           -- Doanh thu tạo ra
);
GO

INSERT INTO employees (
    id, name, email, phone, startDate, status, gender, birthDate, address, position, idNumber, department, flightsHandled, revenueGenerated
)
VALUES (
    'EMP001', N'Nguyễn Văn A', 'nguyenvana@example.com', '0987654321', '2020-01-01', N'Đang làm việc', N'Khác', '2000-01-01', N'123 Đường ABC, Quận 1, TP.HCM', N'Nhân viên bán vé', '123456789', N'Bộ phận bán vé', 150, N'1.2 tỷ VNĐ'
);
GO

SELECT *
FROM employees

ALTER LOGIN sa WITH PASSWORD = 'AAaa@@11';


GO

DROP TABLE users

TRUNCATE TABLE employees;
DROP TABLE PassengerInfo
GO
DROP TABLE Airplanes
DROP TABLE Tickets
DROP TABLE Airports
DROP TABLE Flights
DROP TABLE Invoices
DROP TABLE InvoiceDetails

CREATE TABLE PersonInfo (
    CCCD VARCHAR(20) PRIMARY KEY,         -- Số căn cước công dân (duy nhất)
    FullName VARCHAR(100) NOT NULL,          -- Họ tên đầy đủ
    Gender NVARCHAR(10) NOT NULL, -- Giới tính
    BirthDate DATE NOT NULL,                 -- Ngày sinh
    );


CREATE TABLE PassengerInfo (
    PassengerID NVARCHAR(10) PRIMARY KEY,
    CCCD VARCHAR(20) FOREIGN KEY REFERENCES PersonInfo(CCCD),
    Email NVARCHAR(100),
    Phone NVARCHAR(15),
);


CREATE TABLE Airplanes (
    AirplaneID NVARCHAR(10) PRIMARY KEY,
    Model NVARCHAR(50),
    Capacity INT,
    Airline NVARCHAR(50)
);
CREATE TABLE Airports (
    AirportCode NVARCHAR(10) PRIMARY KEY,
    Name NVARCHAR(100),
    City NVARCHAR(50),
    Country NVARCHAR(50)
);
CREATE TABLE Flights (
    FlightNumber NVARCHAR(10) PRIMARY KEY, -- Số hiệu chuyến bay
    AirplaneID NVARCHAR(10) FOREIGN KEY REFERENCES Airplanes(AirplaneID), -- Máy bay thực hiện chuyến bay
    DepartureAirport NVARCHAR(10) FOREIGN KEY REFERENCES Airports(AirportCode) , -- Sân bay khởi hành
    ArrivalAirport NVARCHAR(10) FOREIGN KEY REFERENCES Airports(AirportCode) , -- Sân bay đến
    DepartureTime DATETIME, -- Thời gian khởi hành
    ArrivalTime DATETIME, -- Thời gian đến
    FlightDuration INT, -- Thời gian bay (phút)
    Status NVARCHAR(50) -- Trạng thái chuyến bay (VD: Đang bay, Đã hạ cánh, Bị hoãn)
);

CREATE TABLE Tickets (
    TicketID CHAR(5) PRIMARY KEY,        -- Mã vé, định danh duy nhất
    PassengerID NVARCHAR(10) NOT NULL,       -- Mã hành khách, liên kết với bảng Passengers
    FlightNumber NVARCHAR(10) NOT NULL,      -- Số hiệu chuyến bay, liên kết với bảng Flights
    BookingDate DATE NOT NULL,          -- Ngày đặt vé
    SeatClass NVARCHAR(20) NOT NULL,   -- Hạng ghế (Economy, Business, First Class)
    Price DECIMAL(15, 2) NOT NULL,      -- Giá vé

    -- Khóa ngoại liên kết các bảng
    CONSTRAINT FK_Tickets_Passengers FOREIGN KEY (PassengerID) REFERENCES PassengerInfo(PassengerID),
    CONSTRAINT FK_Tickets_Flights FOREIGN KEY (FlightNumber) REFERENCES Flights(FlightNumber),
);

-- Bảng Hóa đơn
CREATE TABLE Invoices (
    InvoiceID CHAR(5) PRIMARY KEY,       -- Mã hóa đơn (duy nhất)
    FlightNumber NVARCHAR(10) NOT NULL, -- Số hiệu chuyến bay, liên kết với bảng Flights
    TotalAmount DECIMAL(15, 2) NOT NULL, -- Tổng tiền hóa đơn
    InvoiceDate DATETIME NOT NULL,            -- Ngày tạo hóa đơn

    -- Khóa ngoại liên kết với bảng Flights
    CONSTRAINT FK_Invoices_Flights FOREIGN KEY (FlightNumber) REFERENCES Flights(FlightNumber)
);

ALTER TABLE Invoices
ADD TicketCount INT DEFAULT 0;


-- Bảng Chi tiết hóa đơn
CREATE TABLE InvoiceDetails (
    InvoiceID CHAR(5) NOT NULL,          -- Mã hóa đơn, liên kết với bảng Invoices
    TicketID CHAR(5) NOT NULL,           -- Mã vé máy bay, liên kết với bảng Tickets
    TicketPrice DECIMAL(15, 2) NOT NULL, -- Giá vé tại thời điểm tạo hóa đơn

    -- Khóa chính kết hợp
    PRIMARY KEY (InvoiceID, TicketID),

    -- Khóa ngoại liên kết các bảng
    CONSTRAINT FK_InvoiceDetails_Invoices FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID),
    CONSTRAINT FK_InvoiceDetails_Tickets FOREIGN KEY (TicketID) REFERENCES Tickets(TicketID)
);

INSERT INTO PersonInfo (CCCD, FullName, Gender, BirthDate) 
VALUES
('1234567890', 'Nguyen Van A', 'Male', '1990-01-01'),
('2345678901', 'Tran Thi B', 'Female', '1985-05-15'),
('3456789012', 'Le Van C', 'Male', '2000-08-23'),
('4567890123', 'Pham Thi D', 'Female', '1995-07-30'),
('5678901234', 'Hoang Van E', 'Male', '1992-03-10'),
('6789012345', 'Nguyen Thi F', 'Female', '1987-12-12'),
('7890123456', 'Le Van G', 'Male', '1998-06-28'),
('8901234567', 'Pham Thi H', 'Female', '2001-02-20'),
('9012345678', 'Hoang Van I', 'Male', '1993-09-15'),
('0123456789', 'Nguyen Thi J', 'Female', '1991-04-05');


INSERT INTO PassengerInfo (PassengerID, CCCD, Email, Phone) 
VALUES
('P001', '1234567890', 'nguyenvana@gmail.com', '0912345678'),
('P002', '2345678901', 'tranthib@gmail.com', '0934567890'),
('P003', '3456789012', 'levanc@gmail.com', '0945678901'),
('P004', '4567890123', 'phamthid@gmail.com', '0956789012'),
('P005', '5678901234', 'hoangvane@gmail.com', '0967890123'),
('P006', '6789012345', 'nguyenthif@gmail.com', '0978901234'),
('P007', '7890123456', 'levang@gmail.com', '0989012345'),
('P008', '8901234567', 'phamthi@gmail.com', '0990123456'),
('P009', '9012345678', 'hoangvani@gmail.com', '0911234567'),
('P010', '0123456789', 'nguyenthij@gmail.com', '0922345678'),
('P011', '1234567890', 'nguyenvana2@gmail.com', '0933456789'),
('P012', '2345678901', 'tranthib2@gmail.com', '0944567890'),
('P013', '3456789012', 'levanc2@gmail.com', '0955678901'),
('P014', '4567890123', 'phamthid2@gmail.com', '0966789012'),
('P015', '5678901234', 'hoangvane2@gmail.com', '0977890123'),
('P016', '6789012345', 'nguyenthif2@gmail.com', '0988901234'),
('P017', '7890123456', 'levang2@gmail.com', '0999012345'),
('P018', '8901234567', 'phamthi2@gmail.com', '0910123456'),
('P019', '9012345678', 'hoangvani2@gmail.com', '0921234567'),
('P020', '0123456789', 'nguyenthij2@gmail.com', '0932345678'),
('P021', '1234567890', 'nguyenvana3@gmail.com', '0943456789'),
('P022', '2345678901', 'tranthib3@gmail.com', '0954567890'),
('P023', '3456789012', 'levanc3@gmail.com', '0965678901'),
('P024', '4567890123', 'phamthid3@gmail.com', '0976789012'),
('P025', '5678901234', 'hoangvane3@gmail.com', '0987890123'),
('P026', '6789012345', 'nguyenthif3@gmail.com', '0998901234'),
('P027', '7890123456', 'levang3@gmail.com', '0919012345'),
('P028', '8901234567', 'phamthi3@gmail.com', '0920123456'),
('P029', '9012345678', 'hoangvani3@gmail.com', '0931234567'),
('P030', '0123456789', 'nguyenthij3@gmail.com', '0942345678');


INSERT INTO Airplanes VALUES
('A001', 'Boeing 737', 180, 'Vietnam Airlines'),
('A002', 'Airbus A320', 160, 'Bamboo Airways'),
('A003', 'Boeing 787', 250, 'VietJet Air'),
('A004', 'Airbus A350', 300, 'Vietnam Airlines'),
('A005', 'Cessna 172', 4, 'Private Jet Services');

INSERT INTO Airports VALUES
('SGN', N'Tân Sơn Nhất', 'TP. HCM', 'Vietnam'),
('HAN', N'Nội Bài', N'Hà Nội', 'Vietnam'),
('DAD', N'Đà Nẵng', N'Đà Nẵng', 'Vietnam'),
('BKK', N'Suvarnabhumi', 'Bangkok', 'Thailand'),
('SIN', N'Changi', 'Singapore', 'Singapore');

INSERT INTO Airports (AirportCode,Name, City, Country)
VALUES
('HUI', N'Phú Bài', N'Huế', 'Vietnam'),
('PXU', N'Pleiku', N'Gia Lai', 'Vietnam');

INSERT INTO Flights VALUES
('VN123', 'A001', 'SGN', 'HAN', '2024-12-15 08:00:00', '2024-12-15 10:00:00', 120, 'Scheduled'),
('VN124', 'A002', 'HAN', 'DAD', '2024-12-15 12:00:00', '2024-12-15 13:20:00', 80, 'Scheduled'),
('VN125', 'A003', 'DAD', 'SGN', '2024-12-15 14:00:00', '2024-12-15 15:30:00', 90, 'Scheduled'),
('VN126', 'A001', 'SGN', 'SIN', '2024-12-16 09:00:00', '2024-12-16 12:00:00', 180, 'Scheduled'),
('VN127', 'A002', 'HAN', 'BKK', '2024-12-16 14:00:00', '2024-12-16 16:30:00', 150, 'Scheduled');


INSERT INTO Tickets (TicketID, PassengerID, FlightNumber, BookingDate, SeatClass, Price) VALUES
('T001', 'P001', 'VN123', '2024-01-01', 'Economy', 1200000),
('T002', 'P002', 'VN124', '2024-01-05', 'Business', 2500000),
('T003', 'P003', 'VN125', '2024-01-10', 'First Class', 5000000),
('T004', 'P004', 'VN126', '2024-01-15', 'Economy', 1200000),
('T005', 'P005', 'VN127', '2024-01-20', 'Business', 2500000),
('T006', 'P006', 'VN123', '2024-01-25', 'First Class', 5000000),
('T007', 'P007', 'VN124', '2024-02-01', 'Economy', 1500000),
('T008', 'P008', 'VN125', '2024-02-05', 'Business', 3000000),
('T009', 'P009', 'VN126', '2024-02-10', 'First Class', 5500000),
('T010', 'P010', 'VN127', '2024-02-15', 'Economy', 1700000),
('T011', 'P011', 'VN123', '2024-02-20', 'Business', 3200000),
('T012', 'P012', 'VN124', '2024-02-25', 'First Class', 6000000),
('T013', 'P013', 'VN125', '2024-03-01', 'Economy', 1200000),
('T014', 'P014', 'VN126', '2024-03-05', 'Business', 2500000),
('T015', 'P015', 'VN127', '2024-03-10', 'First Class', 5000000),
('T016', 'P016', 'VN123', '2024-03-15', 'Economy', 1500000),
('T017', 'P017', 'VN124', '2024-03-20', 'Business', 3000000),
('T018', 'P018', 'VN125', '2024-03-25', 'First Class', 5500000),
('T019', 'P019', 'VN126', '2024-03-30', 'Economy', 1700000),
('T020', 'P020', 'VN127', '2024-04-01', 'Business', 3200000),
('T021', 'P021', 'VN123', '2024-04-05', 'First Class', 5000000),
('T022', 'P022', 'VN124', '2024-04-10', 'Economy', 1200000),
('T023', 'P023', 'VN125', '2024-04-15', 'Business', 2500000),
('T024', 'P024', 'VN126', '2024-04-20', 'First Class', 5000000),
('T025', 'P025', 'VN127', '2024-04-25', 'Economy', 1700000),
('T026', 'P026', 'VN123', '2024-05-01', 'Business', 3200000),
('T027', 'P027', 'VN124', '2024-05-05', 'First Class', 6000000),
('T028', 'P028', 'VN125', '2024-05-10', 'Economy', 1500000),
('T029', 'P029', 'VN126', '2024-05-15', 'Business', 3000000),
('T030', 'P030', 'VN127', '2024-05-20', 'First Class', 5500000);


INSERT INTO Invoices (InvoiceID, FlightNumber, TotalAmount, InvoiceDate)
VALUES 
('I001', 'VN123', 0, '2024-05-21 08:30:00'),
('I002', 'VN124', 0, '2024-05-22 09:45:00'),
('I003', 'VN125', 0, '2024-05-23 10:15:00'),
('I004', 'VN126', 0, '2024-05-24 11:00:00'),
('I005', 'VN127', 0, '2024-05-25 12:20:00'),
('I006', 'VN123', 0, '2024-05-26 13:50:00'),
('I007', 'VN124', 0, '2024-05-27 14:10:00'),
('I008', 'VN125', 0, '2024-05-28 15:30:00'),
('I009', 'VN126', 0, '2024-05-29 16:45:00'),
('I010', 'VN127', 0, '2024-05-30 17:50:00'),
('I011', 'VN123', 0, '2024-05-31 18:10:00'),
('I012', 'VN124', 0, '2024-06-01 19:00:00'),
('I013', 'VN125', 0, '2024-06-02 20:30:00'),
('I014', 'VN126', 0, '2024-06-03 21:45:00'),
('I015', 'VN127', 0, '2024-06-04 22:15:00'),
('I016', 'VN123', 0, '2024-06-05 23:00:00'),
('I017', 'VN124', 0, '2024-06-06 23:59:00');


INSERT INTO InvoiceDetails (InvoiceID, TicketID, TicketPrice)
VALUES 
('I001', 'T001', 1200000),
('I001', 'T002', 2500000),
('I002', 'T003', 5000000),
('I002', 'T004', 1200000),
('I003', 'T005', 2500000),
('I003', 'T006', 5000000),
('I003', 'T007', 1500000),
('I004', 'T008', 3000000),
('I005', 'T009', 5500000),
('I005', 'T010', 1700000),
('I006', 'T011', 3200000),
('I006', 'T012', 6000000),
('I007', 'T013', 1200000),
('I007', 'T014', 2500000),
('I007', 'T015', 5000000),
('I008', 'T016', 1500000),
('I009', 'T017', 3000000),
('I009', 'T018', 5500000),
('I010', 'T019', 1700000),
('I010', 'T020', 3200000),
('I011', 'T021', 5000000),
('I012', 'T022', 1200000),
('I012', 'T023', 2500000),
('I012', 'T024', 5000000),
('I013', 'T025', 1700000),
('I013', 'T026', 3200000),
('I014', 'T027', 6000000),
('I015', 'T028', 1500000),
('I016', 'T029', 3000000),
('I017', 'T030', 5500000);

UPDATE Invoices
SET TotalAmount = (
    SELECT SUM(TicketPrice)
    FROM InvoiceDetails
    WHERE InvoiceDetails.InvoiceID = Invoices.InvoiceID
);

UPDATE Invoices
SET TicketCount = (
    SELECT COUNT(*)
    FROM InvoiceDetails
    WHERE InvoiceDetails.InvoiceID = Invoices.InvoiceID
);

SELECT * FROM PersonInfo;
SELECT * FROM PassengerInfo;
SELECT * FROM Airplanes;
SELECT * FROM Airports;
SELECT * FROM Flights;
SELECT * FROM Tickets;
SELECT * FROM Invoices;
SELECT * FROM InvoiceDetails;
DECLARE @FullName NVARCHAR(100), 
        @PassengerID INT, 
        @FlightNumber NVARCHAR(10), 
        @CCCD NVARCHAR(12);

set @FullName = N'Nguyễn Văn A';


SELECT 
    pi.PassengerID, 
    pi.FullName, 
    t.FlightNumber, 
    pi.CCCD
FROM 
    PassengerInfo pi
LEFT JOIN 
    Tickets t ON pi.PassengerID = t.PassengerID
WHERE 
    (@FullName IS NULL OR pi.FullName LIKE '%' + @FullName + '%') AND
    (@PassengerID IS NULL OR pi.PassengerID = @PassengerID) AND
    (@FlightNumber IS NULL OR t.FlightNumber = @FlightNumber) AND
    (@CCCD IS NULL OR pi.CCCD = @CCCD)


SELECT * FROM PassengerInfo WHERE PassengerID = 'P001';

SELECT 
    f.FlightNumber, 
    f.DepartureAirport, 
    f.ArrivalAirport, 
    f.DepartureTime, 
    f.ArrivalTime, 
    t.BookingDate, 
    t.SeatClass, 
    t.Price
FROM 
    Tickets t
INNER JOIN 
    Flights f ON t.FlightNumber = f.FlightNumber
WHERE 
    t.PassengerID = 'P001';

INSERT INTO Flights VALUES
('VN128', 'A001', 'SGN', 'HAN', '2024-12-15 08:00:00', '2024-12-15 10:00:00', 120, 'Scheduled')


        SELECT *
        FROM PassengerInfo AS pa_i
        JOIN
          PersonInfo AS pe_i ON pe_i.CCCD = pa_i.CCCD
        WHERE pa_i.PassengerID = 'P001'
		EXCEPT 
		SELECT CCCD
		FROM PersonInfo


		DECLARE @DateString VARCHAR(50) = 'Tue May 21 2024 00:00:00 GMT+0700 (Indochina Time)';
DECLARE @DateValue DATE;

SET @DateValue = CONVERT(DATE, @DateString, 106);

SELECT @DateValue;
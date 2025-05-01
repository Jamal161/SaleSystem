
# Sales and Stock Reporting System

A web-based system for managing products, sales, and stock reports.

## Features

- User authentication (register/login)
- Product management (CRUD operations with soft delete)
- Sales recording with stock validation
- Current stock reporting
- Date-wise stock reporting
- Pagination and search functionality

## Technologies Used

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server (LocalDB)
- JWT Authentication
- Reactjs for frontend


## Setup Instructions

1. **Prerequisites**:
   - .NET 6 SDK
   - SQL Server (LocalDB is sufficient)

2. **Database Setup**:
   - The application uses Code-First migrations. On first run, it will create the database automatically.

3. **Running the Application**:
   - Clone the repository
   - Navigate to the project directory
   - Run `dotnet run` or start from Visual Studio
   - The application will be available at `https://localhost:5001` (or similar port)
   - Reactjs for frontend install npm then run command npm start

4. **Default Admin User**:
   - On first run, an admin user is created automatically:
     - Username: `admin`
     - Password: `admin123`

5. **Swagger UI**:
   - Access the Swagger UI at `/swagger` to test all API endpoints
   - Use the "Authorize" button to set the JWT token after login

## API Endpoints

- Authentication:
  - POST `/api/auth/register` - Register a new user
  - POST `/api/auth/login` - Login and get JWT token

- Products:
  - GET `/api/products` - Get paginated list of products
  - GET `/api/products/{id}` - Get a single product
  - POST `/api/products` - Create a new product
  - PUT `/api/products/{id}` - Update a product
  - DELETE `/api/products/{id}` - Soft delete a product

- Sales:
  - GET `/api/sales` - Get paginated list of sales
  - POST `/api/sales` - Record a new sale

- Reports:
  - GET `/api/reports/current-stock` - Get current stock report
  - GET `/api/reports/date-wise-stock` - Get date-wise stock report



SalesStockReporting/
├── Controllers/
│   ├── AuthController.cs
│   ├── ProductsController.cs
│   ├── ReportsController.cs
│   └── SalesController.cs
├── Data/
│   └── ApplicationDbContext.cs
├── Models/
│   ├── Product.cs
│   ├── Sale.cs
│   └── User.cs
├── Services/
│   ├── AuthService.cs
│   ├── IAuthService.cs
│   ├── IProductService.cs
│   ├── IReportingService.cs
│   ├── ISalesService.cs
│   ├── ProductService.cs
│   ├── ReportingService.cs
│   └── SalesService.cs
├── Frontend/
│   └── npm install
├── appsettings.json
├── Program.cs
└── README.md

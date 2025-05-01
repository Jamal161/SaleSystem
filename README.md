# Sales and Stock Reporting System

A web-based system for managing products, sales, and stock reports.

## Features

- ✅ User authentication (register/login)
- ✅ Product management (CRUD operations with soft delete)
- ✅ Sales recording with stock validation
- ✅ Current stock reporting
- ✅ Date-wise stock reporting
- ✅ Pagination and search functionality

## Technologies Used

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server (LocalDB)
- JWT Authentication
- ReactJS (Frontend)

## Setup Instructions

### 1. Prerequisites

- .NET 6 SDK
- SQL Server (LocalDB is sufficient)
- Node.js and npm (for React frontend)

### 2. Database Setup

- This project uses **Code-First Migrations** with Entity Framework Core.
- On first run, the database will be created automatically if it doesn't exist.

### 3. Running the Application

#### Backend (ASP.NET Core)

```bash
git clone <your-repo-url>
cd SalesStockReporting
dotnet run
```

- Alternatively, open the solution in **Visual Studio** and press **F5** to run.

- By default, the backend will run at `https://localhost:5001`

#### Frontend (React)

```bash
cd Frontend
npm install
npm start
```

- The frontend will run at `http://localhost:3000` (default React port)

### 4. Default Admin User

On first application run, a default admin user is created automatically:

- **Username**: `admin`  
- **Password**: `admin123`

### 5. Swagger UI

- Access Swagger at: `https://localhost:5001/swagger`
- Use the **Authorize** button to enter your JWT token after login.

---

## API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Login and get JWT token  |

### 📦 Products

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/products`       | Get paginated list       |
| GET    | `/api/products/{id}`  | Get single product       |
| POST   | `/api/products`       | Create new product       |
| PUT    | `/api/products/{id}`  | Update product           |
| DELETE | `/api/products/{id}`  | Soft delete a product    |

### 💵 Sales

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| GET    | `/api/sales`  | Get sales list      |
| POST   | `/api/sales`  | Record new sale     |

### 📊 Reports

| Method | Endpoint                      | Description                  |
|--------|-------------------------------|------------------------------|
| GET    | `/api/reports/current-stock`   | Get current stock report     |
| GET    | `/api/reports/date-wise-stock` | Get date-wise stock report   |

---

## Project Structure

```bash
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
│   └── (React App)
├── appsettings.json
├── Program.cs
└── README.md
```

---


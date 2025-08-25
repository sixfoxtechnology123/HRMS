const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./db/db");

// Routes
const departmentRoutes = require("./routes/departmentRoutes");
const designationRoutes = require("./routes/designationRoutes");
const masterRoutes = require("./routes/masterRoutes");
const leaveTypeRoutes = require("./routes/leavetyperoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const shiftRoutes = require("./routes/shiftroutes");
const policyRoutes = require("./routes/policyRoutes");
const locationRoutes = require('./routes/locationroutes');
const payrollComponentRoutes = require("./routes/payrollComponentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//  Serve uploaded files (after app is defined)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/master", masterRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/leavetypes", leaveTypeRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/policies", policyRoutes);
app.use('/api/locations', locationRoutes);
app.use("/api/payrollcomponents", payrollComponentRoutes);
app.use("/api/employees", employeeRoutes);

// Function to start server with fallback ports
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(` Server running on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
};

const PORT = process.env.PORT || 5001;
startServer(PORT);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./db/db");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

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
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/master", masterRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/leavetypes", leaveTypeRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/payrollcomponents", payrollComponentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

// Function to create default admin if not exists
const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ userId: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10); // hash the password
      await Admin.create({
        userId: "admin",
        password: hashedPassword,
      });
      console.log("Default admin created: userId=admin, password=admin123");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await createDefaultAdmin(); // create default admin

    const PORT = process.env.PORT || 5001;
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} in use, trying ${PORT + 1}...`);
        startServer(PORT + 1);
      } else {
        console.error(err);
      }
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();

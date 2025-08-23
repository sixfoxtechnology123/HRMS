const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const departmentRoutes = require("./routes/departmentRoutes");
const designationRoutes = require("./routes/designationRoutes");
const masterRoutes = require('./routes/masterRoutes');
const leaveTypeRoutes = require("./routes/leavetyperoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Use only one route prefix for master
app.use('/api/master', masterRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/leavetypes", leaveTypeRoutes);


// Function to start server with fallback ports
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
};

const PORT = process.env.PORT || 5001;
startServer(PORT);

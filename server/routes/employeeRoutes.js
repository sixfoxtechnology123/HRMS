const express = require("express");
const router = express.Router();
const {
  getNextEmployeeID,
  createEmployee,
  getAllEmployees,
  getManagers,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

router.get("/next-id", getNextEmployeeID);
router.get("/managers", getManagers);
router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;

const Shift = require("../models/Shift");

// Auto-generate ShiftID
const generateShiftID = async () => {
  const last = await Shift.findOne().sort({ shiftID: -1 });
  let nextNumber = 1;
  if (last && last.shiftID) {
    const match = last.shiftID.match(/SHF(\d+)/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  return `SHF${String(nextNumber).padStart(2, "0")}`;
};

exports.getNextShiftID = async (req, res) => {
  try {
    const code = await generateShiftID();
    res.json({ shiftID: code });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate ID" });
  }
};

exports.createShift = async (req, res) => {
  try {
    const { shiftID, shiftName, startTime, endTime, breakDuration, status } =
      req.body;

    if (!shiftID || !shiftName || !startTime || !endTime || !breakDuration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const shift = new Shift({
      shiftID,
      shiftName,
      startTime,
      endTime,
      breakDuration,
      status,
    });
    const savedShift = await shift.save();

    res.status(201).json(savedShift);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
};

exports.updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // shiftID bhi allow hai, par overwrite nahi karenge

    //  shiftID ko update hone se rokna
    if (updateData.shiftID) {
      delete updateData.shiftID;
    }

    const updated = await Shift.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Shift not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    res.json({ message: "Shift deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

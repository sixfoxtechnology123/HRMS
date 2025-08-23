// controllers/locationController.js
const Location = require('../models/Location');

// Format: LOC01, LOC02, ...
const generateLocationID = (num) => `LOC${String(num).padStart(2, '0')}`;


// controllers/locationController.js
exports.getNextLocationID = async (_req, res) => {
  try {
    const lastLocation = await Location.findOne().sort({ locationID: -1 });

    let nextNumber = 1;
    if (lastLocation && lastLocation.locationID) {
      const lastNum = parseInt(lastLocation.locationID.replace("LOC", ""), 10);
      nextNumber = lastNum + 1;
    }

    const code = `LOC${String(nextNumber).padStart(2, '0')}`;
    res.json({ locationID: code });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate ID" });
  }
};



// Create Location (auto-generate locationID here)
exports.createLocation = async (req, res) => {
  try {
    const { locationName, address, country, state, city, status } = req.body;

    if (!locationName || !address || !country || !state || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the last record sorted by locationID
    const lastLocation = await Location.findOne().sort({ locationID: -1 });

    let nextNumber = 1;
    if (lastLocation && lastLocation.locationID) {
      const lastNum = parseInt(lastLocation.locationID.replace("LOC", ""), 10);
      nextNumber = lastNum + 1;
    }

    const newLocationID = `LOC${String(nextNumber).padStart(2, '0')}`;

    const loc = new Location({
      locationID: newLocationID,
      locationName,
      address,
      country,
      state,
      city,
      status,
    });

    const saved = await loc.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: err.message });
  }
};


// GET /api/locations
exports.getAllLocations = async (_req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: 1 });
    return res.json(locations);
  } catch (err) {
    console.error('Fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

// PUT /api/locations/:id
exports.updateLocation = async (req, res) => {
  try {
    const updated = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Location not found' });
    return res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/locations/:id
exports.deleteLocation = async (req, res) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Location not found' });
    return res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ error: err.message });
  }
};

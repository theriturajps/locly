require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
const connection = process.env.DB;
mongoose.connect(connection);

// Location Schema
const locationSchema = new mongoose.Schema({
	latitude: Number,
	longitude: Number,
	timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', locationSchema);

// API Routes
app.post('/api/location', async (req, res) => {
	try {
		const { latitude, longitude } = req.body;
		const location = new Location({ latitude, longitude });
		await location.save();
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/locations', async (req, res) => {
	try {
		const locations = await Location.find().sort('-timestamp').limit(100);
		res.json(locations);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
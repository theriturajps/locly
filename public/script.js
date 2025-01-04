// public/script.js
let map;
let marker;

// Initialize map
function initMap() {
	map = L.map('map').setView([0, 0], 2);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);
}

// Update location info displays
function updateLocationInfo(latitude, longitude) {
	document.getElementById('lat').textContent = latitude.toFixed(6);
	document.getElementById('lng').textContent = longitude.toFixed(6);
}

// Save location to database
async function saveLocation(latitude, longitude) {
	try {
		const response = await fetch('/api/location', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ latitude, longitude })
		});
		const data = await response.json();
		console.log('Location saved:', data);
	} catch (error) {
		console.error('Error saving location:', error);
	}
}

// Update map marker
function updateMarker(latitude, longitude) {
	if (marker) {
		marker.setLatLng([latitude, longitude]);
	} else {
		marker = L.marker([latitude, longitude]).addTo(map);
	}
	map.setView([latitude, longitude], 15);
}

// Track user location
function trackLocation() {
	if (!navigator.geolocation) {
		alert('Geolocation is not supported by your browser');
		return;
	}

	function success(position) {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		updateLocationInfo(latitude, longitude);
		updateMarker(latitude, longitude);
		saveLocation(latitude, longitude);
	}

	function error() {
		alert('Unable to retrieve your location');
	}

	navigator.geolocation.watchPosition(success, error, {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	});
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
	initMap();
	trackLocation();
});
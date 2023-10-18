// Initialize the Leaflet map
var map = L.map('map').setView([40.7128, -74.0060], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var markers = L.layerGroup(); // Create a layer group for markers

// Function to create markers with custom data
function addMarker(lat, lon, selectedBorough) {
    // Customize the popup text
    const popupText = `${selectedBorough} Data`;
    var marker = L.marker([lat, lon]);
    marker.bindPopup(popupText);
    marker.on('click', function () {
        showCrimeSummary(selectedBorough);
    });
    markers.addLayer(marker);
}

// Function to show the crime summary
function showCrimeSummary(selectedBorough) {
    // Fetch the crime summary data for the selected borough from the API
    const crimeSummaryURL = `http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/${selectedBorough}`;

    fetch(crimeSummaryURL)
        .then(response => response.json())
        .then(data => {
            // Customize the content of the popup
            const popupContent = `
                <h3>${selectedBorough} Data</h3>
                <p>Total Crimes: ${data['Total Crimes']}</p>
                <!-- Add more crime summary details here -->
            `;
            
            // Update the popup content
            markers.getLayers().forEach(layer => {
                if (layer.getLatLng() && layer.getLatLng().lat === data.lat && layer.getLatLng().lng === data.lon) {
                    layer.setPopupContent(popupContent);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data or parsing JSON:', error);
        });
}

// Define your URLs for borough data
var urls = [
  "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/BRONX",
  "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/BROOKLYN",
  "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/QUEENS",
  "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/STATEN ISLAND",
  "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/MANHATTAN"
];

// Hard-coded geocoordinates for boroughs
var boroughCoordinates = {
  'BRONX': { lat: 40.8448, lon: -73.8648 },
  'BROOKLYN': { lat: 40.6782, lon: -73.9442 },
  'QUEENS': { lat: 40.7282, lon: -73.7949 },
  'STATEN ISLAND': { lat: 40.5795, lon: -74.1502 },
  'MANHATTAN': { lat: 40.7831, lon: -73.9712 }
};

// Fetch data from each URL and create markers with hardcoded coordinates
urls.forEach(function (url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const selectedBorough = data.Borough;

            // Get the hardcoded coordinates for the selected borough
            const coordinates = boroughCoordinates[selectedBorough];
            if (coordinates) {
                const lat = coordinates.lat;
                const lon = coordinates.lon;

                // Customize the popup text
                addMarker(lat, lon, selectedBorough);
            }
        })
        .catch(error => {
            console.error('Error fetching data or parsing JSON:', error);
        });
});

// Handle changes in the dropdown selection
document.querySelector('.borough-dropdown').addEventListener('change', function (event) {
    var selectedBorough = event.target.value;

    // Clear previous markers
    markers.clearLayers();

    // Add a marker for the selected borough with a custom popup
    if (selectedBorough !== 'SELECT A BOROUGH') {
        const coordinates = boroughCoordinates[selectedBorough];
        if (coordinates) {
            const lat = coordinates.lat;
            const lon = coordinates.lon;
            addMarker(lat, lon, selectedBorough);
            markers.addTo(map);
        }
    }
});

const url = "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/BRONX"
const url2 = "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/BROOKLYN"
const url3 = "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/QUEENS"
const url4 = "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/STATEN ISLAND"
const url5 = "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/MANHATTAN"

// Initialize the Leaflet map
var map = L.map('map').setView([40.7128, -74.0060], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var markers = L.layerGroup(); // Create a layer group for markers

// Create a function to add markers and popups
function addMarker(lat, lon, popupText) {
    var marker = L.marker([lat, lon]);
    marker.bindPopup(popupText);
    markers.addLayer(marker);
}

// Function to show the crime summary
function showCrimeSummary(selectedBorough) {
    // Replace this with your code to fetch and display the crime summary for the selected borough
    // You can use Bootstrap modals, tooltips, or another method to display the summary
    console.log('Crime summary for ' + selectedBorough);
}

// Handle changes in the dropdown selection
document.querySelector('.borough-dropdown').addEventListener('change', function (event) {
    var selectedBorough = event.target.value;
    var selectedOption = event.target.selectedOptions[0];
    var lat = parseFloat(selectedOption.getAttribute('data-lat'));
    var lon = parseFloat(selectedOption.getAttribute('data-lon'));

    // Clear previous markers
    markers.clearLayers();

    // Add a marker for the selected borough with a custom popup
    if (selectedBorough !== 'SELECT A BOROUGH') {
        addMarker(lat, lon, `Data for ${selectedBorough}`);
        markers.addTo(map);

        // Call a function to display crime summary (customize as needed)
        showCrimeSummary(selectedBorough);
    }
});

// Initialize the Leaflet map
var map = L.map('map').setView([40.7128, -74.0060], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var markers = L.layerGroup(); // Create a layer group for markers

// // Function to create markers with custom data

function addMarker(lat, lon, selectedBorough) {
    // Create a custom marker with a text box
    var customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-text">Click Here</div>`,
        iconSize: [100, 30], 
    });

    var marker = L.marker([lat, lon], { icon: customIcon });

    marker.on('click', function () {
        showBoroughImage(selectedBorough, marker);
    });

    markers.addLayer(marker);
}


function showBoroughImage(selectedBorough, marker) {
    // Construct the path to the local PNG image
    const imageSource = `data/${selectedBorough}.png`;

    // Check if the image file exists
    fetch(imageSource)
        .then(response => {
            if (!response.ok) {
                // If the image doesn't exist, display an error message
                marker.bindPopup("No image available for this borough.").openPopup();
            } else {
                // Display the image in the popup
                const popupContent = `<img src="${imageSource}" alt="${selectedBorough}" width="200" height="200">`;
                marker.bindPopup(popupContent).openPopup();
            }
        })
        .catch(error => {
            console.error('Error fetching image:', error);
        });
    }

// Handle changes in the dropdown selection
document.querySelector('.borough-dropdown').addEventListener('change', function (event) {
    var selectedBorough = event.target.value;

    // Clear previous markers
    markers.clearLayers();

    // Add a marker for the selected borough with custom popup
    if (selectedBorough !== 'SELECT A BOROUGH') {
        const coordinates = boroughCoordinates[selectedBorough];
        if (coordinates) {
            const lat = coordinates.lat;
            const lon = coordinates.lon;
            addMarker(lat, lon, selectedBorough);
            markers.addTo(map);

            // Auto-zoom to the selected borough
            map.setView([lat, lon], 12); // You can adjust the zoom level as needed
        }
    }
});

// Hard-coded geocoordinates for boroughs
var boroughCoordinates = {
    'BRONX': { lat: 40.8448, lon: -73.8648 },
    'BROOKLYN': { lat: 40.6782, lon: -73.9442 },
    'QUEENS': { lat: 40.7282, lon: -73.7949 },
    'STATEN ISLAND': { lat: 40.5795, lon: -74.1502 },
    'MANHATTAN': { lat: 40.7831, lon: -73.9712 }
};

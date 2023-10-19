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
    // Create a custom marker with a text box
    var customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-text">Click Here</div>`,
        iconSize: [100, 30], 
    });

    var marker = L.marker([lat, lon], { icon: customIcon });

    marker.on('click', function () {
    
        showCrimeSummary(selectedBorough, marker);
    });

    markers.addLayer(marker);
}
function showCrimeSummary(selectedBorough, marker) {
    const crimeSummaryURL = `http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/${selectedBorough}`;

    fetch(crimeSummaryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const formattedData = JSON.stringify(data, null, 2);
            const popupContent = `<pre>${formattedData}</pre>`;
            marker.bindPopup(popupContent).openPopup();
        })
        .catch(error => {
            console.error('Error fetching data or parsing JSON:', error);
            // Add an alert or log the error to see what's going wrong
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


// Define your URLs for borough data
// var urls = [
//   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/BRONX",
//   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/BROOKLYN",
//   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/QUEENS",
//   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/STATEN ISLAND",
//   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/MANHATTAN"
// ];

// Hard-coded geocoordinates for boroughs
var boroughCoordinates = {
  'BRONX': { lat: 40.8448, lon: -73.8648 },
  'BROOKLYN': { lat: 40.6782, lon: -73.9442 },
  'QUEENS': { lat: 40.7282, lon: -73.7949 },
  'STATEN ISLAND': { lat: 40.5795, lon: -74.1502 },
  'MANHATTAN': { lat: 40.7831, lon: -73.9712 }
};

// let data;

// const getData = async () => {
//     data = await (await fetch('http://127.0.0.1:5000/api/v1.0/NYC_all_crime')).json();


//     console.log(data);
// };

// // Function to update and show the bar graph
// function updateBarGraph(selectedCategory) {
//     // Filter the data for the selected crime category
//     const filteredData = data.filter(item => item['Offense'] === selectedCategory);

//     // Group the data by borough and calculate the count for each borough
//     const groupedData = d3.group(filteredData, d => d.Borough);
//     const boroughs = Array.from(groupedData.keys());
//     const counts = Array.from(groupedData.values()).map(group => group.length);

//     // Create a bar graph using Plotly
//     const trace = {
//         x: boroughs,
//         y: counts,
//         type: 'bar'
//     };



//     const layout = {
//         title: `Crime Count by Borough for ${selectedCategory}`,
//         xaxis: { title: 'Borough' },
//         yaxis: { title: 'Count' }
//     };

//     Plotly.newPlot('barGraph', [trace], layout);

//     // Show the bar graph by setting the display property to 'block'
//     document.getElementById('barGraph').style.display = 'block';
// }

// // Handle click events on the crime category buttons
// document.querySelectorAll('.btn-group a').forEach(button => {
//     button.addEventListener('click', event => {
//         event.preventDefault();
//         const selectedCategory = event.target.innerText; // Get the category from the button text
//         updateBarGraph(selectedCategory);
//     });
// });


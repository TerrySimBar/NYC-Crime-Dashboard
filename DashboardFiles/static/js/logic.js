var map = L.map('map').setView([40.7128, -74.0060], 10);

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var boroughBoundaries = L.geoJSON(nyc_boro, {
    style: function (feature) {
        return {
            color: 'blue', // Default color for all boroughs
            weight: 2,
            fillOpacity: 0.2
        };
    },
    onEachFeature: function (feature, layer) {
        layer.on('click', function (e) {
            // Highlight the selected borough in red
            e.target.setStyle({
                color: 'red',
                weight: 2,
                fillOpacity: 0.5
            });

            // Show crime summary for the selected borough
            var selectedBorough = feature.properties.name;
            showCrimeSummary(selectedBorough);
        });
    }
}).addTo(map);

function resetHighlight(e) {
    // Reset the style for all boroughs
    boroughBoundaries.resetStyle(e.target);
}

// Function to show the crime summary
function showCrimeSummary(selectedBorough) {
    // Replace this with your code to fetch and display the crime summary for the selected borough
    // You can use Bootstrap modals, tooltips, or another method to display the summary
    console.log('Crime summary for ' + selectedBorough);
}

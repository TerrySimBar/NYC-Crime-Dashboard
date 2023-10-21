document.addEventListener("DOMContentLoaded", function () {
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
    
    // Function to fetch crime summary data and show on marker click
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
                map.setView([lat, lon], 12);
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
});

// Function to create a bar chart
function createBarChart(title, elementId, xData, yData, xTitle, yTitle) {
    const trace = {
        x: xData,
        y: yData,
        type: "bar",
    };

    const layout = {
        title: title,
        xaxis: { title: xTitle },
        yaxis: { title: yTitle },
    };

    Plotly.newPlot(elementId, [trace], layout);
}

// Fetch felony summary data and create the bar chart
fetch('http://127.0.0.1:5000/api/v1.0/FELONY_summary')
    .then(response => response.json())
    .then(felonyData => {
        const boroughs = felonyData["FELONY Data"].map(item => item.Borough);
        const felonyCounts = felonyData["FELONY Data"].map(item => item.FelonyCount);
        
        createBarChart("Felony Crimes", "felony-bar-chart", boroughs, felonyCounts, " ", " ");
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Fetch misdemeanor summary data and create the bar chart
fetch('http://127.0.0.1:5000/api/v1.0/MISDEMEANOR_summary')
    .then(response => response.json())
    .then(misdemeanorData => {
        const boroughs = misdemeanorData["MISDEMEANOR Data"].map(item => item.Borough);
        const misdemeanorCounts = misdemeanorData["MISDEMEANOR Data"].map(item => item.MisdemeanorCount);

        createBarChart("Misdemeanor Crimes", "misdemeanor-bar-chart", boroughs, misdemeanorCounts, " ", " ");
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Fetch violations summary data and create the bar chart
fetch('http://127.0.0.1:5000/api/v1.0/VIOLATION_summary')
    .then(response => response.json())
    .then(violationData => {
        const boroughs = violationData["VIOLATION Data"].map(item => item.Borough);
        const violationCounts = violationData["VIOLATION Data"].map(item => item.ViolationCount);

        createBarChart("Violations", "violations-bar-chart", boroughs, violationCounts, " ", " ");
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Fetch all crime data and create a line graph
fetch('http://127.0.0.1:5000/api/v1.0/NYC_all_crime')
    .then(response => response.json())
    .then(data => {
        const groupedData = groupDataByMonth(data);
        const labels = Object.keys(groupedData);
        const counts = Object.values(groupedData);
        createLineGraph("Crime Trend", "line-graph", labels, counts, " ", " ");
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Function to group data by month
function groupDataByMonth(data) {
    return data.reduce((result, record) => {
        const complaintDate = new Date(record['Complaint Date']);
        const monthYear = `${complaintDate.getFullYear()}-${complaintDate.getMonth() + 1}`;

        if (!result[monthYear]) {
            result[monthYear] = 0;
        }
        result[monthYear]++;
        return result;
    }, {});
}

// Function to create a line graph
function createLineGraph(title, elementId, xData, yData, xTitle, yTitle) {
    const trace = {
        x: xData,
        y: yData,
        type: 'line',
        mode: 'lines+markers',
        marker: { color: 'red' },
    };

    const layout = {
        title: title,
        xaxis: { title: xTitle },
        yaxis: { title: yTitle },
    };

    Plotly.newPlot(elementId, [trace], layout);
}

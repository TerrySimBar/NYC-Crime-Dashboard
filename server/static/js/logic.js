// document.addEventListener("DOMContentLoaded", function () {
//     // Your code here
// });


// // Initialize the Leaflet map
// var map = L.map('map').setView([40.7128, -74.0060], 10);

// // Add OpenStreetMap tiles
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// var markers = L.layerGroup(); // Create a layer group for markers

// // Function to create markers with custom data



// function addMarker(lat, lon, selectedBorough) {
//     // Create a custom marker with a text box
//     var customIcon = L.divIcon({
//         className: 'custom-marker',
//         html: `<div class="marker-text">Click Here</div>`,
//         iconSize: [100, 30], 
//     });

//     var marker = L.marker([lat, lon], { icon: customIcon });

//     marker.on('click', function () {
    
//         showCrimeSummary(selectedBorough, marker);
//     });

//     markers.addLayer(marker);
// }

// // Function to fetch crime summary data and show on marker click
// function showCrimeSummary(selectedBorough, marker) {
//     const crimeSummaryURL = `http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/${selectedBorough}`;

//     fetch(crimeSummaryURL)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             const formattedData = JSON.stringify(data, null, 2);
//             const popupContent = `<pre>${formattedData}</pre>`;
//             marker.bindPopup(popupContent).openPopup();
//         })
//         .catch(error => {
//             console.error('Error fetching data or parsing JSON:', error);
//             // Add an alert or log the error to see what's going wrong
//         });
// }




// // Handle changes in the dropdown selection
// document.querySelector('.borough-dropdown').addEventListener('change', function (event) {
//     var selectedBorough = event.target.value;

//     // Clear previous markers
//     markers.clearLayers();

//     // Add a marker for the selected borough with custom popup
//     if (selectedBorough !== 'SELECT A BOROUGH') {
//         const coordinates = boroughCoordinates[selectedBorough];
//         if (coordinates) {
//             const lat = coordinates.lat;
//             const lon = coordinates.lon;
//             addMarker(lat, lon, selectedBorough);
//             markers.addTo(map);

//             // Auto-zoom to the selected borough
//             map.setView([lat, lon], 12); // You can adjust the zoom level as needed
//         }
//     }
// });


// // // Define your URLs for borough data
// // // var urls = [
// // //   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/BRONX",
// // //   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/BROOKLYN",
// // //   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/QUEENS",
// // //   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/STATEN ISLAND",
// // //   "http://127.0.0.1:5000/api/v1.0/NYC_borough_summary/MANHATTAN"
// // // ];

// // Hard-coded geocoordinates for boroughs
// var boroughCoordinates = {
//   'BRONX': { lat: 40.8448, lon: -73.8648 },
//   'BROOKLYN': { lat: 40.6782, lon: -73.9442 },
//   'QUEENS': { lat: 40.7282, lon: -73.7949 },
//   'STATEN ISLAND': { lat: 40.5795, lon: -74.1502 },
//   'MANHATTAN': { lat: 40.7831, lon: -73.9712 }
// };


// document.addEventListener("DOMContentLoaded", async function () {
//     try {
//         const response = await fetch('http://127.0.0.1:5000/api/v1.0/FELONY_summary');
//         if (!response.ok) {
//             throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
//         }

//         const felonyData = await response.json();

//         const boroughs = felonyData["FELONY Data"].map((item) => item.Borough);
//         const felonyCounts = felonyData["FELONY Data"].map((item) => item.FelonyCount);

//         const trace = {
//             x: boroughs,
//             y: felonyCounts,
//             type: "bar",
//         };

//         const layout = {
//             title: "Felony Counts by Borough",
//             xaxis: { title: "Borough" },
//             yaxis: { title: "Felony Count" },
//         };

//         Plotly.newPlot("bar-chart", [trace], layout);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
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

    // Hard-coded geocoordinates for boroughs
    var boroughCoordinates = {
        'BRONX': { lat: 40.8448, lon: -73.8648 },
        'BROOKLYN': { lat: 40.6782, lon: -73.9442 },
        'QUEENS': { lat: 40.7282, lon: -73.7949 },
        'STATEN ISLAND': { lat: 40.5795, lon: -74.1502 },
        'MANHATTAN': { lat: 40.7831, lon: -73.9712 }
    };

    // Fetch felony summary data and create the bar chart
    fetch('http://127.0.0.1:5000/api/v1.0/FELONY_summary')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(felonyData => {
            const boroughs = felonyData["FELONY Data"].map(item => item.Borough);
            const felonyCounts = felonyData["FELONY Data"].map(item => item.FelonyCount);

            const trace = {
                x: boroughs,
                y: felonyCounts,
                type: "bar",
            };

            const layout = {
                title: "Felony Crimes",
                xaxis: { title: " " },
                yaxis: { title: " " },
            };

            Plotly.newPlot("felony-bar-chart", [trace], layout);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


// Fetch misdemeanor summary data and create the bar chart
fetch('http://127.0.0.1:5000/api/v1.0/MISDEMEANOR_summary')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(misdemeanorData => {
        const boroughs = misdemeanorData["MISDEMEANOR Data"].map(item => item.Borough);
        const misdemeanorCounts = misdemeanorData["MISDEMEANOR Data"].map(item => item.MisdemeanorCount);

        const trace = {
            x: boroughs,
            y: misdemeanorCounts,
            type: "bar",
        };

        const layout = {
            title: "Misdemeanor Crimes",
            xaxis: { title: " " },
            yaxis: { title: " " },
        };

        Plotly.newPlot("misdemeanor-bar-chart", [trace], layout);

        // Log misdemeanorCounts after data has been fetched and processed
        console.log(misdemeanorCounts);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Fetch violations summary data and create the bar chart
fetch('http://127.0.0.1:5000/api/v1.0/VIOLATION_summary')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(violationData => {
        const boroughs = violationData["VIOLATION Data"].map(item => item.Borough);
        const violationCounts = violationData["VIOLATION Data"].map(item => item.ViolationCount);

        const trace = {
            x: boroughs,
            y: violationCounts,
            type: "bar",
        };

        const layout = {
            title: "Violations",
            xaxis: { title: " " },
            yaxis: { title: " " },
        };

        Plotly.newPlot("violations-bar-chart", [trace], layout);

        // Log violationsCounts after data has been fetched and processed
        console.log(violationCounts);
    })
    .catch(error => {
        console.error('Error:', error);
    });






document.addEventListener("DOMContentLoaded", function () {
   

    const apiUrl = 'http://127.0.0.1:5000/api/v1.0/NYC_all_crime';

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        processDataAndCreateLineGraph(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    function processDataAndCreateLineGraph(data) {
      // Group data by month
      const groupedData = data.reduce((result, record) => {
        const complaintDate = new Date(record['Complaint Date']);
        const monthYear = `${complaintDate.getFullYear()}-${complaintDate.getMonth() + 1}`;
        
        if (!result[monthYear]) {
          result[monthYear] = 0;
        }
        result[monthYear]++;
        return result;
      }, {});

      // Extract month-year labels and crime counts
      const labels = Object.keys(groupedData);
      const counts = Object.values(groupedData);

      createLineGraph(labels, counts);
    }

    function createLineGraph(labels, counts) {
      const trace = {
        x: labels,
        y: counts,
        type: 'line',
        mode: 'lines+markers',
        marker: { color: 'red' },
      };

      const layout = {
        title: 'Crime Trend',
        xaxis: { title: 'Month-Year' },
        yaxis: { title: 'Crime Count' },
      };

      Plotly.newPlot('line-graph', [trace], layout);
    }
});

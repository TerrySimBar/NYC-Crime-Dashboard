from flask import Flask, jsonify, render_template
import sqlite3
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

# Define your routes and other configurations below

app = Flask(__name__)

# Start at the home page, list all routes that are available.   
@app.route("/")
def home():
    return render_template("index.html")
    # return (
    #     f"Welcome to the NYC Crime 2022 API!<br/>"
    #     f"/api/v1.0/NYC_all_crime<br/>"
    #     f"/api/v1.0/NYC_borough_summary/BRONX<br/>"
    #     f"/api/v1.0/NYC_borough_summary/BROOKLYN<br/>"
    #     f"/api/v1.0/NYC_borough_summary/QUEENS<br/>"
    #     f"/api/v1.0/NYC_borough_summary/STATEN ISLAND<br/>"
    #     f"/api/v1.0/NYC_borough_summary/MANHATTAN<br/>"
    # )

# Define a route to retrieve and return the data as JSON
@app.route('/api/v1.0/NYC_all_crime', methods=['GET'])
def get_nyc_crime_data():
    # Create a database connection
    conn = sqlite3.connect('NYC_Crime.db')
    
    # Create a cursor to execute SQL queries
    cursor = conn.cursor()
    
    # Execute the query
    cursor.execute("SELECT * FROM NYC_Crimes")
    
    # Fetch all results
    results = cursor.fetchall()
    
    # Create a list of dictionaries to store the data
    data = []
    for row in results:
        data.append({
            'Complaint No.': row[0],
            'Complaint Date': row[1],
            'Offense': row[2],
            'Law Cat': row[3],
            'Borough': row[4],
            'Latitude': row[5],
            'Longitude': row[6]
        })


    # Close the cursor and the connection
    cursor.close()
    conn.close()
    
    # Return the data as JSON
    return jsonify(data)


@app.route('/api/v1.0/NYC_borough_summary/<borough>')
def borough_summary(borough):
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect('NYC_Crime.db')
        cursor = conn.cursor()

        # Define a query to fetch crime data for the specified borough
        query = "SELECT * FROM NYC_Crimes WHERE Borough = ?"
        
        # Execute the query with the specified borough
        cursor.execute(query, (borough,))

        # Fetch the column names from the cursor.description
        columns = [column[0] for column in cursor.description]

        # Fetch all records that match the query and create a list of dictionaries
        borough_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()

        # Calculate crime summaries 
        total_crimes = len(borough_data)
        
        # Group the data by 'Law Cat' and count occurrences
        law_cat_summary = {}
        for record in borough_data:
            law_cat = record['Law Cat']
            if law_cat in law_cat_summary:
                law_cat_summary[law_cat] += 1
            else:
                law_cat_summary[law_cat] = 1

        # Create a dictionary with the summaries
        summary = {
            'Borough': borough,
            'Total Crimes': total_crimes,
            'Law Cat Summary': law_cat_summary   
        }
 # Return the summary as JSON
        return jsonify(summary) 

    except sqlite3.Error as e:
        return jsonify({'error': 'Database error: ' + str(e)})

if __name__ == '__main__':
    app.run()

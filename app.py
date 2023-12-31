# Import dependencies   
from flask import Flask, jsonify, render_template
import sqlite3

app = Flask(__name__)


# Define the home route and return the index.html template to use flask server  
@app.route("/")
def home():
    return render_template("index.html")


# Define a route to retrieve and return the complete data as JSON
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


# Define a route to retrieve the FELONY summary for the Plotly.js chart 
@app.route('/api/v1.0/FELONY_summary')
def felony_summary():
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect('NYC_Crime.db')
        cursor = conn.cursor()

        # Define a query to fetch FELONY data grouped by borough
        query = 'SELECT Borough, COUNT(*) as FelonyCount FROM NYC_Crimes WHERE "Law Cat" = "FELONY" GROUP BY Borough'

        # Execute the query
        cursor.execute(query)

        # Fetch the column names from the cursor.description
        columns = [column[0] for column in cursor.description]

        # Fetch all records that match the query and create a list of dictionaries
        felony_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()

        # Create a dictionary with the FELONY summaries
        summary = {
            'FELONY Data': felony_data
        }


        # Return the summary as JSON
        return jsonify(summary)

    except Exception as e:
        return jsonify({'error': str(e)})


# Define a route to retrieve the MISDEMEANOR summary for the Plotly.js chart 
@app.route('/api/v1.0/MISDEMEANOR_summary')
def misdemeanor_summary():
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect('NYC_Crime.db')
        cursor = conn.cursor()

        # Define a query to fetch MISDEMEANOR data grouped by borough
        query = 'SELECT Borough, COUNT(*) as MisdemeanorCount FROM NYC_Crimes WHERE "Law Cat" = "MISDEMEANOR" GROUP BY Borough'

        # Execute the query
        cursor.execute(query)

        # Fetch the column names from the cursor.description
        columns = [column[0] for column in cursor.description]

        # Fetch all records that match the query and create a list of dictionaries
        misdemeanor_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()

        # Create a dictionary with the MISDEMEANOR summaries
        summary = {
            'MISDEMEANOR Data': misdemeanor_data
        }

  # Return the summary as JSON
        return jsonify(summary)

    except Exception as e:
        return jsonify({'error': str(e)})


# Define a route to retrieve the VIOLATION summary for the Plotly.js chart 
@app.route('/api/v1.0/VIOLATION_summary')
def violation_summary():
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect('NYC_Crime.db')
        cursor = conn.cursor()

        # Define a query to fetch VIOLATION data grouped by borough
        query = 'SELECT Borough, COUNT(*) as ViolationCount FROM NYC_Crimes WHERE "Law Cat" = "VIOLATION" GROUP BY Borough'

        # Execute the query
        cursor.execute(query)

        # Fetch the column names from the cursor.description
        columns = [column[0] for column in cursor.description]

        # Fetch all records that match the query and create a list of dictionaries
        violation_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()

        # Create a dictionary with the VIOLATION summaries
        summary = {
            'VIOLATION Data': violation_data
        }

  # Return the summary as JSON
        return jsonify(summary)

    except Exception as e:
        return jsonify({'error': str(e)})


# Define a route to retrieve the borough summary for the leaflet map markers
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
    app.run(debug=True)
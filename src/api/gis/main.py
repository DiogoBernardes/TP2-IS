import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.database import Database

# Configurações do Flask
PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000
app = Flask(__name__)
app.config["DEBUG"] = True

CORS(app)  

db = Database()

@app.route('/api/countries', methods=['GET'])
def get_countries():
    query = f'SELECT id, name, geom FROM "Country";'
    
    try:
        countries = db.selectAll(query)
        country_list = []
        for country in countries:
            country_dict = {
                'id': country[0],
                'name': country[1],
                'geom': country[2],  
            }
            country_list.append(country_dict)

        return jsonify(country_list)

    except Exception as e:
        print("Error fetching countries:", e)
        return jsonify({"error": "Error fetching countries"}), 500

@app.route('/api/customers', methods=['GET'])
def get_all_customers():
    try:
        customers_query = 'SELECT id, country_id FROM "Customer";'
        customers_data = db.selectAll(customers_query)

        customer_list = []

        for customer_data in customers_data:
            customer_id = customer_data[0]
            country_id = customer_data[1]

            coordinates_query = f'SELECT geom FROM "Country" WHERE id = {country_id};'
            coordinates = db.selectOne(coordinates_query)

            if not coordinates:
                return jsonify({"error": f"Country with ID {country_id} not found"}), 404

            customer_info = {
                "customer_id": customer_id,
                "country_id": country_id,
                "coordinates": coordinates[0]
            }

            customer_list.append(customer_info)

        return jsonify(customer_list)

    except Exception as e:
        print("Error fetching all customers:", e)
        return jsonify({"error": f"Error fetching all customers: {str(e)}"}), 500

@app.route('/api/countries/<int:country_id>', methods=['PATCH'])
def update_country_coordinates(country_id):
    try:
        data = request.get_json()

        if 'geom' not in data:
            return jsonify({"error": "Missing 'geom' field in the request body"}), 400

        print("Received GeoJSON:", data['geom'])
        update_query = 'UPDATE "Country" SET geom = %s WHERE id = %s;'
        db.update(update_query, (data['geom'], country_id))

        return jsonify({"message": f"Coordinates updated for country with ID {country_id}"}), 200

    except Exception as e:
        print("Error updating coordinates:", e)
        return jsonify({"error": f"Error updating coordinates: {str(e)}"}), 500


@app.route('/api/countries/<int:country_id>/customer-count', methods=['GET'])
def get_customer_count_by_country(country_id):
    try:
        country_query = f'SELECT id FROM "Country" WHERE id = {country_id};'
        country_exists = db.selectOne(country_query)

        if not country_exists:
            return jsonify({"error": f"Country with ID {country_id} not found"}), 404

        customer_count_query = f'SELECT COUNT(id) FROM "Customer" WHERE country_id = {country_id};'
        customer_count = db.selectOne(customer_count_query)

        return jsonify({"country_id": country_id, "customer_count": customer_count[0]})

    except Exception as e:
        print("Error fetching customer count by country:", e)
        return jsonify({"error": f"Error fetching customer count by country: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)

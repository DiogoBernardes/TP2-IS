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
    query = f'SELECT * FROM "Country";'
    
    try:
        countries = db.selectAll(query)
        country_list = []
        for country in countries:
            country_dict = {
                'id': country[0],
                'name': country[1],
            }
            country_list.append(country_dict)

        return jsonify(country_list)

    except Exception as e:
        print("Error fetching countries:", e)
        return jsonify({"error": "Error fetching countries"}), 500
    
@app.route('/api/countries/<int:country_id>', methods=['PUT'])
def update_country_coordinates(country_id):
    try:
        # Obtenha os dados do corpo da solicitação
        data = request.get_json()

        # Certifique-se de que o corpo da solicitação contém o campo 'geom'
        if 'geom' not in data:
            return jsonify({"error": "Missing 'geom' field in the request body"}), 400

        print("Received GeoJSON:", data['geom'])
        update_query = f'UPDATE "Country" SET geom = %s WHERE id = %s;'
        db.update(update_query, (data['geom'], country_id))

        return jsonify({"message": f"Coordinates updated for country with ID {country_id}"}), 200

    except Exception as e:
        print("Error updating coordinates:", e)
        return jsonify({"error": f"Error updating coordinates: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)

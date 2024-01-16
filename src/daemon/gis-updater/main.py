import sys
import time
from flask import json
import pika
import requests

API_BASE_URL = "http://api-gis:8080"
POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 30
ENTITIES_PER_ITERATION = int(sys.argv[2]) if len(sys.argv) >= 3 else 10

def fetch_data_from_api(endpoint):
    try:
        response = requests.get(f"{API_BASE_URL}/{endpoint}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from API: {e}")
        return None

def get_coordinates_by_country_name(country_name):
    base_url = "https://nominatim.openstreetmap.org/search"
    
    params = {
        "q": country_name,
        "format": "json",
        "limit": 1
    }

    try:
        response = requests.get(base_url, params=params)
        data = response.json()

        if data:
            latitude = data[0]["lat"]
            longitude = data[0]["lon"]
            geojson = {
                "type": "Point",
                "coordinates": [float(longitude), float(latitude)]
            }
            return geojson
        else:
            print(f"Não foi possível encontrar coordenadas para o país: {country_name}")
            return None
    except Exception as e:
        print(f"Erro ao obter coordenadas: {str(e)}")
        return None

def callback(ch, method, properties, body):

    print(f"Received message: {body.decode()}")

    countries_data = fetch_data_from_api("api/countries")
    if countries_data:
        # Processa dados dos países
        for country in countries_data:
            country_name = country.get("name")

            if country_name:
                # Obtém coordenadas
                coordinates = get_coordinates_by_country_name(country_name)

                if coordinates:
                    country_id = country.get("id")
                    update_url = f"{API_BASE_URL}/api/countries/{country_id}"
                    update_data = {"geom": json.dumps(coordinates)}

                    try:
                        response = requests.put(update_url, json=update_data)
                        response.raise_for_status()
                        print(f"Country: {country_name}, Coordinates: {coordinates} - Coordinates updated successfully.")
                    except requests.exceptions.RequestException as e:
                        print(f"Failed to update coordinates for {country_name}: {e}")
            else:
                print("Country name is missing in the data.")

    else:
        print("Failed to fetch data from API.")

def consume_messages():
    # Conectar ao RabbitMQ
    credentials = pika.PlainCredentials('is', 'is')
    parameters = pika.ConnectionParameters('rabbitmq', 5672, 'is', credentials=credentials)

    try:
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()

        # Declare a fila 'geom' com durabilidade consistente
        channel.queue_declare(queue='geom', durable=True)

        # Configurar o callback para processar as mensagens
        channel.basic_consume(queue='geom', on_message_callback=callback, auto_ack=True)

        print(f"Waiting for messages from the 'geom' queue...")
        # Iniciar a escuta de mensagens
        channel.start_consuming()

    except pika.exceptions.ProbableAccessDeniedError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    while True:
        # Consumir mensagens
        consume_messages()

        time.sleep(POLLING_FREQ)

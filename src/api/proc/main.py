import sys

from flask import Flask, request
from flask_cors import CORS
from xmlrpc.client import ServerProxy

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000

app = Flask(__name__)
app.config["DEBUG"] = True

CORS(app)  

@app.route('/api/fetchDocuments', methods=['GET'])
def fetchDocuments():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.index()
    except Exception as e:
        print(e)
        return[]
    
    
@app.route('/api/brands', methods=['GET'])
def fetch_brands():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.fetch_brands()
    except Exception as e:
        print(e)
        return[]
    
    

@app.route('/api/models', methods=['GET'])
def get_models():
    brand_name = request.args.get('brandName')
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.fetch_car_models(brand_name)
    except Exception as e:
        print(e)
        return []

    
@app.route('/api/perCountry', methods=['GET'])
def fetch_per_country():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.sales_per_country()
    except Exception as e:
        print(e)
        return[]
    
@app.route('/api/oldestCarSold', methods=['GET'])
def get_oldest_sold_car_details():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.oldest_sold_car_details()
    except Exception as e:
        print(e)
        return[]
    
@app.route('/api/newestCarSold', methods=['GET'])
def newest_sold_car_details():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.newest_sold_car_details()
    except Exception as e:
        print(e)
        return[]
    
@app.route('/api/mostSoldColors', methods=['GET'])
def most_sold_colors():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.most_sold_colors()
    except Exception as e:
        print(e)
        return[]
    
   
@app.route('/api/mostSoldBrands', methods=['GET'])
def most_sold_brands():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.most_sold_brands()
    except Exception as e:
        print(e)
        return[]
    
   
   
@app.route('/api/mostSoldModels', methods=['GET'])
def most_sold_models():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.most_sold_models()
    except Exception as e:
        print(e)
        return[]
    
   
   
@app.route('/api/carYear', methods=['GET'])
def carYear():
    server = ServerProxy("http://rpc-server:9000")
    
    try:
        return server.carYear()
    except Exception as e:
        print(e)
        return[]
    
   

 
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)

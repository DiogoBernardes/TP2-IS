import signal, sys, logging
from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

from functions.queries import fetch_car_models,fetch_brands,sales_per_country, newest_sold_car_details, oldest_sold_car_details, car_year, most_sold_brands, most_sold_colors, most_sold_models, file_exists,index

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
if __name__ == "__main__":
    class RequestHandler(SimpleXMLRPCRequestHandler):
        rpc_paths = ('/RPC2',)
        allow_headers = ['Content-Type']
        allow_methods = ['POST', 'GET']

    with SimpleXMLRPCServer(('0.0.0.0', PORT), requestHandler=RequestHandler) as server:
        server.register_introspection_functions()

        def signal_handler(signum, frame):
            logger.info("Received signal. Shutting down the server gracefully.")
            server.server_close()
            logger.info("Server shutdown complete.")
            sys.exit(0)
          

        # signals
        signal.signal(signal.SIGTERM, signal_handler)
        signal.signal(signal.SIGHUP, signal_handler)
        signal.signal(signal.SIGINT, signal_handler)

        # register both functions
        server.register_function(index)
        server.register_function(fetch_brands)
        server.register_function(fetch_car_models)
        server.register_function(sales_per_country)
        server.register_function(oldest_sold_car_details)
        server.register_function(newest_sold_car_details)
        server.register_function(most_sold_colors)
        server.register_function(most_sold_brands)
        server.register_function(most_sold_models)
        server.register_function(car_year)
        server.register_function(file_exists)
        
        # start the server
        print(f"Starting the RPC Server in port {PORT}...")
        logger.info(f"Starting the RPC Server on port {PORT}...")
        server.serve_forever()

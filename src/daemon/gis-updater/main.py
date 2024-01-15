import sys
import time
import pika

POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 30
ENTITIES_PER_ITERATION = int(sys.argv[2]) if len(sys.argv) >= 3 else 10

def callback(ch, method, properties, body):
    # Este é o callback que será chamado quando uma mensagem for recebida da fila
    print(f"Received message: {body.decode()}")

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

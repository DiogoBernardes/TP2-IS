package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/streadway/amqp"
)

const (
	rabbitMQURL = "amqp://is:is@rabbitmq:5672/is"
	queueName   = "tasks"
)

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func consumeFromBroker() {
	conn, err := amqp.Dial(rabbitMQURL)
	checkErr(err)
	defer conn.Close()

	ch, err := conn.Channel()
	checkErr(err)
	defer ch.Close()

	q, err := ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	checkErr(err)

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	checkErr(err)

	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, syscall.SIGINT, syscall.SIGTERM)

	fmt.Println("A aguardar mensagens do RabbitMQ. Pressione Ctrl+C para sair.")

	for {
		select {
		case msg := <-msgs:
			processMessage(msg.Body)
		case <-stopChan:
			fmt.Println("Parando o consumidor do RabbitMQ.")
			return
		}
	}
}

func processMessage(body []byte) {
	message := string(body)
	fmt.Printf("Mensagem Recebida: %s\n", message)
}

func main() {
	consumeFromBroker()
}

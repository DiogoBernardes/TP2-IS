package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/antchfx/xmlquery"
	"github.com/go-resty/resty/v2"
	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
)

const (

	rabbitMQURL = "amqp://is:is@rabbitmq:5672/is"
	queueName   = "tasks"

	dbUser      = "is"
	dbPassword  = "is"
	dbName      = "is"
	dbHost		= "db-xml"
	port		= "5432"

	//API's
	apiCountry 	= "http://api-entities:8080/countries/create"
)

type Message struct {
	FileName  string `json:"file_name"`
	CreatedOn string `json:"created_on"`
	UpdatedOn string `json:"updated_on"`
}

func connectDB() *sql.DB {
	connStrXml := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=disable",
		dbUser, dbPassword, dbName, dbHost, port)

	db, err := sql.Open("postgres", connStrXml)
	if err != nil {
		log.Fatal("Erro ao conectar ao banco de dados:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Erro ao fazer ping no banco de dados:", err)
	}

	return db
}


func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// receber mensagem do rabbit
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

// ir buscar xml à bd
func retrieveXMLContent(db *sql.DB, fileName string) (string, error) {
	query := `
		SELECT xml
		FROM imported_documents
		WHERE file_name = $1 AND deleted_on IS NULL 
	`

	var xmlContent string
	err := db.QueryRow(query, fileName).Scan(&xmlContent)
	if err != nil {
		return "", err
	}

	return xmlContent, nil
}

// MIGRAÇÕES
func migrateCountry(fileName string, xmlContent string) error {
	doc, err := xmlquery.Parse(strings.NewReader(xmlContent))
	if err != nil {
		return err
	}

	root := xmlquery.FindOne(doc, "//Dealership")
	if root == nil {
		return fmt.Errorf("Formato XML inválido: nó raiz não encontrado")
	}

	countries := xmlquery.Find(doc, "//Countries/Country")
	for _, country := range countries {
		var name string

		for _, attr := range country.Attr {
			if attr.Name.Local == "name" {
				name = attr.Value
				break
			}
		}

		fmt.Printf("nome:%s\n", name)

		// Montar o payload JSON apenas com o nome
		payload := map[string]string{"name": name}
		jsonData, err := json.Marshal(payload)
		if err != nil {
			return err
		}

		fmt.Println("Enviando solicitação para a API...")

		client := resty.New()
		resp, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(jsonData).
			Post(apiCountry)

		if err != nil {
			log.Println("Erro ao enviar solicitação:", err)
			return err
		}

		log.Printf("Resposta da API: Status %d\n", resp.StatusCode())

		if resp.StatusCode() != 201 {
			return fmt.Errorf("Falha ao chamar a API. Status: %d", resp.StatusCode())
		}

		log.Printf("Corpo da resposta: %s\n", resp.Body())
		
		time.Sleep(1 * time.Millisecond)
	}

	return nil
}

// função principal
func processMessage(body []byte) {
	var msg Message
	err := json.Unmarshal(body, &msg)
	if err != nil {
		log.Printf("Erro ao decodificar a mensagem JSON: %s\n", err)
		return
	}

	fmt.Printf("Mensagem Recebida: %+v\n", msg)
	log.Printf("Processando mensagem: %+v", msg)

	// Conectar à db-xml
	db := connectDB()
	defer db.Close()

	xmlContent, err := retrieveXMLContent(db, msg.FileName)
	if err != nil {
		log.Printf("Erro ao obter conteúdo XML para o arquivo %s: %s\n", msg.FileName, err)
		return
	}

	err = migrateCountry(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar país: %s", err)
		return
	}

	log.Println("Migração de país concluída com sucesso")
	
}

func main() {
	consumeFromBroker()
}


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
	apiCountriesCreate	=	"http://api-entities:8080/countries/create"
	apiCountriesDel		=	"http://api-entities:8080/countries/delete-all"
	apiBrandsCreate		=	"http://api-entities:8080/brands/create"
	apiBrandsDel		=	"http://api-entities:8080/brands/delete-all"
	apiModelsCreate		=	"http://api-entities:8080/models/create"
	apiModelsDel		=	"http://api-entities:8080/models/delete-all"
	apiCardsCreate		=	"http://api-entities:8080/credit-card-types/create"
	apiCardsDel			=	"http://api-entities:8080/credit-card-types/delete-all"
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

var restyClient = resty.New()

//CLEAR DB
func deleteAllData() error {
    
	// Adicionar a SALE
    
	//Adiciona a CAR

	//Adicionar Customer

    // Limpar dados de modelos
    if err := deleteAndCheck(apiModelsDel); err != nil {
        log.Printf("Erro ao limpar dados de modelos: %s\n", err)
        return err
    }

	// Limpar dados de marcas
    if err := deleteAndCheck(apiBrandsDel); err != nil {
        log.Printf("Erro ao limpar dados de marcas: %s\n", err)
        return err
    }

	// Limpar dados de países
    if err := deleteAndCheck(apiCountriesDel); err != nil {
        log.Printf("Erro ao limpar dados de países: %s\n", err)
        return err
    }

	if err := deleteAndCheck(apiCardsDel); err != nil {
        log.Printf("Erro ao limpar dados de países: %s\n", err)
        return err
    }

    return nil
}

func deleteAndCheck(apiURL string) error {
	resp, err := restyClient.R().
		SetHeader("Content-Type", "application/json").
		Delete(apiURL)

	if err != nil {
		log.Printf("Erro ao enviar solicitação para limpar dados: %s\n", err)
		return err
	}

	if resp.StatusCode() != 200 {
		return fmt.Errorf("Falha ao chamar a API. Status: %d", resp.StatusCode())
	}

	log.Printf("Resposta API de remoção: Status %d - Sucesso\n", resp.StatusCode())

	return nil
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

		payload := map[string]string{"name": name}
		jsonData, err := json.Marshal(payload)
		if err != nil {
			return err
		}

		client := resty.New()
		resp, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(jsonData).
			Post(apiCountriesCreate)

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

func migrateCreditCard(fileName string, xmlContent string) error {

	doc, err := xmlquery.Parse(strings.NewReader(xmlContent))
	if err != nil {
		return err
	}

	root := xmlquery.FindOne(doc, "//Dealership")
	if root == nil {
		return fmt.Errorf("Formato XML inválido: nó raiz não encontrado")
	}

	cards := xmlquery.Find(doc, "//CardTypes/CreditCard_Type")
	for _, card := range cards {
		var name string

		for _, attr := range card.Attr {
			if attr.Name.Local == "name" {
				name = attr.Value
				break
			}
		}

		payload := map[string]string{"name": name}
		jsonData, err := json.Marshal(payload)
		if err != nil {
			return err
		}

		client := resty.New()
		resp, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(jsonData).
			Post(apiCardsCreate)

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

func migrateBrandsAndModels(fileName string, xmlContent string) error {

	err := deleteAndCheck(apiBrandsDel)
	if err != nil {
		log.Printf("Erro ao limpar dados das marcas: %s\n", err)
		return err
	}

	doc, err := xmlquery.Parse(strings.NewReader(xmlContent))
	if err != nil {
		return err
	}

	root := xmlquery.FindOne(doc, "//Dealership")
	if root == nil {
		return fmt.Errorf("Formato XML inválido: nó raiz não encontrado")
	}

	brands := xmlquery.Find(doc, "//Brands/Brand")
	for _, brand := range brands {
		var brandID, brandName string

		// Obter o ID e o nome da marca
		for _, attr := range brand.Attr {
			switch attr.Name.Local {
			case "id":
				brandID = attr.Value
			case "name":
				brandName = attr.Value
			}
		}

		// Montar o payload JSON apenas com o nome da marca
		brandPayload := map[string]string{"name": brandName}
		brandJSON, err := json.Marshal(brandPayload)
		if err != nil {
			return err
		}

		// Enviar solicitação para criar a marca
		client := resty.New()
		respBrand, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(brandJSON).
			Post(apiBrandsCreate)

		if err != nil {
			log.Println("Erro ao enviar solicitação para criar a marca:", err)
			return err
		}

		log.Printf("Resposta da API Brands: Status %d\n", respBrand.StatusCode())

		if respBrand.StatusCode() != 201 {
			log.Printf("Falha ao chamar a API Brands. Status: %d\n", respBrand.StatusCode())
			log.Printf("Corpo da resposta: %s\n", respBrand.Body())
			return fmt.Errorf("Falha ao chamar a API Brands. Status: %d", respBrand.StatusCode())
		}

		err1 := deleteAndCheck(apiModelsDel)
		if err1 != nil {
			log.Printf("Erro ao limpar dados do modelo: %s\n", err1)
			return err1
		}

		// Obter os modelos para a marca atual
		models := xmlquery.Find(brand, "//Models/Model")
		for _, model := range models {
			var modelName string

			// Obter o nome do modelo
			for _, attr := range model.Attr {
				if attr.Name.Local == "name" {
					modelName = attr.Value
					break
				}
			}

			// Montar o payload JSON com o nome do modelo e a referência à marca
			modelPayload := map[string]interface{}{"name": modelName, "brand_id": brandID}
			modelJSON, err := json.Marshal(modelPayload)
			if err != nil {
				return err
			}

			// Enviar solicitação para criar o modelo associado à marca
			respModel, err := client.R().
				SetHeader("Content-Type", "application/json").
				SetBody(modelJSON).
				Post(apiModelsCreate)

			if err != nil {
				log.Println("Erro ao enviar solicitação para criar o modelo:", err)
				return err
			}

			log.Printf("Resposta da API Models: Status %d\n", respModel.StatusCode())

			if respModel.StatusCode() != 201 {
				log.Printf("Falha ao chamar a API Models. Status: %d\n", respModel.StatusCode())
				log.Printf("Corpo da resposta: %s\n", respModel.Body())
				return fmt.Errorf("Falha ao chamar a API Models. Status: %d", respModel.StatusCode())
			}

			log.Printf("Corpo da resposta: %s\n", respModel.Body())
			// Aguardar um curto intervalo entre as criações de modelos
			time.Sleep(1 * time.Millisecond)
		}

		log.Printf("Corpo da resposta: %s\n", respBrand.Body())
		// Aguardar um curto intervalo entre as criações de marcas
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

	if err := deleteAllData(); err != nil {
        log.Printf("Erro ao limpar todos os dados: %s\n", err)
        return
    }

	err = migrateCountry(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar país: %s", err)
		return
	}

	err = migrateCreditCard(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar cards: %s", err)
		return
	}

	// err = migrateBrandsAndModels(msg.FileName, xmlContent)
	// if err != nil {
	// 	log.Printf("Erro ao migrar marcas e países: %s", err)
	// 	return
	// }

	log.Println("Migração concluída com sucesso")
	
}

func main() {
	consumeFromBroker()
}


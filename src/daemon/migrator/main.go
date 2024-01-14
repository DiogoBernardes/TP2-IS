package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
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
	apiUrl 				=	"http://api-entities:8080"
	create				=	"/create"
	delete_all			=	"/delete-all"
	byName				=	"/by-name"
	countriesApi		=	"/countries"
	carsApi				=	"/cars"
	cardsApi			=	"/credit-card-types"
	brandsApi			=	"/brands"
	customersApi		=	"/customers"
	salesApi			=	"/sales"
	modelsApi			=	"/models"

	apiCountriesCreate	=	"http://api-entities:8080/countries/create"
	apiCountriesDel		=	"http://api-entities:8080/countries/delete-all"
	apiCountriesByName 	= 	"http://api-entities:8080/countries/by-name"

	apiCardsCreate		=	"http://api-entities:8080/credit-card-types/create"
	apiCardsDel			=	"http://api-entities:8080/credit-card-types/delete-all"

	apiBrandsCreate		=	"http://api-entities:8080/brands/create"
	apiBrandsDel		=	"http://api-entities:8080/brands/delete-all"
	apiBrandsByName		=	"http://api-entities:8080/brands/by-name"	

	apiModelsCreate		=	"http://api-entities:8080/models/create"
	apiModelsDel		=	"http://api-entities:8080/models/delete-all"
	apiModelsByName		=	"http://api-entities:8080/models/by-name"

	apiCustomersCreate	=	"http://api-entities:8080/customers/create"
	apiCustomersDel		=	"http://api-entities:8080/customers/delete-all"

	apiCarsCreate		=	"http://api-entities:8080/cars/create"
	apiCarsDel			=	"http://api-entities:8080/cars/delete-all"

	apiSalesCreate		=	"http://api-entities:8080/sales/create"
	apiSalesDel			=	"http://api-entities:8080/sales/delete-all"

)


// STRUCTS
type Message struct {
	FileName  string `json:"file_name"`
	CreatedOn string `json:"created_on"`
	UpdatedOn string `json:"updated_on"`
}

type Model struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    BrandID  int    `json:"brand_id"`
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

//CLEAR DB DATA
func deleteAllData() error {
    
	if err := deleteAndCheck(apiUrl + salesApi + delete_all); err != nil {
        log.Printf("Erro ao limpar dados de sales: %s\n", err)
        return err
    }
	if err := deleteAndCheck(apiUrl + carsApi + delete_all); err != nil {
        log.Printf("Erro ao limpar dados dos cars: %s\n", err)
        return err
    }
	if err := deleteAndCheck(apiUrl + customersApi + delete_all); err != nil {
        log.Printf("Erro ao limpar dados dos customers: %s\n", err)
        return err
    }
    if err := deleteAndCheck(apiUrl + modelsApi + delete_all); err != nil {
        log.Printf("Erro ao limpar dados de modelos: %s\n", err)
        return err
    }
    if err := deleteAndCheck(apiUrl + brandsApi + delete_all); err != nil {
        log.Printf("Erro ao limpar dados de marcas: %s\n", err)
        return err
    }
    if err := deleteAndCheck(apiUrl + countriesApi + delete_all); err != nil {
        log.Printf("Erro ao limpar dados de países: %s\n", err)
        return err
    }
	if err := deleteAndCheck(apiUrl + cardsApi + delete_all); err != nil {
        log.Printf("Erro ao limpar dados dos cards: %s\n", err)
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

// GETS
func getCountryIDByName(name string) (int, error) {

    resp, err := resty.New().
        R().
        Get(fmt.Sprintf("%s/%s", apiCountriesByName, name))

    if err != nil {
    	log.Printf("Erro ao enviar solicitação para obter o ID do país pelo nome: %s\n", err)
        return 0, err
    }

    if resp.StatusCode() != 200 {
        log.Printf("Falha ao chamar a API Countries por nome. Status: %d\n", resp.StatusCode())
        return 0, fmt.Errorf("Falha ao chamar a API Countries por nome. Status: %d", resp.StatusCode())
    }

    var countryID int
    err = json.Unmarshal(resp.Body(), &countryID)
    if err != nil {
        log.Printf("Erro ao decodificar a resposta do ID do país: %s\n", err)
        return 0, err
    }

    return countryID, nil
}

func getModelIDByName(name string) (int, error) {

    resp, err := resty.New().
        R().
        Get(fmt.Sprintf("%s/%s", apiModelsByName, name))

    if err != nil {
		log.Printf("Erro ao obter o ID do modelo pelo nome: %s\n", err)
        return 0, err
    }

    if resp.StatusCode() != 200 {
        log.Printf("Falha ao chamar a API Models por nome. Status: %d\n", resp.StatusCode())
        return 0, fmt.Errorf("Falha ao chamar a API Models por nome. Status: %d", resp.StatusCode())
    }

    var modelID int
    err = json.Unmarshal(resp.Body(), &modelID)
    if err != nil {
        log.Printf("Erro ao decodificar a resposta do ID do modelo: %s\n", err)
        return 0, err
    }

    return modelID, nil
}

func getAllModels() ([]Model, error) {
    resp, err := resty.New().
        R().
        Get(fmt.Sprintf("%s/models", apiUrl))

    if err != nil {
        log.Printf("Erro ao obter todos os modelos: %s\n", err)
        return nil, err
    }

    if resp.StatusCode() != 200 {
        log.Printf("Falha ao chamar a API Models. Status: %d\n", resp.StatusCode())
        return nil, fmt.Errorf("Falha ao chamar a API Models. Status: %d", resp.StatusCode())
    }

    var models []Model
    err = json.Unmarshal(resp.Body(), &models)
    if err != nil {
        log.Printf("Erro ao decodificar a resposta dos modelos: %s\n", err)
        return nil, err
    }

    return models, nil
}

func getCustomerIDByName(firstName string, lastName string) (int, error) {
    resp, err := resty.New().
        R().
        Get(fmt.Sprintf("%s/customers/get-id/%s/%s", apiUrl, firstName, lastName))

    if err != nil {
        log.Printf("Erro ao enviar solicitação para obter o ID do cliente pelo nome: %s\n", err)
        return 0, err
    }

    if resp.StatusCode() != 200 {
        log.Printf("Falha ao chamar a API Customers por nome. Status: %d\n", resp.StatusCode())
        return 0, fmt.Errorf("Falha ao chamar a API Customers por nome. Status: %d", resp.StatusCode())
    }

    var customerID int
    err = json.Unmarshal(resp.Body(), &customerID)
    if err != nil {
        log.Printf("Erro ao decodificar a resposta do ID do cliente: %s\n", err)
        return 0, err
    }

    return customerID, nil
}

func getCreditCardTypeIDByName(name string) (int, error) {
    resp, err := resty.New().
        R().
        Get(fmt.Sprintf("%s%s/by-name/%s", apiUrl, cardsApi, name))

    if err != nil {
        log.Printf("Erro ao enviar solicitação para obter o ID do tipo de cartão de crédito pelo nome: %s\n", err)
        return 0, err
    }

    if resp.StatusCode() != 200 {
        log.Printf("Falha ao chamar a API CreditCardTypes por nome. Status: %d\n", resp.StatusCode())
        return 0, fmt.Errorf("Falha ao chamar a API CreditCardTypes por nome. Status: %d", resp.StatusCode())
    }

    var cardID int
    err = json.Unmarshal(resp.Body(), &cardID)
    if err != nil {
        log.Printf("Erro ao decodificar a resposta do ID do tipo de cartão de crédito: %s\n", err)
        return 0, err
    }

    return cardID, nil
}

func getCarID(color string, year string, modelRef string) (int, error) {

    urlString := fmt.Sprintf("%s%s/find-by-details/%s/%s/%s", apiUrl, carsApi, color, year, modelRef)

    resp, err := resty.New().
        R().
        Get(urlString)

    if err != nil {
        log.Printf("Erro ao obter ID do carro: %s\n", err)
        return 0, err
    }

    if resp.StatusCode() != 200 {
        log.Printf("Falha ao chamar a API Cars. Status: %d\n", resp.StatusCode())
        return 0, fmt.Errorf("Falha ao chamar a API Cars. Status: %d", resp.StatusCode())
    }

    var carID int
    err = json.Unmarshal(resp.Body(), &carID)
    if err != nil {
        log.Printf("Erro ao decodificar a resposta do ID do carro: %s\n", err)
        return 0, err
    }

    return carID, nil
}

var modelsMap map[int]string

func loadAllModels() error {
    models, err := getAllModels()
    if err != nil {
		log.Printf("Error fetching models: %s\n", err)
        return err
    }

    modelsMap = make(map[int]string)
    for _, model := range models {
        modelsMap[model.ID] = model.Name
    }

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

func migrateBrands(fileName string, xmlContent string) error {
    doc, err := xmlquery.Parse(strings.NewReader(xmlContent))
    if err != nil {
        return err
    }

    root := xmlquery.FindOne(doc, "//Dealership")
    if root == nil {
        return fmt.Errorf("Invalid XML format: root node not found")
    }

    brands := xmlquery.Find(doc, "//Brands/Brand")
    for _, brand := range brands {
        var brandName string

        for _, attr := range brand.Attr {
            switch attr.Name.Local {
			case "name":
				brandName = attr.Value
            }
        }

        brandPayload := map[string]string{"name": brandName}
        brandJSON, err := json.Marshal(brandPayload)
        if err != nil {
            return err
        }

        client := resty.New()
        respBrand, err := client.R().
            SetHeader("Content-Type", "application/json").
            SetBody(brandJSON).
            Post(apiBrandsCreate)

        if err != nil {
            log.Println("Error sending request to create brand:", err)
            return err
        }

        if respBrand.StatusCode() != 201 {
            log.Printf("Failed to call API Brands. Status: %d\n", respBrand.StatusCode())
            log.Printf("Response Body: %s\n", respBrand.Body())
            return fmt.Errorf("Failed to call API Brands. Status: %d", respBrand.StatusCode())
        }

        log.Printf("API Brands Response: Status %d\n", respBrand.StatusCode())
        log.Printf("Response Body: %s\n", respBrand.Body())

		respBrandID, err := resty.New().
			R().
			Get(fmt.Sprintf("%s/%s", apiBrandsByName, brandName))

		if err != nil {
            log.Println("Error sending request to get brand ID:", err)
            return err
        }

        if respBrandID.StatusCode() != 200 {
            log.Printf("Failed to call API Brands by Name. Status: %d\n", respBrandID.StatusCode())
            log.Printf("Response Body: %s\n", respBrandID.Body())
            return fmt.Errorf("Failed to call API Brands by Name. Status: %d", respBrandID.StatusCode())
        }

		var brandID int
        if err := json.Unmarshal(respBrandID.Body(), &brandID); err != nil {
            log.Println("Error parsing brand ID response:", err)
            return err
        }

        log.Printf("API Brands by Name Response: Status %d\n", respBrandID.StatusCode())
        log.Printf("%s : %d\n", brandName, brandID)

        if err := migrateModels(brand, brandID); err != nil {
            return err
        }

        time.Sleep(1 * time.Millisecond)
    }

    return nil
}

func migrateModels(brand *xmlquery.Node, brandID int) error {
    models := xmlquery.Find(brand, "//Models/Model")
    for _, model := range models {
        var modelName string

        for _, attr := range model.Attr {
            if attr.Name.Local == "name" {
                modelName = attr.Value
                break
            }
        }

        modelPayload := map[string]interface{}{"name": modelName, "brand_id": brandID}
        modelJSON, err := json.Marshal(modelPayload)
        if err != nil {
            return err
        }
        log.Printf("Model Payload: %s\n", modelJSON)

        client := resty.New()
        respModel, err := client.R().
            SetHeader("Content-Type", "application/json").
            SetBody(modelJSON).
            Post(apiModelsCreate)

        if err != nil {
            log.Println("Error sending request to create model:", err)
            return err
        }

        if respModel.StatusCode() != 201 {
            log.Printf("Failed to call API Models. Status: %d\n", respModel.StatusCode())
            log.Printf("Response Body: %s\n", respModel.Body())
            return fmt.Errorf("Failed to call API Models. Status: %d", respModel.StatusCode())
        }

        log.Printf("API Models Response: Status %d\n", respModel.StatusCode())
        log.Printf("Response Body: %s\n", respModel.Body())

        time.Sleep(1 * time.Millisecond)
    }

    return nil
}

func migrateCustomers(fileName string, xmlContent string) error {
    doc, err := xmlquery.Parse(strings.NewReader(xmlContent))
    if err != nil {
        log.Printf("Error parsing XML: %s\n", err)
        return err
    }

    root := xmlquery.FindOne(doc, "//Dealership")
    if root == nil {
        log.Println("Invalid XML format: root node not found")
        return fmt.Errorf("Invalid XML format: root node not found")
    }

    countryIDMap := make(map[int]int)
    countries := xmlquery.Find(doc, "//Countries/Country")
    for _, country := range countries {
        countryID, err := strconv.Atoi(country.SelectAttr("id"))
        countryName := country.SelectAttr("name")
        if err != nil || countryName == "" {
            log.Printf("Invalid country information: %s\n", err)
            continue
        }

        apiCountryID, err := getCountryIDByName(countryName)
        if err != nil {
            log.Printf("Error getting country ID by name for '%s': %s\n", countryName, err)
            continue
        }

        countryIDMap[countryID] = apiCountryID
    }

    sales := xmlquery.Find(doc, "//Sale")
    for _, sale := range sales {
        customer := xmlquery.FindOne(sale, ".//Customer")
        if customer == nil {
            continue
        }

        firstName := customer.SelectAttr("first_name")
        lastName := customer.SelectAttr("last_name")
        countryRef, err := strconv.Atoi(customer.SelectAttr("country_ref"))
        if err != nil {
            log.Printf("Invalid country_ref for customer: %s %s\n", firstName, lastName)
            continue
        }

        countryID, ok := countryIDMap[countryRef]
        if !ok {
            log.Printf("Country ID not found in the map for: %s %s\n", firstName, lastName)
            continue
        }

        payload := map[string]interface{}{
            "first_name": firstName,
            "last_name":  lastName,
            "country_id": countryID,
        }

        jsonData, err := json.Marshal(payload)
        if err != nil {
            log.Printf("Error marshaling customer data: %s\n", err)
            return err
        }

        resp, err := resty.New().
            R().
            SetHeader("Content-Type", "application/json").
            SetBody(jsonData).
            Post(apiCustomersCreate)

        if err != nil {
            log.Printf("Error sending request to create customer '%s %s': %s\n", firstName, lastName, err)
            return err
        }

        if resp.StatusCode() != 201 {
            log.Printf("Failed to call API Customers for '%s %s'. Status: %d, Body: %s\n", firstName, lastName, resp.StatusCode(), resp.Body())
            continue
        }

        log.Printf("Successfully created customer: %s %s\n", firstName, lastName)
        time.Sleep(1 * time.Millisecond)
    }

    return nil
}

func migrateCars(fileName string, xmlContent string) error{
	doc, err := xmlquery.Parse(strings.NewReader(xmlContent))
	if err != nil {
		log.Printf("Error parsing XML: %s\n", err)
		return err
	}

	modelIDMap := make(map[int]int)
	models := xmlquery.Find(doc, "//Brands/Brand/Models/Model")
	log.Println("Models loaded:")
	for _, model := range models {
		modelID, err := strconv.Atoi(model.SelectAttr("id"))
		modelName := model.SelectAttr("name")
		if err != nil || modelName == "" {
			log.Printf("Invalid model information: %s\n", err)
			continue
		}

		apiModelID, err := getModelIDByName(modelName)
		if err != nil {
			log.Printf("Error getting model ID by name for '%s': %s\n", modelName, err)
			continue
		}

		modelIDMap[modelID] = apiModelID
	}

	sales := xmlquery.Find(doc, "//Sale")
	for _, sale := range sales {
		car := xmlquery.FindOne(sale, ".//Car")
		if car == nil {
			log.Println("Car information not found in Sale. Skipping...")
			continue
		}

		color := car.SelectAttr("color")
		year, err := strconv.Atoi(car.SelectAttr("year"))
		modelRef, err := strconv.Atoi(car.SelectAttr("model_ref"))
		if err != nil || color == "" {
			log.Printf("Invalid car information: %s\n", err)
			continue
		}
		
		modelID, ok := modelIDMap[modelRef]
		if !ok {
			log.Printf("Model ID not found in the map for car\n")
			continue
		}

		payload := map[string]interface{}{
			"color":    color,
			"year":     year,
			"model_id": modelID,
		}

		jsonData, err := json.Marshal(payload)
		if err != nil {
			log.Printf("Error marshaling car data: %s\n", err)
			return err
		}

		resp, err := resty.New().
			R().
			SetHeader("Content-Type", "application/json").
			SetBody(jsonData).
			Post(apiCarsCreate)

		if err != nil {
			log.Printf("Error sending request to create car: %s\n", err)
			return err
		}

		if resp.StatusCode() != 201 {
			log.Printf("Failed to call API Cars. Status: %d, Body: %s\n", resp.StatusCode(), resp.Body())
			continue
		}

		log.Printf("Successfully created car: %s - %d - %d\n", color, year, modelID)
		time.Sleep(1 * time.Millisecond)
	}

	return nil
}

func migrateSales(fileName string, xmlContent string) error {
    doc, err := xmlquery.Parse(strings.NewReader(xmlContent))
    if err != nil {
        log.Printf("Error parsing XML: %s\n", err)
        return err
    }

    salesNodes := xmlquery.Find(doc, "//Dealership/sales/Sale")
    for _, saleNode := range salesNodes {
        carNode := xmlquery.FindOne(saleNode, "./Car")
        if carNode == nil {
            continue
        }

        color := carNode.SelectAttr("color")
        year := carNode.SelectAttr("year")
        modelRef, err := strconv.Atoi(carNode.SelectAttr("model_ref"))
        if err != nil || color == "" {
            log.Printf("Invalid car information in XML: %s\n", err)
            continue
        }

        modelXPath := fmt.Sprintf("//Brands/Brand/Models/Model[@id='%d']", modelRef)
		modelNode := xmlquery.FindOne(doc, modelXPath)
		if modelNode == nil {
			log.Printf("Model not found for model reference: %d\n", modelRef)
			continue
		}

		modelName := modelNode.SelectAttr("name")
		if modelName == "" {
			log.Printf("Model name not found for model reference: %d\n", modelRef)
			continue
		}

        // Obtém o ID do modelo usando o nome do modelo
        modelID, err := getModelIDByName(modelName)
        if err != nil {
            log.Printf("Error getting model ID by name: %s\n", err)
            continue
        }
        
        modelIDStr := strconv.Itoa(modelID)
        // Obtém o ID do carro
        carID, err := getCarID(color, year, modelIDStr)
        if err != nil {
            log.Printf("Error getting car ID: %s\n", err)
            continue
        }

        // Continua com a obtenção de IDs de cliente e tipo de cartão de crédito
        customerNode := xmlquery.FindOne(saleNode, "./Customer")
        firstName := customerNode.SelectAttr("first_name")
        lastName := customerNode.SelectAttr("last_name")
        // Adiciona logs para verificar os nomes
        log.Printf("First Name: %s, Last Name: %s\n", firstName, lastName)
        customerID, err := getCustomerIDByName(firstName, lastName)
        if err != nil {
            log.Printf("Error getting customer ID: %s\n", err)
            continue
        }

        cardNode := xmlquery.FindOne(saleNode, "./CreditCard_Type")
        cardTypeName := cardNode.SelectAttr("name")
        cardTypeID, err := getCreditCardTypeIDByName(cardTypeName)
        if err != nil {
            log.Printf("Error getting card type ID: %s\n", err)
            continue
        }

        salePayload := map[string]int{
            "car_id":               carID,
            "customer_id":          customerID,
            "credit_card_type_id":  cardTypeID,
        }

        jsonData, err := json.Marshal(salePayload)
        if err != nil {
            log.Printf("Error marshaling sale data: %s\n", err)
            return err
        }

        resp, err := resty.New().
            R().
            SetHeader("Content-Type", "application/json").
            SetBody(jsonData).
            Post(apiUrl + salesApi + create)

        if err != nil {
            log.Printf("Error sending request to create sale: %s\n", err)
            return err
        }

        if resp.StatusCode() != 201 {
            log.Printf("Failed to create sale. Status: %d, Body: %s\n", resp.StatusCode(), resp.Body())
		continue
			}

			log.Printf("Sale created successfully: %s\n", resp.Body())
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

	time.Sleep(1 * time.Millisecond)

	err = migrateCountry(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar país: %s", err)
		return
	}

	time.Sleep(1 * time.Millisecond)

	err = migrateCustomers(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar marcas e países: %s", err)
		return
	}

	time.Sleep(1 * time.Millisecond)

	err = migrateCreditCard(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar cards: %s", err)
		return
	}

	time.Sleep(1 * time.Millisecond)

	err = migrateBrands(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar marcas e modelos: %s", err)
		return
	}

	time.Sleep(1 * time.Millisecond)

	err = migrateCars(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar os carros: %s", err)
		return
	}

	time.Sleep(1 * time.Millisecond)

	if err := loadAllModels(); err != nil {
        log.Printf("Erro ao carregar modelos: %s\n", err)
        return
    }

	err = migrateSales(msg.FileName, xmlContent)
	if err != nil {
		log.Printf("Erro ao migrar os carros: %s", err)
		return
	}

	time.Sleep(1 * time.Millisecond)

	log.Println("Migração concluída com sucesso")
	
}

func main() {
	consumeFromBroker()
}


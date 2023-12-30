package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
)

func sayHelloWorld() {
	fmt.Println("Hello, World!!")
}

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

const (
	dbUser      = "is"
	dbPassword  = "is"
	dbName      = "is"
	dbHost      = "localhost"
	port		= "10001"
	rabbitMQURL = "amqp://is:is@rabbitmq:5672/is"
	// queueName   = "tasks"
)

func connectDB() *sql.DB {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=disable",
		dbUser, dbPassword, dbName, dbHost, port)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Erro ao conectar ao banco de dados:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Erro ao fazer ping no banco de dados:", err)
	}

	return db
}

func sendToBroker(jsonfile string, taskType string) {
	conn, err := amqp.Dial(rabbitMQURL)
	if err != nil {
		log.Fatalf("Erro ao se conectar ao RabbitMQ: %s", err)
	}
	defer conn.Close()
}

// 	ch, err := conn.Channel()
// 	if err != nil {
// 		log.Fatalf("Erro ao abrir o canal: %s", err)
// 	}
// 	defer ch.Close()

// 	q, err := ch.QueueDeclare(
// 		queueName,
// 		true,
// 		false,
// 		false,
// 		false,
// 		nil,
// 	)
// 	if err != nil {
// 		log.Fatalf("Erro ao declarar a fila: %s", err)
// 	}

// 	body := fmt.Sprintf(jsonfile)
// 	err = ch.Publish(
// 		"",
// 		q.Name,
// 		false,
// 		false,
// 		amqp.Publishing{
// 			DeliveryMode: amqp.Persistent,
// 			ContentType:  "text/plain",
// 			Body:         []byte(body),
// 		})
// 	if err != nil {
// 		log.Fatalf("Erro ao publicar a mensagem: %s", err)
// 	}

// 	fmt.Println("Mensagem enviada para o RabbitMQ com sucesso!")
// }


// func generateJSONFromPlayer(player Player, countryName string) ([]byte, error) {
	
// 	playerData := map[string]interface{}{
// 		"country_name":  countryName,
// 		"id":            player.ID,
// 		"name":          player.Name,
// 		"age":           player.Age,
// 		"club":          player.Club,
// 		"position":      player.Position,
// 		"overall":       player.Overall,
// 		"pace":          player.Pace,
// 		"shooting":      player.Shooting,
// 		"passing":       player.Passing,
// 		"dribbling":     player.Dribbling,
// 		"defending":     player.Defending,
// 		"physicality":   player.Physicality,
// 		"acceleration":  player.Acceleration,
// 		"sprint":        player.Sprint,
// 		"positioning":   player.Positioning,
// 		"finishing":     player.Finishing,
// 		"shot":          player.Shot,
// 		"long":          player.Long,
// 		"volleys":       player.Volleys,
// 		"penalties":     player.Penalties,
// 		"vision":        player.Vision,
// 		"crossing":      player.Crossing,
// 		"free":          player.Free,
// 		"curve":         player.Curve,
// 		"agility":       player.Agility,
// 		"balance":       player.Balance,
// 		"reactions":     player.Reactions,
// 		"ball":          player.Ball,
// 		"composure":     player.Composure,
// 		"interceptions": player.Interceptions,
// 		"heading":       player.Heading,
// 		"defense":       player.Defense,
// 		"standing":      player.Standing,
// 		"sliding":       player.Sliding,
// 		"jumping":       player.Jumping,
// 		"stamina":       player.Stamina,
// 		"strength":      player.Strength,
// 		"aggression":    player.Aggression,
// 		"att_work_rate": player.AttWorkRate,
// 		"def_work_rate": player.DefWorkRate,
// 		"preferred_foot": player.PreferredFoot,
// 		"weak_foot":      player.WeakFoot,
// 		"skill_moves":    player.SkillMoves,
// 		"url":            player.URL,
// 		"gender":         player.Gender,
// 		"gk":             player.GK,
// 	}

// 	log.Printf("ID: %s, Name: %s, Age: %s, ...", player.ID, player.Name, player.Age)

// 	jsonData, err := json.Marshal(playerData)
// 	if err != nil {
// 		return nil, fmt.Errorf("Error encoding JSON: %v", err)
// 	}

// 	return jsonData, nil
// }

// func readXMLAndSendToBroker(filename string) {
// 	xmlData, err := ioutil.ReadFile(filename)
// 	if err != nil {
// 		log.Println("Error reading XML file:", err)
// 		return
// 	}

// 	var sales Sales
// 	err = xml.Unmarshal(xmlData, &football)
// 	if err != nil {
// 		log.Println("Error decoding XML:", err)
// 		return
// 	}

// 	taskType := "newEntity"

// 	for _, club := range football.Clubs {
// 		for _, nation := range club.Nations {
// 			countryName := nation.Name
// 			for _, player := range nation.Players {
// 				jsonData, err := generateJSONFromPlayer(player, countryName)
// 				if err != nil {
// 					log.Println(err)
// 					continue
// 				}

// 				// Converta jsonData para uma string
// 				jsonString := string(jsonData)

// 				// Envia a mensagem para o RabbitMQ
// 				sendToBroker(jsonString, taskType)
// 			}
// 		}
// 	}
// }

func checkNewXMLFilesEvery60Seconds(db *sql.DB) {
	fmt.Println("Verificando novos arquivos XML a cada 60 segundos:")

	ticker := time.NewTicker(60 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			query := `
				SELECT file_name, created_on
				FROM imported_documents
				WHERE created_on > $1
			`

			// Define o limite de tempo para 60 segundos atrás
			sixtySecondsAgo := time.Now().Add(-60 * time.Second)

			rows, err := db.Query(query, sixtySecondsAgo)
			if err != nil {
				log.Fatal("Erro ao executar a consulta:", err)
			}

			for rows.Next() {
				var fileName string 
				var createdOn time.Time
				err := rows.Scan(&fileName, &createdOn)
				if err != nil {
					log.Fatal("Erro ao escanear o resultado da consulta:", err)
				}

				fmt.Printf("Novo arquivo XML encontrado: Nome do arquivo: %s, Criado em: %s\n", fileName, createdOn)
				
				// readXMLAndSendToBroker(fileName)			
			}

			if err := rows.Err(); err != nil {
				log.Fatal("Erro durante a iteração dos resultados:", err)
			}

			rows.Close()
		}
	}
}

func main() {
	db := connectDB()
	fmt.Println(db)
	sayHelloWorld()
	checkNewXMLFilesEvery60Seconds(db)
	defer db.Close()
}
# RPC_Server - XML_Parsing

In this repository you will find a complex architecture (similar to the on in the image), this is the second part of a project that essentially was a data transformation tool, taking information from a CSV file, converting it into XML, and storing it in an PostGres database. The code ensures that the database table structure matches the data being inserted. It's particularly useful for converting structured data from one format (CSV) to another (XML and PostGres) for further analysis or use.

In this second part we've added API's, another language besides Python, Golang, frontend's, and very different features to develop even more the first project.

## Functionalities

- Read a CSV file containing car-related data (e.g., first name, last name, country, car brand, car model, car color, year of manufacture, credit card type).

- Convert the data from the CSV file into an XML format.

- Create or connect to two PostGres databases named "db-xml" and "db-rel".

- The converted csv (now xml), is stored in the "db-xml", by the **Importer** container, this container does the conversion and inserts in the database, if the file already exists, it won't go again into the database. It sees the "/csv" and "/xml" folders in the project to search for the new files.

- A **Watcher** using Golang, this send a notification to the broker with the filename that was **inserted** or **updated** in the _imported_documents_ table of "db-xml".

- **Broker** service by RabbitMQ, serves as a notificator, it sends stores messages in queues.

- **Migrator** gets the latest message in the broker queue, sees the filename that was _created / updated_. Then fetches the data from that file and uses XPath queries to migrate the data to an entity relation database (db-rel). The migration is done using an API and Prisma.

- The data can be viewed in the frontend's. The first one, _frontend-proc_ uses the data from the db-xml dabatabase using the rpc-server, this is done using a Flask API. The _frontend-ent_ uses the data from the db-rel also using an Flask API. The last _frontend-gis_ uses the field _geom_ in the Country table in the db-rel database, to insert pins in a world map, of the geographic position of a Customer.

## Architecture
![Architecture](architecture.png)

## Running th program

Create Docker Images and Containers - Navigate to the project's root folder (TP2-IS).

First we need to build the database conteiner's using the following command:

```
  docker-compose up --build db-rel db-xml broker -d
```

Secondly the API conteiner's:

```
  docker-compose up --build api-gis api-proc api-entities api-graphql -d
```

Then we will need to build the rest of the architecture:

```
  docker-compose up --build migrator watcher gis-updater -d
```

Lastly but not least, the importer, this conteiner will start the whole process:

```
  docker-compose up --build importer -d
```

To see the complete data using a modern interface, run:

```
  docker-compose up --build frontend-proc frontend-gis frontend-ent -d
```

Those commands will create and start up the enviroment we create, we hope you enjoy!

The links to acess the frontend's are in each respectivly docker conteiner.

## Stacks

![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![PostGres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vscode](https://img.shields.io/badge/Vscode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Golang](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)

# Authors

- [@RafaelAndré](https://github.com/kromenz) - 28234
- [@DiogoBernardes](https://github.com/DiogoBernardes) - 27984
- [@SérgioBarbosa](https://github.com/Oigres2) - 26211
- [GithubRepo](https://github.com/DiogoBernardes/TP2-IS)

#### _Engenharia Informática @ipvc/estg, 2023-2024_

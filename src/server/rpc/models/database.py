import psycopg2

class Database:
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.user ="is"
        self.password = "is"
        self.host = "db-xml"
        self.port = "5432"
        self.database = "is"
        
        
    def connect(self):
        if self.connection is None:
            try:
                self.connection = psycopg2.connect(
                    user=self.user,
                    password=self.password,
                    host=self.host,
                    port=self.port,
                    database=self.database
                )
                self.cursor = self.connection.cursor()
                print("Connected to the database.")
            except psycopg2.Error as error:
                print(f"Error connecting to the database: {error}")

    def disconnect(self):
        if self.connection:
            try:
                self.cursor.close()
                self.connection.close()
                print("Disconnected from the database.")
            except psycopg2.Error as e:
                print(f"Error closing connection: {e}")

    def insert(self, sql_query, data):
        self.connect()
        try:
            self.cursor.execute(query=sql_query, vars=data)
            self.connection.commit()
            print("Data inserted into the database.")
        except psycopg2.Error as error:
            print(f"Error inserting data into the database: {error}")

    def selectAll(self, query, data=None):
        self.connect()
        with self.connection.cursor() as cursor:
            if data:
                cursor.execute(query, data)
            else:
                cursor.execute(query)
            result = [row for row in cursor.fetchall()]
            cursor.close()
            return result

    def select_one(self, query, data):
        self.connect()
        try:
            self.cursor.execute(query, data)
            record = self.cursor.fetchone()
            print("Selected one record from the database.")
            return record
        except psycopg2.Error as error:
            print(f"Error selecting record from the database: {error}")
            return None

    def softdelete(self, table, options):
        self.connect()
        with self.connection.cursor() as cursor:
            cursor.execute(
                f"UPDATE {table} SET deleted_on = now() WHERE {options}")
            result = cursor.rowcount
            self.connection.commit()
            cursor.close()
            return result
import psycopg2

class Database:
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.user = "is"
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
            except psycopg2.DatabaseError as e:
                raise Exception("Error connecting to database")

    def disconnect(self):
        if self.connection:
            self.connection.close()

    def insert(self, sql, values):
        self.connect()
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query=sql, vars=values)
                self.connection.commit()
                return True
        except psycopg2.Error as ex:
            raise ex

    def selectAll(self, query):
        self.connect()
        with self.connection.cursor() as cursor:
            cursor.execute(query)
            for row in cursor:
                yield row

    def selectOne(self, query):
        self.connect()
        with self.connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchone()
            return result

    def softdelete(self, table, options):
        self.connect()
        with self.connection.cursor() as cursor:
            cursor.execute(
                f"UPDATE {table} SET deleted_on = now() WHERE {options}")
            result = cursor.rowcount
            self.connection.commit()
            return result

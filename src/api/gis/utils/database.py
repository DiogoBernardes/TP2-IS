import psycopg2

class Database:
    def __init__(self, host="db-rel"):
        self.conn = None
        self.cursor = None
        self.user = "is"
        self.password = "is"
        self.host = host
        self.port = "5432"
        self.database = "is"

    def connect(self):
        if self.conn is None:
            try:
                self.conn = psycopg2.connect(user=self.user,
                                            password=self.password,
                                            host=self.host,
                                            port=self.port,
                                            database=self.database)
            except psycopg2.DatabaseError as e:
                print(f"Error connecting to database: {e}")
                raise Exception("Error connecting to database")


    def disconnect(self):
        if self.conn:
            self.conn.close()

    def insert(self, sql, values=None):
        self.connect()
        try:
            with self.conn.cursor() as cursor:
                cursor.execute(query=sql, vars=values)
                self.conn.commit()
                cursor.close()
                return True
        except psycopg2.Error as ex:
            raise ex

    def update(self, sql, values=None):
        self.connect()
        try:
            with self.conn.cursor() as cursor:
                cursor.execute(query=sql, vars=values)
                self.conn.commit()
                cursor.close()
                return True
        except psycopg2.Error as ex:
            raise ex

    def selectAll(self, query, values=None):
        self.connect()
        with self.conn.cursor() as cursor:
            cursor.execute(query=query, vars=values)

            rows = [row for row in cursor]

            cursor.close()

            return rows


    def selectOne(self, query, values=None):
        self.connect()
        with self.conn.cursor() as cursor:
            cursor.execute(query=query, vars=values)
            result = cursor.fetchone()
            cursor.close()
            return result

    def delete(self, sql, values=None):
        self.connect()
        try:
            with self.conn.cursor() as cursor:
                cursor.execute(query=sql, vars=values)
                result = cursor.rowcount
                self.conn.commit()
                cursor.close()
                return result > 0
        except psycopg2.Error as ex:
            raise ex

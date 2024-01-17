import sys
from utils.database import Database
import graphene
from flask import Flask
from flask_graphql import GraphQLView
from flask_cors import CORS
from flask_magql import MagqlExtension

from entities.brand import Brand
from entities.model import Model
from entities.car import Car
from entities.country import Country
from entities.card_type import Card
from entities.customer import Customer
from entities.sale import Sale

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000

class Query(graphene.ObjectType):
    brands = graphene.List(Brand)
    models = graphene.List(Model)
    cars = graphene.List(Car)
    countries = graphene.List(Country)
    cards = graphene.List(Card)
    customers = graphene.List(Customer)
    sales = graphene.List(Sale)
    


schema = graphene.Schema(query=Query)

if __name__ == '__main__':
    app = Flask(__name__)
    app.config["DEBUG"] = True

    CORS(app)

    app.add_url_rule(
        '/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))
    app.run(host="0.0.0.0", port=PORT)


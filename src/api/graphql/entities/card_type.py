import graphene


class Card(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()

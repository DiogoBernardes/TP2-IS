import graphene


class Country(graphene.ObjectType):
    id = graphene.String()
    name = graphene.String()
    geom = graphene.JSONString()

import graphene


class Model(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()

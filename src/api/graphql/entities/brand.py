import graphene


class Brand(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()

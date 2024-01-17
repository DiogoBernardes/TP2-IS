import graphene


class Sale(graphene.ObjectType):
    id = graphene.String()
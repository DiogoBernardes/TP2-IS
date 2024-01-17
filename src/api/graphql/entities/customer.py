import graphene


class Customer(graphene.ObjectType):
    id = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()

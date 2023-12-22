import xml.etree.ElementTree as ET
from entities.car import Car
from entities.card import CreditCard
from entities.customer import Customer
from lxml import etree

class Sale:

    def __init__(self):
        Sale.counter += 1
        self._id = Sale.counter
        self._customers = []
        self._cars= []
        self._creditCards = []

    def add_car(self, car: Car):
        self._cars.append(car)

    def add_creditCard(self, creditCard: CreditCard):
        self._creditCards.append(creditCard)

    def add_customer(self, customer: Customer): 
        self._customers.append(customer)

    def to_xml_lxml(self):
        el = etree.Element("Sale")
        el.set("id", str(self._id))

        for car in self._cars:
            el.append(car.to_xml_lxml())

        # Adicionar cada cliente individualmente
        for customer in self._customers:
            el.append(customer.to_xml_lxml())

        # Adicionar cada cartão de crédito individualmente
        for card in self._creditCards:
            el.append(card.to_xml_lxml())

        return el
    
Sale.counter=0
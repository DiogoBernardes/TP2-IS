import xml.etree.ElementTree as ET
from lxml import etree

class CreditCard:

    def __init__(self, name):
        CreditCard.counter += 1
        self._id = CreditCard.counter
        self._name = name

    def to_xml_lxml(self):
        el = etree.Element("CreditCard_Type")
        el.set("id", str(self._id))
        el.set("name", self._name)
        return el

    def get_id(self):
        return self._id

    def __str__(self):
        return f"name: {self._name}, id: {self._id}"
    
CreditCard.counter = 0
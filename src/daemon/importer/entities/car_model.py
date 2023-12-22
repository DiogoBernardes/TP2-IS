import xml.etree.ElementTree as ET
from entities.brand import Brand
from lxml import etree

class CarModel:

    def __init__(self, name, brand):
        CarModel.counter += 1
        self._id = CarModel.counter
        self._name = name
        self._brand = brand

    def to_xml_lxml(self):
        return etree.Element("Model", id=str(self._id), name=self._name)

    def get_id(self):
        return self._id

    def __str__(self):
        return f"brand: {self._brand._name}, name: {self._name}, id: {self._id}"

CarModel.counter = 0
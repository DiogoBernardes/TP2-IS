import xml.etree.ElementTree as ET
from entities.car_model import CarModel
from xml.etree import ElementTree as etree

class Car:
    
    def __init__(self, model, color, year, brand_ref, model_ref):
        Car.counter += 1
        self._id = Car.counter
        self._model = model
        self._color = color
        self._year = year
        self._brand_ref = brand_ref
        self._model_ref = model_ref

    def to_xml_lxml(self):
        car_el = etree.Element("Car", id=str(self._id), color=self._color, year=str(self._year))
        car_el.set("brand_ref", str(self._brand_ref))
        car_el.set("model_ref", str(self._model_ref))

        return car_el

    def get_id(self):
        return self._id

    def __str__(self):
        return f"model: {self._model._name}, color: {self._color}, year: {self._year}, id: {self._id}"

Car.counter = 0
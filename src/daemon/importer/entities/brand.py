import xml.etree.ElementTree as ET
from lxml import etree

class Brand:
    def __init__(self, name):
        Brand.counter += 1
        self._id = Brand.counter
        self._name = name
        self._models = []

    def add_model(self, model):
        self._models.append(model)
    
    def to_xml_lxml(self):
        brand_el = etree.Element("Brand", id=str(self._id), name=self._name)
        
        # Criar o elemento Models para conter todos os modelos
        models_el = etree.SubElement(brand_el, "Models")

        # Incluir os modelos dentro do elemento Models
        for model in self._models:
            model_el = etree.SubElement(models_el, "Model", id=str(model._id), name=model._name)
        
        return brand_el

Brand.counter = 0
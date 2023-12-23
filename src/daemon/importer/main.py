import asyncio
import time
import uuid

import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileCreatedEvent

from utils.to_xml_converter import CSVtoXMLConverter
from utils.database import Database

def get_csv_files_in_directory(directory):
    return [os.path.join(dp, f) for dp, dn, filenames in os.walk(directory) for f in filenames if
            os.path.splitext(f)[1] == '.csv']


def generate_unique_file_name(directory):
    return f"{directory}/{str(uuid.uuid4())}.xml"


def convert_csv_to_xml(in_path, out_path):
    converter = CSVtoXMLConverter(in_path)
    xml_str, error_message = converter.to_xml_str(out_path)
    
    if xml_str is not None:
        with open(out_path, "w") as file:
            file.write(xml_str)
        return xml_str
    else:
        print(f"Erro ao gerar XML: {error_message}")
        return None


def insert_imported_doc(file_name, xml):
    db = Database()
    try:
        db.insert(
            "INSERT INTO imported_documents (file_name, xml) VALUES (%s,%s)", (file_name, xml))
    except Exception as error:
        print(error)
        raise error

class CSVHandler(FileSystemEventHandler):
    def __init__(self, input_path, output_path):
        self._output_path = output_path
        self._input_path = input_path

        # generate file creation events for existing files
        for file in [os.path.join(dp, f) for dp, dn, filenames in os.walk(input_path) for f in filenames]:
            event = FileCreatedEvent(os.path.join(CSV_INPUT_PATH, file))
            event.event_type = "created"
            self.dispatch(event)

    async def convert_csv(self, csv_path):
        # here we avoid converting the same file again
        # !TODO: check converted files in the database
        if csv_path in await self.get_converted_files():
            return

        print(f"new file to convert: '{csv_path}'")

        # we generate a unique file name for the XML file
        xml_path = generate_unique_file_name(self._output_path)

        # we do the conversion
        # !TODO: once the conversion is done, we should updated the converted_documents tables
        xml = convert_csv_to_xml(csv_path, xml_path)
        
        try:
            # insert converted doc
            # insert_converted_doc(src=csv_path,
            #                      dst=xml_path,
            #                      filesize=os.stat(xml_path).st_size)

            # insert imported doc
            # !TODO: we should store the XML document into the imported_documents table
            insert_imported_doc(file_name=csv_path,
                                xml=xml)

            print(f"new xml file generated: '{xml_path}'")
        except:
            os.remove(xml_path)

       

    async def get_converted_files(self):
        # !TODO: you should retrieve from the database the files that were already converted before
        return []

    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(".csv"):
            asyncio.run(self.convert_csv(event.src_path))


if __name__ == "__main__":

    CSV_INPUT_PATH = "/csv"
    XML_OUTPUT_PATH = "/xml"

    # create the file observer
    observer = Observer()
    observer.schedule(
        CSVHandler(CSV_INPUT_PATH, XML_OUTPUT_PATH),
        path=CSV_INPUT_PATH,
        recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()

    csv_files = get_csv_files_in_directory(CSV_INPUT_PATH)

    for csv_path in csv_files:
        asyncio.run(CSVHandler.convert_csv(csv_path))
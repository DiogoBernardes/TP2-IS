from models.database import Database
import logging
db = Database()
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def index():
    result = db.selectAll(
        "SELECT id, file_name, xml, created_on, updated_on FROM imported_documents WHERE deleted_on IS NULL")

    return result



def fetch_brands():
    results = db.selectAll(
        "SELECT unnest(xpath('//Brand/@name', xml)) as brand_name FROM imported_documents WHERE deleted_on IS NULL")
    
    brands = [result[0] for result in results]
    sorted_brands = sorted(brands)
    return sorted_brands

def fetch_car_models(brand_name):
    query = "SELECT unnest(xpath('//Brand[@name=\"{}\"]//Model/@name', xml)) as model_name FROM imported_documents WHERE deleted_on IS NULL".format(brand_name)
    results = db.selectAll(query)

    models = [result[0] for result in results]
    sorted_models = sorted(models)

    return sorted_models

def sales_per_country():
    sales_country_refs_query = """
        SELECT unnest(xpath('//Sale/Customer/@country_ref', xml)) as country_ref
        FROM imported_documents WHERE deleted_on IS NULL
    """
    sales_country_refs = db.selectAll(sales_country_refs_query)

    country_names_query = """
        SELECT unnest(xpath('//Country/@name', xml)) as country_name
        FROM imported_documents WHERE deleted_on IS NULL
    """
    country_names = db.selectAll(country_names_query)

    country_sales = {}
    for country_ref in sales_country_refs:
        if country_ref[0]:
            country_name = country_names[int(country_ref[0]) - 1][0]
            country_sales[country_name] = country_sales.get(country_name, 0) + 1

    sorted_sales = dict(sorted(country_sales.items(), key=lambda item: item[1], reverse=True))
    return sorted_sales
    
def oldest_sold_car_details():
    brand_names_query = "SELECT unnest(xpath('//Brand/@name', xml)) as brand_name FROM imported_documents WHERE deleted_on IS NULL"
    brand_names = {i+1: name[0] for i, name in enumerate(db.selectAll(brand_names_query))}

    model_names_query = "SELECT unnest(xpath('//Model/@name', xml)) as model_name FROM imported_documents WHERE deleted_on IS NULL"
    model_names = {i+1: name[0] for i, name in enumerate(db.selectAll(model_names_query))}

    country_names_query = "SELECT unnest(xpath('//Country/@name', xml)) as country_name FROM imported_documents WHERE deleted_on IS NULL"
    country_names = {i+1: name[0] for i, name in enumerate(db.selectAll(country_names_query))}

    car_sales_query = """
        SELECT 
            unnest(xpath('//Sale/Car/@year', xml)) as year,
            unnest(xpath('//Sale/Car/@color', xml)) as color,
            unnest(xpath('//Sale/Car/@brand_ref', xml)) as brand_ref,
            unnest(xpath('//Sale/Car/@model_ref', xml)) as model_ref,
            unnest(xpath('//Sale/Customer/@first_name', xml)) as first_name,
            unnest(xpath('//Sale/Customer/@last_name', xml)) as last_name,
            unnest(xpath('//Sale/Customer/@country_ref', xml)) as country_ref,
            unnest(xpath('//Sale/CreditCard_Type/@name', xml)) as credit_card
        FROM imported_documents
        WHERE deleted_on IS NULL
    """
    car_sales = db.selectAll(car_sales_query)

    oldest_car = None
    oldest_year = float('inf')

    for car in car_sales:
        year, color, brand_ref, model_ref, first_name, last_name, country_ref, credit_card = car
        if year and int(year) < oldest_year:
            oldest_year = int(year)
            brand_name = brand_names.get(int(brand_ref), "Unknown brand")
            model_name = model_names.get(int(model_ref), "Unknown model")
            country_name = country_names.get(int(country_ref), "Unknown country")

            oldest_car = {
                'Brand': brand_name,
                'Model': model_name,
                'Color': color,
                'Year': year,
                'Customer Name': f'{first_name} {last_name}',
                'Country': country_name,
                'CreditCard': credit_card
            }

    return oldest_car if oldest_car else None

def newest_sold_car_details():
    brand_names_query = "SELECT unnest(xpath('//Brand/@name', xml)) as brand_name FROM imported_documents WHERE deleted_on IS NULL"
    brand_names = {i+1: name[0] for i, name in enumerate(db.selectAll(brand_names_query))}

    model_names_query = "SELECT unnest(xpath('//Model/@name', xml)) as model_name FROM imported_documents WHERE deleted_on IS NULL"
    model_names = {i+1: name[0] for i, name in enumerate(db.selectAll(model_names_query))}

    country_names_query = "SELECT unnest(xpath('//Country/@name', xml)) as country_name FROM imported_documents WHERE deleted_on IS NULL"
    country_names = {i+1: name[0] for i, name in enumerate(db.selectAll(country_names_query))}

    car_sales_query = """
        SELECT 
            unnest(xpath('//Sale/Car/@year', xml)) as year,
            unnest(xpath('//Sale/Car/@color', xml)) as color,
            unnest(xpath('//Sale/Car/@brand_ref', xml)) as brand_ref,
            unnest(xpath('//Sale/Car/@model_ref', xml)) as model_ref,
            unnest(xpath('//Sale/Customer/@first_name', xml)) as first_name,
            unnest(xpath('//Sale/Customer/@last_name', xml)) as last_name,
            unnest(xpath('//Sale/Customer/@country_ref', xml)) as country_ref,
            unnest(xpath('//Sale/CreditCard_Type/@name', xml)) as credit_card
        FROM imported_documents
        WHERE deleted_on IS NULL
    """
    car_sales = db.selectAll(car_sales_query)

    newest_car = None
    newest_year = 0

    for car in car_sales:
        year, color, brand_ref, model_ref, first_name, last_name, country_ref, credit_card = car
        if year and int(year) > newest_year:
            newest_year = int(year)
            brand_name = brand_names.get(int(brand_ref), "Unknown brand")
            model_name = model_names.get(int(model_ref), "Unknown model")
            country_name = country_names.get(int(country_ref), "Unknown country")

            newest_car = {
                'Brand': brand_name,
                'Model': model_name,
                'Color': color,
                'Year': year,
                'Customer Name': f'{first_name} {last_name}',
                'Country': country_name,
                'CreditCard': credit_card
            }

    return newest_car if newest_car else None

def most_sold_colors(filename):
    car_colors_query = """
        SELECT unnest(xpath('//Sale/Car/@color', xml)) as car_color
        FROM public.documents
        WHERE file_name = %s AND deleted_on IS NULL
    """
    car_colors = db.selectAll(car_colors_query, (filename,))

    if not car_colors:
        return None

    color_counts = {}
    for color in car_colors:
        if color[0]:
            color_counts[color[0]] = color_counts.get(color[0], 0) + 1

    total_sales = sum(color_counts.values())

    if total_sales > 0:
        color_percentages = {color: count / total_sales * 100 for color, count in color_counts.items()}
        sorted_colors = dict(sorted(color_percentages.items(), key=lambda item: item[1], reverse=True))
        return sorted_colors
    else:
        return None

def most_sold_brands(filename):
    brand_refs_query = """
        SELECT unnest(xpath('//Sale/Car/@brand_ref', xml)) as brand_ref
        FROM public.documents
        WHERE file_name = %s AND deleted_on IS NULL
    """
    brand_refs = db.selectAll(brand_refs_query, (filename,))

    brand_names_query = """
        SELECT unnest(xpath('//Brand/@name', xml)) as brand_name
        FROM public.documents
        WHERE file_name = %s AND deleted_on IS NULL
    """
    brand_names = db.selectAll(brand_names_query, (filename,))

    if not brand_refs or not brand_names:
        return None

    brand_counts = {}
    for brand_ref in brand_refs:
        if brand_ref[0]:
            brand_name = brand_names[int(brand_ref[0]) - 1][0]
            brand_counts[brand_name] = brand_counts.get(brand_name, 0) + 1

    total_sales = sum(brand_counts.values())

    if total_sales > 0:
        brand_percentages = {brand: count / total_sales * 100 for brand, count in brand_counts.items()}
        sorted_brands = dict(sorted(brand_percentages.items(), key=lambda item: item[1], reverse=True))
        return sorted_brands
    else:
        return None

def most_sold_models(filename):
    model_refs_query = """
        SELECT unnest(xpath('//Sale/Car/@model_ref', xml)) as model_ref
        FROM public.documents
        WHERE file_name = %s AND deleted_on IS NULL
    """
    model_refs = db.selectAll(model_refs_query, (filename,))

    model_names_query = """
        SELECT unnest(xpath('//Model/@name', xml)) as model_name
        FROM public.documents
        WHERE file_name = %s AND deleted_on IS NULL
    """
    model_names = db.selectAll(model_names_query, (filename,))

    if not model_refs or not model_names:
        return None

    model_counts = {}
    for model_ref in model_refs:
        if model_ref[0]:
            model_name = model_names[int(model_ref[0]) - 1][0]
            model_counts[model_name] = model_counts.get(model_name, 0) + 1

    total_sales = sum(model_counts.values())

    if total_sales > 0:
        model_percentages = {model: count / total_sales * 100 for model, count in model_counts.items()}
        sorted_models = dict(sorted(model_percentages.items(), key=lambda item: item[1], reverse=True))
        return sorted_models
    else:
        return None

def car_year(year, filename):
    try:
        brand_names_query = "SELECT unnest(xpath('//Brand/@name', xml)) as brand_name FROM public.documents WHERE file_name = %s AND deleted_on IS NULL"
        brand_names = {i+1: name[0] for i, name in enumerate(db.selectAll(brand_names_query, (filename,)))}

        model_names_query = "SELECT unnest(xpath('//Model/@name', xml)) as model_name FROM public.documents WHERE file_name = %s AND deleted_on IS NULL"
        model_names = {i+1: name[0] for i, name in enumerate(db.selectAll(model_names_query, (filename,)))}

        car_sales_query = f"""
            SELECT 
                unnest(xpath('//Sale[Car/@year=\"{year}\"]/Car/@brand_ref', xml)) as brand_ref,
                unnest(xpath('//Sale[Car/@year=\"{year}\"]/Car/@model_ref', xml)) as model_ref,
                unnest(xpath('//Sale[Car/@year=\"{year}\"]/Car/@color', xml)) as car_color,
                unnest(xpath('//Sale[Car/@year=\"{year}\"]/Customer/@first_name', xml)) as first_name,
                unnest(xpath('//Sale[Car/@year=\"{year}\"]/Customer/@last_name', xml)) as last_name
            FROM public.documents
            WHERE file_name = %s AND deleted_on IS NULL
        """
        car_sales = db.selectAll(car_sales_query, (filename,))

        car_data = []
        for brand_ref, model_ref, car_color, first_name, last_name in car_sales:
            if brand_ref and model_ref:
                brand_name = brand_names.get(int(brand_ref), "Unknown brand")
                model_name = model_names.get(int(model_ref), "Unknown model")
                customer_name = f"{first_name} {last_name}" if first_name and last_name else "Unknown customer"
                car_data.append({
                    "Brand": brand_name,
                    "Model": model_name,
                    "Color": car_color,
                    "Customer": customer_name
                })

        return car_data if car_data else "No car details found for the year."

    except Exception as e:
        return f"Error in car_year(): {e}"

def file_exists(file):
    try:
        
        query = "SELECT COUNT(*) FROM public.documents WHERE file_name = %s AND deleted_on IS NULL"
        
        result = db.select_one(query, (file,))

        return result[0] > 0 if result else False

    except Exception as e:
        print(f"Error checking if the file exists: {e}")
        return False
    

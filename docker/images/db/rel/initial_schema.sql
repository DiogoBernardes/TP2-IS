CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS POSTGIS;
CREATE EXTENSION IF NOT EXISTS POSTGIS_TOPOLOGY;

CREATE TABLE public.countries (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name            VARCHAR(250) NOT NULL,
	geom            GEOMETRY,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.brands (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name            VARCHAR(250) UNIQUE NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.creditCard_Type (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name            VARCHAR(250) NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.model (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name            VARCHAR(250) NOT NULL,
	brand_id 				uuid NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.customer (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	first_name      VARCHAR(250) NOT NULL,
	last_name      	VARCHAR(250) NOT NULL,
	country_id 			uuid NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.car (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	color 		      VARCHAR(250) NOT NULL,
	year		      	INTEGER NOT NULL,
	model_id 			  uuid NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sale (
	id              		uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	car_id 		      		uuid NOT NULL,
	customer_id		  		uuid NOT NULL,
	creditCard_Type_id 	uuid NOT NULL,
	created_on      		TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      		TIMESTAMP NOT NULL DEFAULT NOW()
);


ALTER TABLE model
    ADD CONSTRAINT model_brands_id_fk
        FOREIGN KEY (brand_id) REFERENCES brands;

ALTER TABLE customer
    ADD CONSTRAINT customer_country_id_fk
        FOREIGN KEY (country_id) REFERENCES countries;

ALTER TABLE car
    ADD CONSTRAINT car_model_id_fk
        FOREIGN KEY (model_id) REFERENCES model;

ALTER TABLE sale
    ADD CONSTRAINT sale_car_id_fk
        FOREIGN KEY (car_id) REFERENCES car;

ALTER TABLE sale
    ADD CONSTRAINT sale_customer_id_fk
        FOREIGN KEY (customer_id) REFERENCES customer;

ALTER TABLE sale
    ADD CONSTRAINT sale_creditCard_Type_id_fk
        FOREIGN KEY (creditCard_Type_id) REFERENCES creditCard_Type;



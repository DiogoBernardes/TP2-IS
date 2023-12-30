CREATE TABLE public.imported_documents (
    id              serial PRIMARY KEY,
    file_name       VARCHAR(250) UNIQUE NOT NULL,
    xml             XML NOT NULL,
    processed       BOOLEAN DEFAULT false NOT NULL,
    created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_on      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_on      TIMESTAMP
);

CREATE TABLE public.converted_documents (
    id              serial PRIMARY KEY,
    src             VARCHAR(250) UNIQUE NOT NULL,
    file_size       BIGINT NOT NULL,
    dst             VARCHAR(250) UNIQUE NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	deleted_on      TIMESTAMP
);

CREATE UNIQUE INDEX document_filename ON imported_documents (file_name) WHERE deleted_on IS NULL;
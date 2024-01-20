FROM node:21-alpine3.17

WORKDIR /usr/src/app

RUN apk add bash
RUN npm install -g npm
RUN npm install axios


COPY run.sh ..

RUN (sed -i 's/\r$//' ../run.sh) && \
    (chmod +x ../run.sh)

# run the script
CMD ../run.sh

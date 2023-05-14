FROM node:16.15.1
WORKDIR /app/frontend

COPY . .
RUN npm install --force
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \ 
    npm

EXPOSE 3000
CMD npm start
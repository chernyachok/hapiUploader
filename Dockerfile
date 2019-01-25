FROM node:8.11

WORKDIR /app

COPY . /app 

RUN npm install 
RUN npm run build

COPY init.sql /docker-entrypoint-initdb.d

EXPOSE 8082

CMD ["npm", "run", "launch"]
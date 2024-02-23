- Steps to start Application:

  1. npm install
  2. create .env and add variables with value from .env.example
  3. use npm run start OR npm run start:dev (on start DB and table will be Created)

- Endpoint of identify (Here I assume SERVER_PORT = 3000)
  POST localhost:3000/api.identify with BODY email or/and phoneNumber

- cURL of identify:

  curl --location 'localhost:3000/api/identify' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "email": "abc@gmail.com",
  "phoneNumber": "654321"
  }'

Tech Stack:

1.  NodeJS
2.  ExpressJS
3.  TypeScript
4.  MySQL
5.  RestAPI

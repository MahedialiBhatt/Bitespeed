STEPS to start Application:
    1. npm install
    2. Create bitespeed database
    3. create .env and add variables with value from .env.example
    4. use npm run start OR npm run start:dev



- After starting application call this API
   POST localhost:3000/api.identify with BODY email or/and phoneNumber

- cURL of identify

  curl --location 'localhost:3000/api/identify' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "email": "abc@gmail.com",
    "phoneNumber": "654321"
  }'       


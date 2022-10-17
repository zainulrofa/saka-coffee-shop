<h1 align="center"> Saka Coffee </h1> <br>

# About The Project

<p align="left">
  Saka Coffee is Coffee Shop for "Senja" People.
</p>

## Build With

[![NODE.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![EXPRESS.JS](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![POSTGRE](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## Prerequisites

- [Node.Js](#Node.Js)
- [PostgreSql](#PostgreSql)
- [Postman](#Postman)

## Installation

1. Clone the repo <br>
   `$ git clone https://github.com/zainulrofa/saka-coffee-shop.git`
2. Install NPM packages<br>
   `$ npm install`
3. Add .env<br>
   `DB_PORT = 8060 DB_HOST_DEV="localhost" DB_USER_DEV="rofa" DB_NAME_DEV="sakaCoffe" DB_PASS_DEV="adekbaik99" DB_PORT="5432" SECRET_KEY="SAKA123"`
4. Start App<br>
   `$ npm run dev`

## Route

- Auth
  - login
  - logout
- Product
  - Get Products
  - Post Products
  - Patch Products
  - Delete Products
- Users
  - Get Users
  - Regist Users
  - Edit Profile
  - Edit Password
- Promos
  - Get Promos
  - Post Promos
  - Patch Promos
  - Delete Promos
- Transactions
  - Get transaction
  - Create transaction
  - Patch transaction
  - Delete transactions

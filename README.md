
# Server Documentation
 [Server documentation](https://server-user-app.onrender.com/)

#
## Description

This project is a tiny server app based on Node.js that implements simple organization user structure management operations. The app supports three user roles: Administrator, Boss, and Regular user. The Administrator is the top-most user, the Boss is any user with at least one subordinate, and the Regular user is a user without subordinates. Each user except the Administrator must have a boss (strictly one). The app exposes four REST API endpoints: Register user, Authenticate as a user, Return list of users, and Change user's boss.

# Back-end
## Getting Started:
`Recommended using the operating system Windows.`
To get started with the Message App, follow these steps:
1. Clone the repository
2. In the terminal enter command `npm i`

## Create file `.env` with variables:
1. `PORT= ` ""; //server port. Example: `=5000`
2. `POSTGRES_HOST= ` ""; //postgres host. Example: `=localhost`
3. `POSTGRES_USER = ` ""; // base date user name. Example: `=postgres`
4. `POSTGRES_DB =  ` ""; //base date  name. Example: `=data_base`
5. `POSTGRES_PASSWORD =  ` ""; //base date  name. Example: `=Zazapu1995`
6. `POSTGRES_PORT =  ` ""; //postgres port. Example: `=5432`
7. `PRIVET_KEY =  ` ""; // jwt token key. Example: `=f782824f6b41f4c4650c9846d1d`

## pgAdmin 4:
1. Install `pgAdmin 4` and connect in file `.env` 
2. Create Data Base  name: `data_base`
3. Create Data Base  password: `Zazapu1995`

## file `.env` with variables::

`PORT=5000`

`POSTGRES_HOST=localhost`

`POSTGRES_USER=postgres`

`POSTGRES_DB=data_base`

`POSTGRES_PASSWORD=Zazapu1995`

`POSTGRES_PORT=5432`

`PRIVATE_KEY=bc32ef6f88e404ae3246856ecfd30be67da4603cec4b9e763a8ad8a309ffe463122bf3c245a3519f1aa928ce61a69ee4835938923b481546cf9b0f7e4c04a75f`

## Run
1. Run  by running `npm run dev` in the project directory 

#
# Features
Secure authentication with JWT

CRUD operations for user management

Role-based access control

Recursive query for fetching a Boss and her subordinates

Custom error handling for invalid requests

# Technologies Used
Node.js

Nest.js

JWT (JSON Web Tokens) for authentication

Postgres for the database




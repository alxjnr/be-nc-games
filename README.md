# NC House of Games API

API (hosted by Render) [here](https://nc-games-hsvp.onrender.com/api)

## Introduction:

NC House of Games API is a ***RESTful API***. The API can be used to retrieve information about specific games, read reviews and comments. It is designed to be easy to use and does not require any authentication, so anyone can access the API's data. 

## Local database setup instructions:

### Cloning the repository:


To clone the API/repository, click `<> code` at the top of the repository page and copy the https link provided.

`git clone <https-link-here>` in the terminal will download the required files into a new directory with the repository name.


### Installing dependencies:


`npm install` will download the required dependencies.

*NOTE*:

`v19.3.0` and above of `node.js` is required.\
`v14.5` and above of `postgres` is required.


### Setting up local connections: 


You will want to setup the connections to the databse locally. To do this, please add the following files and their contents to the directory:

`.env.development`
`.env.test`

inside `env.development`, add `PGDATABASE=nc_games`\
inside `env.test`, add `PGDATABASE=nc_games_test`


### Setting up the databases:


`npm run setup-dbs` will create the databases required (using PostgreSQL)


### Seeding the databases:


`npm run seed` will then seed the local databases


### Running tests:


`npm test` will run the tests included in the repository using Jest
 




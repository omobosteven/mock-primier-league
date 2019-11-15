[![Build Status](https://travis-ci.com/omobosteven/mock-primier-league.svg?branch=develop)](https://travis-ci.com/omobosteven/mock-primier-league)
[![Coverage Status](https://coveralls.io/repos/github/omobosteven/mock-primier-league/badge.svg?branch=develop)](https://coveralls.io/github/omobosteven/mock-primier-league?branch=develop)

## mock-premier-league

An API that serves the latest scores of fixtures of matches

- [API hosted on Heroku](https://premier-league-mock-api.herokuapp.com/) &nbsp;&nbsp; [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/895b534306eef2f00e40)
- [Documentation](https://documenter.getpostman.com/view/3615834/SW7W5V2S?version=latest)

## Features
### Admin account can do the following
- signup/login
- manage teams (add, remove, edit, view)
- create fixtures (add, remove, edit, view)
- Generate unique links for fixture

### User account can do the following
- signup/login
- view teams
- view completed fixtures
- view pending fixtures
- search fixtures/teams

**NB: Only the search API endpoint is pulbic**

## Development set up

- Ensure the following tools/services are installed on your system.
- Node (v 10.x recommended)
- Redis (service should be running)
- Mongodb

- Clone the repo and cd into it
    ```
    git clone https://github.com/omobosteven/mock-primier-league.git
    ``` 
 - Install dependencies
    ```
    npm install
    ```
 - Create Application environment variables and save them in .env file in root directory
    ```
	PORT=3000
    DATABASE_URL=mongodb://host:port/dbName
    TEST_DATABASE_URL=mongodb://host:port/dbName
    SECRET_KEY=secreyKey
    REDIS_URL=redis://:@host:port
    RATE_LIMIT_MAX=20
    RATE_LIMIT_MINUTES=1
    ```
	
- Run application
    ```
    npm run start-dev
    ```

- Test application

    ```
    npm test
    ```

## Built with
- Javascript
- Node (v 10.x)
- Express
- Mongodb
- Mongoose ODM
- Redis
- Jest
- Heroku

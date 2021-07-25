# auct-bid
Auction Bidding Store

## Before Installation
- Download And MariaDB or minimum mysql 5.6 +
- Download and install latest stable nodejs and npm
- Install global dependecies and cli :
  * [express cli generator](https://expressjs.com/en/starter/generator.html) 
  - using command : 
    ```sh
    $ npm install -g express-generator
    ```
  * [sequelize-cli](https://sequelize.org/master/manual/migrations.html#installing-the-cli)
  - using command :
    ```sh
    $ npm install --save-dev sequelize-cli
    ```
- Clone [this repositories](https://github.com/rhyoharianja/auct-bid/) :
  - using command :
    ```sh
    $ git clone https://github.com/rhyoharianja/auct-bid.git
    ```
    or override directory name :
    ```sh
    $ git clone https://github.com/rhyoharianja/auct-bid.git whatevername
    ```

## First Use Installation
This Apps Use Standard Nodejs Environment
- Please rename sample.env to .env file and configuration db setting and environtment needed
- Follow package.json scripts step by step for first install and generate database
- Install the dependencies and devDependencies and start the server.

Use sh and command line :
```sh
$ cd auct-bid
$ npm run add:module
$ npm run db:install
$ npm run start 
```
### Command Line First Use Installation Explaination
- Before execute "npm run db:install" make sure the code below in file config/config.js at line 20 has been uncommented :
  ```js
    // module.exports = {
    //     "username": process.env.DB_USER,
    //     "password": process.env.DB_PASSWORD,
    //     "database": process.env.DB_NAME,
    //     "host": process.env.DB_HOST,
    //     "dialect": process.env.DB_DIALECT,
    // }
  ```
- after execute "npm run db:install" db with name as .env configured will created and all table and migrate will generate in db
- if want to use seed db, you can use below command in command line from app root directory :
 ```sh
 $ sequelize db:seed:all
 ```
- after generate all db needed, comment code in file config/config.js at line 20 like first clone and save again
- run command "npm run start "
- then run http://localhost:3033/ for first message use (this will change if run in stagging and production in future)
- port 3033 can be change in .env as we need (recommend is 30**)
- now we can use to create new user using https://localhost:3033/v1/users with post method and body below :
  ```json
    {
        "first": "string",
        "last": "string",
        "email": "string with unique and email type validation",
        "phone": "string with unique and phone validation",
        "password": "string with hash and unique validation",
        "roleId": "1"
    }
  ```
- for roleId will define with number in future.
- and try to login using : https://localhost:3033/v1/users/login with post method and body below and generate token in response :
  ```json
    {
	    "email": "your email in created",
	    "password": "your password in created"
    }
  ```
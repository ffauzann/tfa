# Two-Factor Authentication

This repository is only for technical test purpose. 


## Installation

It requires [Node.js](https://nodejs.org/) and [MySQL](https://mysql.com/) to run.
* Create a database __tfa__ and then import __tfa.sql__.
* Install the dependencies and devDependencies.

```sh
$ cd backend
$ npm install
```

* Configure database in __./backend/config/database.js__.
* Start the server.
```sh
$ npm start
```

## How to use
#### There are 3 endpoints you can use:

* __POST: /api/users/register__
This endpoint is for a registration purpose. Everyone can access this endpoint. 
These are mandatory parameters you must fill in the body:
  + firstName
  + lastName
  + email
  + password
  + confirmPassword


* __POST: /api/users/login__

    Just like the registration, everyone can access this endpoint. You can get the __Bearer token__ if you login successfuly. 
Please save the token to use it later.
These are mandatory parameters you must fill in the body:
  + email
  + password


* __POST: /api/users/tfa__
This last one is a private endpoint. You __must__ put the __Bearer token__ in __Authorization__ of the headers.
This endpoint only needs a mandatory parameter in the body:
  + code
You can get the code from __Google Authenticator__ by using this key: __JZBF4OSMJ47U23ZTMFIGCVSHGRNX2ZJ6__ 
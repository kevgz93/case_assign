# Queue Monitor
A basic app for manual support case assigments.

  - Manage the case assigment of all of your team.
  - See which teams are online and which ones are not.
  - Check the history of the previous case already assigned to a specific user to avoid over assigning cases.

### Tech

Queue Monitor uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]


## Installation

Queue requires [Node.js](https://nodejs.org/) v8+ [node-mong-seeds]https://github.com/toymachiner62/node-mongo-seeds and to run.

Install the dependencies, seed the database :( and start the server.

#### Seed the database 

Install Node-mongo-seed package and then run the $ seed command

#### Server (Backend + API)

```sh
$ cd case_assign
$ npm install
$ npm install -g node-mongo-seed
$ seed
$ nodemon
```

#### Frontend 

```sh
$ cd case_assign/public/angular5
$ npm install
$ ng serve
```

### Development

Working on this 😁

[node-mong-seeds]:https://github.com/toymachiner62/node-mongo-seeds
[node.js]: <http://nodejs.org>
[Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
[express]: <http://expressjs.com>
[AngularJS]: <http://angularjs.org>


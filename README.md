# tic-tac-toe [![Build Status](https://travis-ci.org/ezhaka/tic-tac-toe.svg?branch=master)](https://travis-ci.org/ezhaka/tic-tac-toe)

Multiplayer tic-tac-toe game written in Kotlin and JS.

## Getting Started

### Prerequisites

* JDK 8
* Docker

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
In order to run the project you can execute this command in the checkout directory:

```
$ ./gradlew bootRun
```

It will setup database in a docker container and run the backend. Go to ``http://localhost:8080`` in order to check this out.

#### Running backend from IntelliJ IDEA

If you want to run the backend from the IDE you should execute ``docker-compose`` manually:

```
$ docker-compose -f backend/docker-compose.yml up
```

Then execute whole project build:

```
$ ./gradlew build
```

This command will, among other things, build ``frontend`` project and create static assets that will be served by the ``backend``.

Then you can just run ``TicTacToeApplication#main`` from the IDE.

#### Running frontend in the development mode

When you have backend running on port ``8080``, you can run webpack dev server, that will build the bundle incrementally on every code change:

```
$ cd frontend
$ yarn start
```

It will automatically open ``http://localhost:3000``.

## Built With

* [Kotlin](https://kotlinlang.org)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Project Reactor](https://projectreactor.io)
* [React](https://reactjs.org)
* [Redux](https://redux.js.org/introduction)
* [redux-observable](https://redux-observable.js.org)

## Authors

* **Anton Sukhonosenko** — [ezhaka](https://github.com/ezhaka)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
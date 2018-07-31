# tic-tac-toe

Multiplayer tic-tac-toe game written in Kotlin and JS.

## Getting Started

### Prerequisites

* JDK 8
* Docker

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

In order to run the project on your local machine you can run this command in the checkout directory:

```
./gradlew bootRun
```

This command will setup database in a docker container and run the backend. Go to ``http://localhost:8080`` in order to check this out.

#### Running backend from IntelliJ IDEA

If you want to run the backend from the IDE you should execute ``docker-compose`` manually:

```
docker-compose -f backend/docker-compose.yml up
```

Then execute whole project build:

```
./gradlew build
```

This command will, among other things, build ``frontend`` project and create static assets that will be served by the ``backend``.

Then you can just run ``TicTacToeApplication#main`` from the IDE.

## Running the tests

Explain how to run the automated tests for this system

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Authors

* **Anton Sukhonosenko** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

# Food Service

[![Codeship Status for domiebett/food_service](https://app.codeship.com/projects/78afb390-a73c-0137-2f32-5ae24cfcc022/status?branch=develop)](https://app.codeship.com/projects/361206)

This is a service designed to keep a repository of all foods and their prices. It is intended to help create meals and evaluate their total price.

## Running this application.

### Prerequisites.
* You need to have docker installed. You can find out how to do this [here](https://docs.docker.com/get-started/).
* You also need to have `git` installed. You can do this using either `brew` on mac or `apt` utility on linux(ubuntu) or any other package manager supported by your OS.

Once you have git and docker installed, and the docker daemon is running, you can proceed with the following steps:

### Running it in a microservice architecture
Go to [this link](https://github.com/domiebett/budget_app), and follow the instructions on the README.

### Running it individually
**NB** Please note that this might run into errors while registering to eureka due to the unavailability of the eureka container. If you have your own instance of eureka served up, you can set that in the `config/default.json` file.

Clone the project repository.
> $ git clone https://github.com/domiebett/food_service

Check out into the project folder.
> $ cd food-service

Start up docker containers for the project.
> docker-compose up

You can access the food service app at `http://127.0.0.1:3001/`

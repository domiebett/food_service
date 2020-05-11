# Food Service

[![Codeship Status for domiebett/food_service](https://app.codeship.com/projects/78afb390-a73c-0137-2f32-5ae24cfcc022/status?branch=develop)](https://app.codeship.com/projects/361206)
[![Maintainability](https://api.codeclimate.com/v1/badges/09b24d8687359cbc9e11/maintainability)](https://codeclimate.com/github/domiebett/food_service/maintainability)

This is a service designed to keep a repository of all foods and their prices. It is intended to help create meals and evaluate their total price.

## Running this application.

### Prerequisites.
* You need to have docker installed. You can find out how to do this [here](https://docs.docker.com/get-started/).
* You also need to have `git` installed. You can do this using either `brew` on mac or `apt` utility on linux(ubuntu) or any other package manager supported by your OS.

Once you have git and docker installed, and the docker daemon is running, you can proceed with the following steps:

### Running the project
**NB** Please note that this might run into errors while registering to eureka due to the unavailability of the eureka container. If you have your own instance of eureka served up, you can set that in the `config/default.json` file. Otherwise, you can find a simple eureka setup at `https://github.com/domiebett/budget_app/tree/develop/service_discovery`. You will find a docker-compose file for eureka and zuul setup.

Clone the project repository.
> $ git clone https://github.com/domiebett/food_service

Check out into the project folder.
> $ cd food-service

Create a docker network:
> $ docker network create budget_app_network

Start up docker containers for the project.
> $ docker-compose up --build

You can access the food service app at `http://127.0.0.1:3001/`

Available routes are as follows:

**Method** | **Route** | **Description**
--- | --- | ---
GET | /foods/ | Get all food items
POST | /foods/ | Creates a food item
GET | /foods/:id | Get a single food item
PUT | /foods/:id | Edit a food item with the id.
DELETE | /foods/:id | Deletes a food item
--- | --- | ---
GET | /meals/ | Gets all meals
POST | /meals/ | Creates a meal
GET | /meals/:id | Gets a single meal with the id
PUT | /meals/:id | Edits a meal
DELETE | /meals/:id | Deletes a meal
POST | /meals/:id/foods | Adds food items with the ids provided to a meal
DELETE | /meals/:id/foods/:food_id | Remove a food item from a meal

## Testing

[Running Unit and Integration tests](tests/README.md)

# Food Service

This is an application designed to keep a repository of all foods and their prices. It is intended to help create meals and evaluate their total price.

## Running this application.

### Prerequisites.
* You need to have docker installed. You can find out how to do this [here](https://docs.docker.com/get-started/).
* You also need to have `git` installed. You can do this using either `brew` on mac or `apt` utility on linux(ubuntu) or any other package manager supported by your OS.

Once you have git and docker installed, and the docker daemon is running, you can proceed with the following steps:

Clone the project repository.
> $ git clone https://github.com/domiebett/food-service

Check out into the project folder.
> $ cd food-service

Start up docker containers for the project.
> docker-compose up

You can access the food service app at `http://127.0.0.1:3001/`

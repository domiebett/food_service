# Testing
This application uses mocha to run unit and integration tests.

## Running tests using locally.
You will need to run the tests inside a docker container to avoid additional setup procedures. This can be done using the following commands. This has been simplified using the command:

> $ npm run docker_test

...which is a shortcut to the command `docker exec -it food_service npm test`.

More commands for testing are available in the package.json for your convenience. These enable you to run specific tests.

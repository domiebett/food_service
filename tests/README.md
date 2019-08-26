# Testing
This application uses mocha to run unit and integration tests.

## Running tests using locally.
You will need to run the tests inside a docker container to avoid additional setup procedures. This can be done using the following commands. This has been simplified using the command:

> $ npm run docker_test

...which is a shortcut to the command `docker exec -it food_service npm test`.

More commands for testing are available in the package.json for your convenience. These enable you to run specific tests.

### Running the tests using jet(codeship local test runner)
Tests are run automatically on creation of a pull request. However, if you wish to tests that tests will work on CI locally, you can use the tool `jet`. This can be installed on a mac using the following command:

> $ brew cask install codeship/taps/jet

Running the tests can be done through:

> $ jet steps

... while inside the project root directory.

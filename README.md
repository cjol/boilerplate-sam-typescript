# AWS SAM NodeJS + TypeScript Boilerplate

## Features

-   Multiple entries: Each function handler is built into its own entry file.
    These entry files are determined by searching the `template.yaml` for
    Resources with a Type of `AWS::Serverless::Function`.
-   Uglify output during production builds.
-   Tests.

# Setup Guide

Before following any sections below, ensure to run `yarn` to install project
dependencies. This will also create a `.env` file, which you should check/update
the values of manually.

## Development

### Testing

-   Run `yarn test` to run unit tests
-   Run `yarn test --watch` to run unit tests and re-test on code changes

### Running Locally

-   Run `yarn dev` to watch for file changes and start a fast local server
-   Run `yarn dev:clean` to remove any conflicting containers from a previous
    run

## Deployment

### Initial Setup

1. run `yarn build` to build the latest code
2. run `yarn deploy:prepare` to create an S3 bucket for deployment artifacts
3. run `yarn deploy` to create the cloudformation stack

### Updates

1. run `yarn build` to build the latest code
2. run `yarn deploy` to update the cloudformation stack

### Cleanup

1. run `yarn deploy:clean` to remove the whole AWS stack and deployment bucket

# Under the hood

This boilerplate is a development of
[alukach/aws-sam-typescript-boilerplate](https://github.com/alukach/aws-sam-typescript-boilerplate).
It configures webpack to build small lambda functions, as opposed to zipping and
uploading the entire codebase. I've made a few changes:

-   Update Typescript to a more recent version
-   Add deploy script to create an S3 bucket for deployment
-   Add deploy script to teardown the deployment
-   Add deploy script to view deployed function logs
-   Add reading environment variables from .env file
-   Add [`aws-sam-api-proxy`](https://www.npmjs.com/package/aws-sam-api-proxy)
    for a faster local dev environment
    -   Add script to concurrently build into `dist` directory, then serve the
        API proxy locally
    -   The current template uses multiple events for the same function, which
        is not yet supported by `aws-sam-api-proxy` but I've filed a pull
        request to add support.
-   Add test helper for testing API Gateway Proxy event handlers
-   Switch from `npm` to `yarn`
-   Format everything with `prettier` and move from tslint to eslint
-   Migrate webpack config to typescript and add schema validation

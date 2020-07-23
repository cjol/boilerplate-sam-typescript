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

N.B. To propagate environment variables to the lambda containers, `envsubst`
must be installed on your machine.

-   Run `yarn dev` to watch for file changes and start a fast local server
-   Run `yarn dev:clean` to remove any conflicting containers from a previous
    session

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

-   Update dependencies to a more recent version
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
-   Add DynamoDB examples and support for dynamodb-local (see below)

## DynamoDB

When creating tables in SAM we have two choices:
`Type: AWS::Serverless::SimpleTable` or `Type: AWS::DynamoDB::Table`.
`SimpleTable` gives you less control, but also requires less configuration. An
advantage of `SimpleTable` is that we can retrieve the table name within the
template by simply using `!Ref TableResourceName` (e.g. to pass in to lambda as
an env var). This is not possible with `DynamoDB::Table` which only outputs the
table ARN. We can either deconstruct this ARN to retrieve the generated table
name, or explicitly name the table and refer to that static name (that's what we
do in the current example).

### Running locally

A local DynamoDB instance is included via `docker-compose`. The configuration
also creates a docker network, which our lambda functions will be able to
connect to. Running `yarn dev` will run a custom script which starts the
`dynamodb` container, and creates tables. The tables to create are parsed from
`template.yaml`. This also happens automatically as part of the jest global
setup script.

Note that the `docker-compose.yml` file has enabled the `sharedDb` option, which
is useful because the lambda function does not share the hosts' `AWS_PROFILE`,
so without this option the host and containers would see different databases.
Finally, remember that lambda functions running inside a container must
communicate with DynamoDB through the docker network (i.e.
`http://dynamodb:8000`) while on the host, we instead communicate through a
host-exposed port (i.e. `http://localhost:8000`). This is controlled in our code
through the `DYNAMO_HOST` environment variable.

## Fine-grained Permissions (IAM)

The project is designed to be deployed under one of two conditions:

### 1. Admin User:

The initial deployment should be performed by a user with full access to the AWS
account. Before starting the deployment, the admin user should create an IAM
user group called `SamDevelopers`. This group is referenced within the
CloudFormation template (and could be replaced with a different name).

With that done, the admin user can run `yarn deploy:prepare` and `yarn deploy`
according to the instructions above. This will create all the required
resources, and attach a new IAM policy to the `SamDevelopers` group.

At any later point, the admin user can pull the latest code and run
`yarn deploy`, and any new resources will be created automatically. This allows
developers to request creation of resources without needing privileges
themselves.

### 2. Developer:

Developers should not have access to create new resources. Instead, their user
should be added to the `SamDevelopers` group above. This will grant them
permission to:

-   Upload deployment artifacts to the appropriate S3 bucket
-   Run Cloudformation deployments (subject to per-service restrictions below)
-   View and edit previously-created Lambda functions (and associated IAM role)
-   Full access to the previously-created API Gateway
-   CRUD access to the created DynamoDB table (no scan or batch, but these could
    safely be added)

Notably this does not give access to create any new resources of the above
types. This shouldn't be a problem for most resources; the only annoying one is
creating new Lambda functions. We could allow developers to create new Lambda
functions, but this would also require them to be allowed to edit their own IAM
policy (in order to allow management of the new function) which would allow
escalation of privileges. It might be possible to restrict this with Permissions
Boundaries or something, but for now new functions should be created by the
admin user.

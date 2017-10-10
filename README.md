# Restful Lambda API - post-service

An [AWS Lambda](https://aws.amazon.com/lambda/) solution written using the [Serverless Toolkit](http://serverless.com) with a [DynamoDB](https://aws.amazon.com/dynamodb) backend.

The service includes pagination, key/value searches plus a collection of common needs including but not limited too, order/by and limit clauses.

## Installation & Deployment 
Firstly, ensure you have installed the [Serverless Toolkit](http://serverless.com)

    npm install serverless -g

Then from the project root folder simply enter

    sls deploy

## EndPoints

NAME | URL | VERB | DESCRIPTION
---- | --- | ---- | -----------
CREATE | /posts | POST | Create a new item in permanent storage
LIST | /posts | GET | Retrieve a paginated listing from permanent storage
GET | /posts/:id | GET | Retrieve a individual item using the id passed as a route parameter
UPDATE | /posts/:id | PUT | Update details of a post by providing a full array of model data
EDIT | /posts/:id | PATCH | Update details of a post by providing only those elements you wish to update
DELETE | /posts/:id | DELETE | Remove an item from permanent storage

## Issues
Please report any bugs on the [Issue Tracker](https://github.com/jacksoncharles/post-service/issues).
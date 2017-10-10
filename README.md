# Restful API - post-service

An AWS Lambda solution written using the [Serverless Toolkit](http://serverless.com) and [DynamoDB](https://aws.amazon.com/dynamodb). It includes a pagination, key/value searches plus a collection of common needs including an order_by clause.

## EndPoints

NAME | URL | VERB | DESCRIPTION
---- | --- | ---- | -----------
CREATE | /posts | POST | Create a new item in permanent storage
LIST | /posts | GET | Retrieve a paginated listing from permanent storage
GET | /posts/:id | GET | Retrieve a individual item using the id passed as a route parameter

## Issues
Please report any bugs on the [Issue Tracker](https://github.com/jacksoncharles/post-service/issues).
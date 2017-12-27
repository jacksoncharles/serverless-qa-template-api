# Q&A Microservice Template

A microservice template for a Q&A solution such as comments functionality or discussion forum deployed using 
the [Serverless Framework](http://serverless.com).

A simple but robust solution that can be built upon. Includes common functionality including pagination and global secondary indexes for retrieiving by user, thread or unique key. It is loosely inspired by the [AWS Example Forum](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleData.CreateTables.html) and designed to be implemented as part of a distributed system.

## Technology Stack
1. [AWS Lambda](https://aws.amazon.com/lambda/)
2. [Serverless Framework](http://serverless.com)
3. [DynamoDB](https://aws.amazon.com/dynamodb)
4. [NodeJs](https://nodejs.org/)

## Installation & Deployment 
Deploying the forum microservice will provision and create the following resources.

1. API Gateway entitled forum-microservice with 10 endpoints.
2. 10 * Lambda functions with associated Cloud Watch logs.
3. 2 * DynamoDB tables called Thread and Reply.

To deploy from your desktop you must have an existing AWS account with command line access. 

Firstly, install the [Serverless Framework](http://serverless.com).

```
    npm install serverless -g
```

Secondly, install the [Serverless Framework](http://serverless.com) dependencies.

```
    npm install
```

Next, install your microservice API dependencies.

```
    ./api/npm install
```

Lasty, deploy your microservice API.

```
    sls deploy
```

If you wish to load test data into your application you can run the loadData script.

```
	./loadData.sh
```

## Removal
To remove the solution from AWS at the command line

```
	sls remove
```

NOTE: Will automatically remove any Lambda functions, Cloud Watch logs and API Gateway configurations. It will
not remove DynamoDb tables; They must be deleted manually.

## Lambda Functions and EndPoints
Will create X Lambda functions accessible via [API Gateway](https://aws.amazon.com/api-gateway/) configured endpoints.

NAME | LAMBDA | URL | VERB | DESCRIPTION
---- | ------ | --- | ---- | -----------
CREATE | threadCreate | /threads | POST | Create a new item in permanent storage.
LIST | threadList | /threads | GET | Retrieve a paginated listing from permanent storage.
GET | threadGet | /threads/:id | GET | Retrieve a individual item using the ```threadid``` or ```userid``` passed in the query string.
UPDATE | threadUpdate| /threads/:id | PUT | Update details of a post by providing a full array of model data.
DELETE | threadDelete | /threads/:id | DELETE | Remove an item from permanent storage.
CREATE | replyCreate | /replies | POST | Create a new item in permanent storage.
LIST | replyList | /replies | GET | Retrieve a paginated listing from permanent storage.
GET | replyGet | /replies/:id | GET | Retrieve a individual item using the ```threadid``` or ```userid``` passed in the query string.
UPDATE | replyUpdate | /replies/:id | PUT | Update details of a post by providing a full array of model data.
DELETE | replyDelete | /replies/:id | DELETE | Remove an item from permanent storage.


## Issues
Please report any feedback on the [Issue Tracker](https://github.com/jacksoncharles/forum-microservice/issues).
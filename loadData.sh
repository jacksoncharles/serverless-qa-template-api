#!/usr/bin/env bash

aws dynamodb batch-write-item --request-items file://sample_data/Forum.json
aws dynamodb batch-write-item --request-items file://sample_data/Thread.json
aws dynamodb batch-write-item --request-items file://sample_data/Reply.json
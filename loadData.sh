#!/usr/bin/env bash
aws dynamodb batch-write-item --request-items file://data/Reply.json
aws dynamodb batch-write-item --request-items file://data/Thread.json
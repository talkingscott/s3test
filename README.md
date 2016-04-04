# s3test
Measure latency, transfer rate and throughput of S3 transfers

## Running
To measure latency and transfer rate on a single connection, run

```
node test_put_many.js
note test_get_many.js
```

## Configuration
There are two values that are hard-coded in the scripts.  You can edit the scripts
or override the hard-coded values through the environment.

```
AWS_REGION sets the region used for S3 URLs
AWS_S3_BUCKET sets the name of the S3 bucket
```

The scripts use the AWS SDK and thus support the standard means for setting creditials.
I happen to use IAM, but the scripts should work if, for example, you supply credentials
via ~/.aws/credentials.

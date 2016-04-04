# s3test
Measure latency, transfer rate and throughput of S3 transfers

## Installation
The scripts are written for node.js.  Assuming you already have node.js installed,
just run

```
git clone https://github.com/talkingscott/s3test.git
cd s3test
npm install
```

## Configuration
There are two values that are hard-coded in the scripts.  You can edit the scripts
or override the hard-coded values through the environment.

```
AWS_REGION sets the region used for S3 URLs
AWS_S3_BUCKET sets the name of the S3 bucket
```

The scripts use the AWS SDK and thus support the standard means for setting credentials.
I happen to use IAM, but the scripts should work if, for example, you supply credentials
via ~/.aws/credentials.

## Running
To measure latency and transfer rate on a single connection, run

```
node test_put_many.js
note test_get_many.js
```

Transfers are done multiple times for multiple object sizes.  Modeling each transfer
as a delay (latency) followed by a transfer at a fixed rate, simple linear regression on the
test results yields a latency value (y-intercept) and transfer rate (inverse of the
slope).

## My Results
Running from a t2.micro in the us-east-1 region in April 2016, I get the following results
(measured multiple times.)

| Action | Transfer Rate (B/s) | Latency (ms) |
| --- | ---------- | --- |
| put | 22,410,641 | 132 |
| get | 21,278,382 | 132 |
| put | 25,861,970 | 178 |
| get | 20,141,821 | 54.3 |
| put | 24,616,099 | 195 |
| get | 20,939,757 | 105 |
| put | 23,505,095 | 174 |
| get | 20,023,594 | 105 |
| put | 21,487,703 | 163 |
| get | 21,438,687 | 138 |
| put | 23,076,805 | 155 |
| get | 20,381,101 | 120 |

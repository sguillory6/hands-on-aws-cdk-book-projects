/**
 * Import various modules from AWS CDK and nodejs core libraries
 */
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import {Bucket, BucketEncryption, EventType } from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";

/**
 * The stack class extends the base CDK Stack
 */
export class HelloCdkStack extends cdk.Stack {
  /**
   * Constructor for the stack
   * @param {cdk.App} scope - The CDK application scope
   * @param {string} id - Stack ID
   * @param {cdk.StackProps} props - Optional stack properties
   */
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    // Call super constructor
    super(scope, id, props);

    // Create S3 bucket for uploading greetings
    const s3Bucket = new Bucket(this, "MyS3Bucket", {
      bucketName: "stang-my-s3-bucket",
      encryption: BucketEncryption.KMS,
      versioned: true
    });

    // Create Lambda function to generate greeting
    const helloCdkLambdaFunction = new lambda.Function(this, "HelloCdkLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "./lambda/lambda-hello-cdk")
      ),
    });

    // Invoke lambda when new object created in S3 bucket
    s3Bucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(helloCdkLambdaFunction),
      { suffix: ".txt" }
    );

    // Output S3 bucket name
    new cdk.CfnOutput(this, "bucketName", {
      value: s3Bucket.bucketName,
    });
  }
}

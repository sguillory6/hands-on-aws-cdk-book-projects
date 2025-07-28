/**
 * Import various modules from AWS CDK and nodejs core libraries
 */
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as path from "path";

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
    const helloCdkS3Bucket = new s3.Bucket(this, "HelloCdkS3Bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(1),
        },
      ]
    });

    // Create Lambda function to generate greeting
    const helloCdkLambdaFunction = new lambda.Function(this, "HelloCdkLambda", {
      description:
        `Lambda function generates a dynamic greeting
        by retrieving the text from an S3 object and
        when triggered by S3 event`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "./lambda/lambda-hello-cdk")
      ),
    });

    helloCdkS3Bucket.grantRead(helloCdkLambdaFunction);

    // Invoke lambda when new object created in S3 bucket
    helloCdkS3Bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(helloCdkLambdaFunction),
      { suffix: ".txt" }
    );

    // Output S3 bucket name
    new cdk.CfnOutput(this, "bucketName", {
      value: helloCdkS3Bucket.bucketName,
    });
  }
}

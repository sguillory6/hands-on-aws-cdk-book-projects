/**
 * Import various modules from AWS CDK and nodejs core libraries
 */
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
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

    // Level 1 (L1) construct for S3 Bucket
    // Note: Hard-coded names can collide.
    // Consider omitting `bucketName` for auto-generated names.
    const rawDataBucket = new CfnBucket(this, 'rawDataBucket', {
      // bucketName: 'raw-data-landing-zone-greeting',
      accessControl: 'Private',
      // other bucket properties
    });

    // Create Lambda function to generate greeting
    const helloCdkLambdaFunction = new lambda.Function(this, "HelloCdkLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "./lambda/lambda-hello-cdk")
      ),
    });

    // Output S3 bucket name
    new cdk.CfnOutput(this, "bucketName", {
      value: rawDataBucket.bucketName!
    });
  }
}

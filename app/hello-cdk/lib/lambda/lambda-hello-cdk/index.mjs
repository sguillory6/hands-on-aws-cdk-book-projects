// const aws = require("aws-sdk");
//const { S3Client } = import("@aws-sdk/client-s3");
import { S3Client } from '@aws-sdk/client-s3'
const s3Client = new S3Client({});

/**
 * Lambda function invoked on S3 object created event
 *
 * @param {Object} event - The S3 event data
 * @returns {Object} - The response including body and statusCode
 */
// exports.main = async (event) => {
export const handler = async (event, context) => {
  const msg = "Hello, CDK!"
  console.log(msg)

  // // Get bucket and object key from event
  // const bucket = event.Records[0].s3.bucket.name;
  // const key = event.Records[0].s3.object.key;
  //
  // // Get object data from S3
  // const params = {
  //   Bucket: bucket,
  //   Key: key,
  // };
  // const data = await s3.getObject(params).promise();
  //
  // // Extract name from object data
  // const name = data.Body.toString("utf-8").trim();
  //
  // // Print greeting with name
  // const msg = `Hello, ${name}! I am your new energy assistant.`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: msg,
    }),
  };
};

// module.export = { main };
//export { handler };

import { S3 } from "aws-sdk";

const s3 = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://ams3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

export const uploadToS3 = async () => {
  const params: S3.PutObjectRequest = {
    Bucket: "cgbucket",
    Key: fileData!.originalname,
    Body: fileContent,
  };

  try {
    const res = await s3.upload(params).promise();

    console.log("File Uploaded with Successfull", res.Location);
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to S3");
  }
};

import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://ams3.digitaloceanspaces.com",
  region: "ams3",
  credentials: {
    accessKeyId: process.env.SPACES_KEY as string,
    secretAccessKey: process.env.SPACES_SECRET as string,
  },
});

export const uploadToS3 = async (fileContent: Buffer) => {
  const params: PutObjectCommandInput = {
    Bucket: "cgbucket",
    Key: "ogimages/generated/test.png",
    Body: fileContent,
  };

  const command = new PutObjectCommand(params);

  try {
    const data = await s3.send(command);

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to S3");
  }
};

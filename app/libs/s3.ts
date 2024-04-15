import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectsCommand,
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

/**
 *
 * @param fileContent
 * @param key ex "ogimages/generated/test.png"
 * @returns
 */
export const uploadToS3 = async (fileContent: Buffer, key: string) => {
  const params: PutObjectCommandInput = {
    Bucket: "cgbucket",
    Key: key,
    Body: fileContent,
    ACL: "public-read",
    ContentType: "image/png",
  };

  const command = new PutObjectCommand(params);

  try {
    const data = await s3.send(command);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to S3");
  }
};

/**
 * Delete a file from S3
 * @param key ex "ogimages/generated/test.png"
 */
export const deleteFromS3 = async (key: string) => {
  const params = {
    Bucket: "cgbucket",
    Key: key,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting file from S3");
  }
};

/**
 * Delete multiple files from S3
 * @param keys ex ["ogimages/generated/test.png", "ogimages/generated/test2.png"]
 */
export const multipleDeleteFromS3 = async (keys: string[]) => {
  const params = {
    Bucket: "cgbucket",
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  };

  try {
    const status = await s3.send(new DeleteObjectsCommand(params));
    console.log(status);

    // Check if there are any errors
    if (status.Errors) {
      console.error(status.Errors);
      throw new Error("Error deleting files from S3");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting files from S3");
  }
};

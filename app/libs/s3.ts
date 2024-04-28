import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  ListObjectsV2Command,
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

/**
 * Check if a file exists in S3
 * @param filePath ex "ogimages/generated/test.png"
 * @returns
 */
export const fileExists = async (filePath: string) => {
  const command = new HeadObjectCommand({
    Bucket: "cgbucket",
    Key: filePath,
  });

  try {
    await s3.send(command);
    return { exists: true, error: null };
  } catch (error) {
    if (error.name === "NotFound") {
      return { exists: false, error: null };
    }
    return { exists: false, error };
  }
};

/**
 * Delete a folder and all its content from S3
 * @param location ex "ogimages/generated/"
 */
export async function deleteFolder(location: string) {
  let count = 0; // number of files deleted
  async function recursiveDelete(token: string | undefined = undefined) {
    // get the files
    const listCommand = new ListObjectsV2Command({
      Bucket: "cgbucket",
      Prefix: location,
      ContinuationToken: token,
    });
    const list = await s3.send(listCommand);
    if (list.KeyCount) {
      // if items to delete
      // delete the files
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: "cgbucket",
        Delete: {
          Objects: list.Contents?.map((item) => ({ Key: item.Key })),
          Quiet: false,
        },
      });
      const deleted = await s3.send(deleteCommand);
      if (deleted.Deleted) count += deleted.Deleted?.length;
      // log any errors deleting files
      if (deleted.Errors) {
        deleted.Errors.map((error) =>
          console.log(`${error.Key} could not be deleted - ${error.Code}`)
        );
      }
    }
    // repeat if more files to delete
    if (list.NextContinuationToken) {
      recursiveDelete(list.NextContinuationToken);
    }
    // return total deleted count when finished
    return `${count} files deleted.`;
  }
  // start the recursive function
  return recursiveDelete();
}

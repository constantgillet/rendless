import {
  ActionFunctionArgs,
  NodeOnDiskFile,
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { uploadToS3 } from "~/libs/s3";
import { v4 as uuidv4 } from "uuid";
import { bucketURL } from "~/constants/s3Constants";

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("asset") as NodeOnDiskFile;

  //Max file size is 5MB
  if (file.size > 5_000_000) {
    return new Response("File is too large", { status: 400 });
  }

  //Check if the file is an image
  if (!file.type.startsWith("image/")) {
    return new Response("File is not an image", { status: 400 });
  }

  const imageArrayBuffer = await file.arrayBuffer();
  const imageBuffer = Buffer.from(imageArrayBuffer);
  const fileExtension = file.name.split(".").pop();
  const imageName = `${uuidv4()}.${fileExtension}`;
  const imageLocation = `ogimages/uploaded/${imageName}`;

  await uploadToS3(imageBuffer, imageLocation);

  const imageUrl = `${bucketURL}/${imageLocation}`;

  console.log("imageUrl", imageUrl);

  return json({ imageUrl });
};

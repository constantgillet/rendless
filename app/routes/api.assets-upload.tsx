import {
  type ActionFunctionArgs,
  type NodeOnDiskFile,
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { uploadToS3 } from "~/libs/s3";
import { v4 as uuidv4 } from "uuid";
import { MAX_IMAGE_SIZE, BUCKET_URL } from "~/constants/s3Constants";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { validationError } from "remix-validated-form";
import { prisma } from "~/libs/prisma";

export const assetUploadValidator = withZod(
  z.object({
    templateId: z.string(),
  })
);

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: MAX_IMAGE_SIZE,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const result = await assetUploadValidator.validate(formData);

  if (result.error) {
    return validationError(result.error);
  }

  //Check if the template id is owned by the user
  const template = await prisma.template.findUnique({
    where: {
      id: result.data.templateId,
    },
  });

  if (!template) {
    return json({ data: "Template not found" }, { status: 404 });
  }

  if (template.userId !== context?.user?.id) {
    return json({ data: "unauthorized" }, { status: 401 });
  }

  const file = formData.get("asset") as NodeOnDiskFile;

  //Max file size is 5MB
  if (file.size > MAX_IMAGE_SIZE) {
    return new Response("File is too large", { status: 400 });
  }

  //Check if the file is an image
  if (!file.type.startsWith("image/")) {
    return new Response("File is not an image", { status: 400 });
  }

  const imageArrayBuffer = await file.arrayBuffer();
  const imageBuffer = Buffer.from(imageArrayBuffer);
  const fileExtension = file.name.split(".").pop();
  const generatedId = uuidv4();
  const imageName = `${generatedId}.${fileExtension}`;
  const imageLocation = `ogimages/uploaded/${imageName}`;

  await uploadToS3(imageBuffer, imageLocation);

  const imageUrl = `${BUCKET_URL}/${imageLocation}`;

  //Save the image url to the database
  try {
    await prisma.asset.create({
      data: {
        id: generatedId,
        url: imageUrl,
        templateId: result.data.templateId,
      },
    });

    return json({ imageUrl });
  } catch (error) {
    console.error(error);
    return json({ data: "error" }, { status: 500 });
  }
};

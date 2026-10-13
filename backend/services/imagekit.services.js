import ImageKit from "@imagekit/nodejs";

let imagekit;

export async function uploadImage(file, fileName) {
    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
        throw new Error("Add IMAGEKIT_PRIVATE_KEY to the backend .env file to upload images.");
    }

    if (!imagekit) {
        imagekit = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
    }

  return imagekit.files.upload({ file, fileName });
}

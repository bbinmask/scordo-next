import cloudinary from "@/lib/cloudinary";

type FolderProp = "logo" | "banner" | "team-logo" | "team-banner";

export async function uploadImage(image: File, folder: FolderProp = "logo") {
  let imageUrl;

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  imageUrl = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url);
      })
      .end(buffer);
  });

  return { imageUrl };
}

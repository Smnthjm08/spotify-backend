import cloudinary from '../lib/cloduinary';
// not a good practice
export const uploadToCloudinary = async (file: any) => {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",
      });
      return result.secure_url;
    } catch (error) {
      console.log("Error uploading the image/audio", error);
      throw new Error("Error uploading to cloudinary");
    }
  };
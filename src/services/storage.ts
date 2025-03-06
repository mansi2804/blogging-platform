import axios from "axios";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dhgm7zzlt/image/upload";
const CLOUDINARY_PRESET = "blog_preset"; // Set in Cloudinary dashboard

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET); // Use unsigned upload preset

  try {
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.secure_url; // Cloudinary returns a URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
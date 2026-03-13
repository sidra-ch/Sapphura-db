// Cloudinary API utility for fetching media
import axios from 'axios';

const CLOUDINARY_URL = 'https://res.cloudinary.com/dwmxdyvd2';

export async function fetchCloudinaryImages(folder: string) {
  // Use Cloudinary search API for folder
  const url = `https://api.cloudinary.com/v1_1/dwmxdyvd2/resources/image?prefix=${folder}/`;
  const response = await axios.get(url, {
    auth: {
      username: process.env.CLOUDINARY_API_KEY,
      password: process.env.CLOUDINARY_API_SECRET,
    },
  });
  return response.data.resources;
}

export async function fetchCloudinaryVideos(folder: string) {
  const url = `https://api.cloudinary.com/v1_1/dwmxdyvd2/resources/video?prefix=${folder}/`;
  const response = await axios.get(url, {
    auth: {
      username: process.env.CLOUDINARY_API_KEY,
      password: process.env.CLOUDINARY_API_SECRET,
    },
  });
  return response.data.resources;
}

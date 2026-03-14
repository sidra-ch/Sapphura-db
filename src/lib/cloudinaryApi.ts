// Cloudinary API utility for fetching media
import axios from 'axios';

export async function fetchCloudinaryImages(folder: string) {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error('Cloudinary API credentials not configured');
  }
  const url = `https://api.cloudinary.com/v1_1/dwmxdyvd2/resources/image?prefix=${folder}/`;
  const response = await axios.get(url, {
    auth: {
      username: apiKey,
      password: apiSecret,
    },
  });
  return response.data.resources;
}

export async function fetchCloudinaryVideos(folder: string) {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error('Cloudinary API credentials not configured');
  }
  const url = `https://api.cloudinary.com/v1_1/dwmxdyvd2/resources/video?prefix=${folder}/`;
  const response = await axios.get(url, {
    auth: {
      username: apiKey,
      password: apiSecret,
    },
  });
  return response.data.resources;
}

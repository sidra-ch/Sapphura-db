import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dwmxdyvd2';
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function cloudinaryConfigured(): boolean {
  return Boolean(apiKey && apiSecret);
}

async function listAllResources(resourceType: 'image' | 'video', prefix?: string) {
  const resources: any[] = [];
  let nextCursor: string | undefined;

  do {
    const response = await cloudinary.api.resources({
      type: 'upload',
      resource_type: resourceType,
      ...(prefix ? { prefix } : {}),
      max_results: 100,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });

    resources.push(...(response.resources || []));
    nextCursor = response.next_cursor;
  } while (nextCursor);

  return resources;
}

export async function listCloudinaryAssets(prefix?: string) {
  if (!cloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured');
  }

  const [images, videos] = await Promise.all([
    listAllResources('image', prefix),
    listAllResources('video', prefix),
  ]);

  return {
    images,
    videos,
  };
}

export function createCloudinaryUploadSignature(folder = 'products') {
  if (!cloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret as string);

  return {
    cloudName,
    apiKey,
    folder,
    timestamp,
    signature,
  };
}

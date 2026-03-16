export function getProductImageUrl(imagePath: string): string {
  // Try to parse and return from public folder
  if (!imagePath) return 'https://res.cloudinary.com/dwmxdyvd2/image/upload/neckles-1_rbhzgd.jpg';
  
  try {
    const images = JSON.parse(imagePath);
    if (images && images.length > 0) {
      const filename = images[0].replace(/^\//, '');
      return `/${filename}`;
    }
  } catch {
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }
  return 'https://res.cloudinary.com/dwmxdyvd2/image/upload/neckles-1_rbhzgd.jpg';
}

export function getBannerUrl(filename: string) {
  return `https://res.cloudinary.com/dwmxdyvd2/image/upload/${filename}`;
}

export function getCategoryUrl(filename: string) {
  return `https://res.cloudinary.com/dwmxdyvd2/image/upload/${filename}`;
}

export function getVideoUrl(filename: string) {
  return `https://res.cloudinary.com/dwmxdyvd2/video/upload/${filename}`;
}

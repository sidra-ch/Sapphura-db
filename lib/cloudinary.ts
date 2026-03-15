export function getProductImageUrl(imagePath: string): string {
  // Try to parse and return from public folder
  if (!imagePath) return 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569411/neckles-1_hpggw5.jpg';
  
  try {
    const images = JSON.parse(imagePath);
    if (images && images.length > 0) {
      const filename = images[0].replace(/^\//, '');
      return `/${filename}`;
    }
  } catch {
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }
  return 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569411/neckles-1_hpggw5.jpg';
}

export function getBannerUrl(filename: string) {
  return `https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004855/${filename}`;
}

export function getCategoryUrl(filename: string) {
  return `https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004792/${filename}`;
}

export function getVideoUrl(filename: string) {
  return `https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773004784/${filename}`;
}

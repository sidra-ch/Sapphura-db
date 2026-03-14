export function cloudinaryUrl(publicId: string, options: { width?: number; height?: number; format?: string } = {}) {
  const base = 'https://res.cloudinary.com/dwmxdyvd2/image/upload/';
  const params = [];
  if (options.width) params.push(`w_${options.width}`);
  if (options.height) params.push(`h_${options.height}`);
  if (options.format) params.push(`f_${options.format}`);
  const transformation = params.length ? params.join(',') + '/' : '';
  return `${base}${transformation}${publicId}`;
}

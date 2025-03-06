export const storeImage = (file: File): string => {
  const imageUrl = URL.createObjectURL(file);
  const images = JSON.parse(localStorage.getItem('blog_images') || '{}');
  images[imageUrl] = imageUrl;
  localStorage.setItem('blog_images', JSON.stringify(images));
  return imageUrl;
};

export const getImage = (url: string): string | null => {
  const images = JSON.parse(localStorage.getItem('blog_images') || '{}');
  return images[url] || null;
};

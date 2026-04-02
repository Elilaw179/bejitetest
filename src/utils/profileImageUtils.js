import { getUser } from './tokenManager';
import { API_URL } from '../config';

export const getUserProfileImage = () => {
  const user = getUser();
  if (!user) return "assets/images/eli.jpg";
  
  const image = user.image || user.profilePhoto || user.profile_photo || "assets/images/eli.jpg";
  
  if (!image) return "assets/images/eli.jpg";
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) {
    return `${API_URL || 'http://localhost:3001'}${image}`;
  }
  return image;
};

export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return "assets/images/eli.jpg";
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) {
    return `${API_URL || 'http://localhost:3001'}${imagePath}`;
  }
  return imagePath || "assets/images/eli.jpg";
};
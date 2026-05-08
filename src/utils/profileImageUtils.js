import { getUser } from './tokenManager';
import { profileAvatarSrc } from './profilePhotoUrl';

export const getUserProfileImage = () => {
  const user = getUser();
  const raw = user?.image || user?.profilePhoto || user?.profile_photo;
  return profileAvatarSrc(raw);
};

/**
 * @param {string | null | undefined} imagePath
 * @returns {string}
 */
export const getProfileImageUrl = (imagePath) => profileAvatarSrc(imagePath);

export { profilePhotoUrl, profileAvatarSrc, PROFILE_PHOTO_PLACEHOLDER } from './profilePhotoUrl';

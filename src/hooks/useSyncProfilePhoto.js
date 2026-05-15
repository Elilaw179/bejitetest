import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../features/auth/authSlice';
import { fetchCurrentUserProfilePhoto } from '../services/profilePhotoService';

let inflightSync = null;

/**
 * Loads the canonical profile photo from GET /auth/user/profile/photo and merges into Redux + localStorage (via updateUser).
 * Uses a module-level promise so multiple headers/layouts only trigger one request.
 */
export default function useSyncProfilePhoto() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('accessToken') || localStorage.getItem('authToken')
        : null;
    if (!token) return;

    if (!inflightSync) {
      inflightSync = fetchCurrentUserProfilePhoto()
        .then((url) => {
          if (url) {
            dispatch(
              updateUser({
                image: url,
                profile_photo: url,
                profilePhoto: url,
              }),
            );
          }
        })
        .catch(() => {
          /* 401 / network — leave cached user as-is */
        })
        .finally(() => {
          inflightSync = null;
        });
    }
  }, [dispatch]);
}

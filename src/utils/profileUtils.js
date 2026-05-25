/** Normalize GET /auth/me or profile payloads into the shape Profile renders. */
export function normalizeProfileData(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    ...raw,
    first_name: raw.first_name ?? raw.firstName ?? '',
    last_name: raw.last_name ?? raw.lastName ?? '',
    firstName: raw.firstName ?? raw.first_name,
    lastName: raw.lastName ?? raw.last_name,
    profile_photo: raw.profile_photo ?? raw.profilePhoto ?? raw.image ?? null,
    email: raw.email,
    title: raw.title ?? raw.jobTitle,
    phone: raw.phone ?? raw.phone_number,
    phone_number: raw.phone_number ?? raw.phone,
    location: raw.location,
    bio: raw.bio,
    summary: raw.summary ?? raw.bio,
    company_name: raw.company_name ?? raw.companyName,
    nickname: raw.nickname,
  };
}

export function unwrapAuthProfileBody(data) {
  if (!data || typeof data !== 'object') return null;
  if (data.user && typeof data.user === 'object') return data.user;
  if (Object.prototype.hasOwnProperty.call(data, 'success') && data.data != null) {
    return data.data;
  }
  return data;
}

export function profilePayloadLooksUsable(row) {
  if (!row || typeof row !== 'object') return false;
  return !!(
    row.id ||
    row.email ||
    row.first_name ||
    row.firstName ||
    row.last_name ||
    row.lastName ||
    row.nickname
  );
}

/** Build profile row from search dropdown navigation state. */
export function profileFromSearchPreview(preview, userId) {
  if (!preview || typeof preview !== 'object') return null;
  const name = preview.name || '';
  const parts = name.trim().split(/\s+/);
  return normalizeProfileData({
    id: preview.id || userId,
    first_name: preview.firstName ?? parts[0] ?? '',
    last_name: preview.lastName ?? parts.slice(1).join(' ') ?? '',
    title: preview.subtitle ?? preview.title,
    profile_photo: preview.image ?? preview.profile_photo ?? preview.profilePhoto,
    email: preview.email,
  });
}

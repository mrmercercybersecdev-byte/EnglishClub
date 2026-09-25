const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Request failed');
  return payload;
}

export const communityApi = {
  feed: () => request('/community/feed'),
  createPost: (post) => request('/community/posts', { method: 'POST', body: JSON.stringify(post) }),
  profile: (id) => request(`/community/profile/${id}`),
  updateProfile: (id, profile) => request(`/community/profile/${id}`, { method: 'PATCH', body: JSON.stringify(profile) }),
};

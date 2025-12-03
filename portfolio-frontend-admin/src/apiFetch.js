const BASE_URL = 'http://localhost:8000';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const res = await fetch(url, {
    ...options,
    credentials: 'include', 
    headers
  });

  if (res.status === 401) window.location.href = '/login';
  if (!res.ok) throw new Error(await res.text());

  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const login = async (email, password) => {
  try {
    const response = await apiFetch('/api/login_check', { 
      method: 'POST', 
      body: JSON.stringify({ email, password }) 
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
  
export const getMe = () => apiFetch('/api/auth/me');
export const logout = () => apiFetch('/api/auth/logout', { method: 'POST' });
export const getProjects = () => apiFetch('/api/projects');
export const getCompetences = () => apiFetch('/api/competences');
export const getImages = () => apiFetch('/api/images')
export const getMessages = () => apiFetch('/api/messages');
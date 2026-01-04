const BASE_URL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (res.status === 401) {
    clearToken();
    throw new Error('Non autorisé, veuillez vous reconnecter.');
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Erreur lors du login');
    }

    const data = await response.json();
    
    if (data.token) {
      setToken(data.token);
      return { success: true, data };
    } else {
      throw new Error('Token non reçu');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getMe = () => apiFetch('/api/auth/me');
export const logout = () => { clearToken(); window.location.href = '/login'; };
export const getProjects = () => apiFetch('/api/projects');
export const getCompetences = () => apiFetch('/api/competences');
export const getImages = () => apiFetch('/api/images');
export const getMessages = () => apiFetch('/api/messages');

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: 'https://apidclic.mysquidsgn.com/api',
//   BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 10000,
} as const;

// Helper pour construire les URLs d'API
export const buildApiUrl = (endpoint: string): string => {
  // S'assurer que l'endpoint commence par /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${cleanEndpoint}`;
};

// Headers par défaut pour les requêtes API
export const getDefaultHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper pour faire des requêtes API avec configuration par défaut
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...options.headers,
    },
  };

  return fetch(url, defaultOptions);
};

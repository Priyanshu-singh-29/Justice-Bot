const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// Cases
export const getCases = async () => {
  const res = await fetch(`${API_URL}/cases`, { headers: headers() });
  if (!res.ok) throw new Error('Failed to fetch cases');
  return res.json();
};

export const getCaseById = async (id: string) => {
  const res = await fetch(`${API_URL}/cases/${id}`, { headers: headers() });
  if (!res.ok) throw new Error('Case not found');
  return res.json();
};

export const createCase = async (data: { title: string; description: string; caseType: string }) => {
  const res = await fetch(`${API_URL}/cases`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create case');
  return res.json();
};

export const analyzeCase = async (id: string) => {
  const res = await fetch(`${API_URL}/cases/${id}/analyze`, {
    method: 'POST',
    headers: headers()
  });
  if (!res.ok) throw new Error('AI analysis failed');
  return res.json();
};

export const analyzeStandaloneText = async (text: string, type?: string) => {
  const res = await fetch(`${API_URL}/cases/analyze-text`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ text, type })
  });
  if (!res.ok) throw new Error('Standalone AI analysis failed');
  return res.json();
};

export const deleteCase = async (id: string) => {
  const res = await fetch(`${API_URL}/cases/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
  if (!res.ok) throw new Error('Failed to delete case');
  return res.json();
};

// Admin
export const getAdminStats = async () => {
  const res = await fetch(`${API_URL}/admin/stats`, { headers: headers() });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const getAdminUsers = async () => {
  const res = await fetch(`${API_URL}/admin/users`, { headers: headers() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const updateUserRole = async (id: string, role: string) => {
  const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ role })
  });
  if (!res.ok) throw new Error('Failed to update role');
  return res.json();
};

export const deleteAdminUser = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
};

export const getAdminCases = async () => {
  const res = await fetch(`${API_URL}/cases/admin/all`, { headers: headers() });
  if (!res.ok) throw new Error('Failed to fetch all cases');
  return res.json();
};

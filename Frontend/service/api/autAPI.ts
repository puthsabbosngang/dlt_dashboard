// const API_BASE_URL = 'http://localhost:5000/api/auth';

// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: string;
//   user: {
//     id: string;
//     username: string;
//     type: 'staff' | 'customer';
//     staff?: {
//       id: string;
//       full_name: string;
//       role: string;
//       phone: string;
//     };
//   };
// }

// export interface ApiError {
//   message: string;
// }

// export const authAPI = {
//   async login(credentials: LoginRequest): Promise<LoginResponse> {
//     const response = await fetch(`${API_BASE_URL}/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Login failed');
//     }

//     return data;
//   },

//   async getCurrentUser(): Promise<LoginResponse['user']> {
//     const token = localStorage.getItem('authToken');
    
//     if (!token) {
//       throw new Error('No token found');
//     }

//     const response = await fetch(`${API_BASE_URL}/me`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Failed to get user data');
//     }

//     return data.user;
//   },

//   logout() {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userData');
//   }
// };


// src/api/api.ts

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // ✅ configurable via .env

// ✅ Centralized fetch wrapper with better error handling
async function fetchJSON<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// ✅ Local Storage helpers
function getToken(): string | null {
  return localStorage.getItem("authToken");
}

function saveAuthData(token: string, user: any) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("userData", JSON.stringify(user));
}

function clearAuthData() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
}

// ✅ Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface StaffInfo {
  id: string;
  full_name: string;
  role: string;
  phone: string;
}

export interface UserInfo {
  id: string;
  username: string;
  type: "staff" | "customer";
  staff?: StaffInfo;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface ApiError {
  message: string;
}

// ✅ Auth API
export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const data = await fetchJSON<LoginResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Save token + user to localStorage
    saveAuthData(data.token, data.user);
    return data;
  },

  async getCurrentUser(): Promise<UserInfo> {
    const token = getToken();
    if (!token) throw new Error("No token found. Please log in again.");

    const data = await fetchJSON<{ user: UserInfo }>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update stored user data (optional)
    localStorage.setItem("userData", JSON.stringify(data.user));
    return data.user;
  },

  logout() {
    clearAuthData();
  },
};

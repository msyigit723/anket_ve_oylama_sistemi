'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  adminLogin: async () => {},
  logout: () => {},
  isAdmin: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

// ── Simple hash (simulated bcrypt — production'da gerçek bcrypt kullanılır) ──
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'hashed_' + Math.abs(hash).toString(36) + '_' + str.length;
}

// ── JWT-like token (simulated) ──
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24h
  };
  return btoa(JSON.stringify(payload));
}

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

// ── Default admin account ──
const ADMIN_CREDENTIALS = {
  email: 'admin@anket.com',
  passwordHash: simpleHash('Admin123!'),
};

const STORAGE_USERS_KEY = 'survey_users';
const STORAGE_TOKEN_KEY = 'survey_auth_token';

function getStoredUsers() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]');
  } catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from token
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });
      } else {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Register
  const register = useCallback(async (name, email, password) => {
    await new Promise(r => setTimeout(r, 600));

    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('Bu e-posta adresi zaten kayıtlı');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash: simpleHash(password),
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = generateToken(newUser);
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    const sessionUser = { id: newUser.id, email: newUser.email, name, role: 'user' };
    setUser(sessionUser);
    return sessionUser;
  }, []);

  // Login (normal user)
  const login = useCallback(async (email, password) => {
    await new Promise(r => setTimeout(r, 600));

    const users = getStoredUsers();
    const found = users.find(u => u.email === email);

    if (!found || found.passwordHash !== simpleHash(password)) {
      throw new Error('E-posta veya şifre hatalı');
    }

    const token = generateToken(found);
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    const sessionUser = { id: found.id, email: found.email, name: found.name, role: 'user' };
    setUser(sessionUser);
    return sessionUser;
  }, []);

  // Admin Login (isolated)
  const adminLogin = useCallback(async (email, password) => {
    await new Promise(r => setTimeout(r, 800));

    if (email !== ADMIN_CREDENTIALS.email || simpleHash(password) !== ADMIN_CREDENTIALS.passwordHash) {
      throw new Error('Admin kimlik bilgileri geçersiz');
    }

    const adminUser = { id: 'admin-1', email, role: 'admin', name: 'Yönetici' };
    const token = generateToken(adminUser);
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    setUser(adminUser);
    return adminUser;
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, adminLogin, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

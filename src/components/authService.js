// Store user data in localStorage
const AUTH_KEY = 'wish_user_auth';

export function getCurrentUser() {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth) : null;
}

export function login(email, password) {
  // In a real app, this would make an API call
  return new Promise((resolve, reject) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const auth = { email: user.email, id: user.id };
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      resolve(auth);
    } else {
      reject(new Error('Invalid email or password'));
    }
  });
}

export function signup(email, password) {
  // In a real app, this would make an API call
  return new Promise((resolve, reject) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      reject(new Error('Email already exists'));
      return;
    }
    
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const auth = { email: newUser.email, id: newUser.id };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    resolve(auth);
  });
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    document.getElementById('auth-modal').style.display = 'flex';
    throw new Error('Authentication required');
  }
  return user;
}
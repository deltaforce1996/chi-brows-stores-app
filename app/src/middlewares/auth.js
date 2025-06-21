// Middleware to check authentication status
export default function authMiddleware(to, from, next) {
  const publicPages = ['/auth/login', '/auth/register', '/auth/register2'];
  const authRequired = !publicPages.includes(to.path);
  const token = (typeof window !== 'undefined') ? window.localStorage.getItem('access_token') : null;

  if (authRequired && !token) {
    // Not logged in, redirect to login
    return next({ name: 'Login' });
  }
  // If logged in and trying to access login/register, redirect to home
  if ((to.path.startsWith('/auth')) && token) {
    return next({ name: 'home' });
  }

  console.log('token', token);
  console.log('to.path', to.path);
  console.log('authRequired', authRequired);
  next();
} 
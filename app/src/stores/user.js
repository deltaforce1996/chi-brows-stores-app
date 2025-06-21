import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: (typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null),
  }),
  actions: {
    setUser(user, token) {
      this.user = user;
      this.token = token;
      if (typeof window !== 'undefined') window.localStorage.setItem('access_token', token);
    },
    logout() {
      this.user = null;
      this.token = null;
      if (typeof window !== 'undefined') window.localStorage.removeItem('access_token');
    },
  },
}); 
export default {
  state() {
    return {
      token: null,
      userId: null,
      tokenExpiration: null,
    };
  },

  mutations: {
    setUser(state, payload) {
      state.token = payload.idToken;
      state.userId = payload.localId;
      state.tokenExpiration = payload.tokenExpiration;
    },
  },

  actions: {
    async login(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'login',
      });
    },

    async signup(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'signup',
      });
    },

    async auth(context, payload) {
      const mode = payload.mode;
      let url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDR8Zz7tvzg6FN3_OtDBUzlNgS6pfHrbMY';
      if (mode === 'signup') {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDR8Zz7tvzg6FN3_OtDBUzlNgS6pfHrbMY';
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);

      context.commit('setUser', {
        idToken: responseData.idToken,
        localId: responseData.localId,
        tokenExpiration: responseData.expiresIn,
      });
    },

    tryLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (token && userId) {
        context.commit('setUser', {
          idToken: token,
          localId: userId,
          tokenExpiration: null,
        });
      }
    },

    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      context.commit('setUser', {
        idToken: null,
        localId: null,
        tokenExpiration: null,
      });
    },
  },

  getters: {
    userId(state) {
      return state.userId;
    },

    token(state) {
      return state.token;
    },

    isAuth(state) {
      return !!state.token;
    },
  },
};

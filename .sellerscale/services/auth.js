import API, { setCredentials, getCredentials } from '@/services/api';

export default {
  get credentials() {
    return getCredentials();
  },
  /**
   * Ensures if user is authorized or not
   * Performs server-side check
   * @TODO impletent real check
   * @return {Promise<boolean>}
   */
  async isAuthorized() {
    return !!getCredentials().accessToken;
  },
  /**
   * Authorizes user
   * @param {String} email
   * @param {String} password
   */
  async signIn({ email, password }) {
    return API.Auth
      .signIn({ email, password });
  },
  /**
   * Registers new user
   * @param {String} firstName
   * @param {String} lastName
   * @param {String} email
   * @param {String} password
   */
  async signUp({
    firstName, lastName, email, password,
  }) {
    return API.Auth
      .signUp({
        firstName, lastName, email, password,
      });
  },
  /**
   * Get code for password restoration.
   * @param email
   * @returns {Promise<{ code: String }>}
   */
  async getRestoreCode({ email }) {
    return API.Auth.getRestoreCode({ email });
  },
  /**
   * Change password with code.
   * @param code
   * @param password
   * @returns {Promise<void>}
   */
  async changePassword({ code, password }) {
    return API.Auth.changePassword({ code, password });
  },
  /**
   * Logout user
   */
  async logout() {
    setCredentials({});
  },
};

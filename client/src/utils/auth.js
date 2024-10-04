import decode from 'jwt-decode';

class AuthService {
  // Decode the token to get user information
  async getProfile() {
    try {
      return decode(this.getToken());
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  }

  // Check if the user is still logged in by checking if the token is valid and not expired
  async loggedIn() {
    const token = this.getToken();
    return !!token && !await this.isTokenExpired(token);
  }

  // Check if the token is expired
  async isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Error checking if token is expired:', err);
      return false;
    }
  }

  // Get the token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Save the token to localStorage and redirect to the homepage
  login(idToken) {
    try {
      localStorage.setItem('id_token', idToken);
      window.location.assign('/');
    } catch (err) {
      console.error('Failed to save token:', err);
    }
  }

  // Remove the token and reload the page
  logout() {
    try {
      localStorage.removeItem('id_token');
      window.location.assign('/');
    } catch (err) {
      console.error('Failed to remove token:', err);
    }
  }
}

export default new AuthService();
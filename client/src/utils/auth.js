import decode from 'jwt-decode';

class AuthService {
    getProfile() {
        try {
            return decode(this.getToken());
        } catch (err) {
            console.error('Failed to decode token:', err);
            return null;
        }
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            return false;
        }
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    login(idToken) {
        try {
            localStorage.setItem('id_token', idToken);
            window.location.assign('/');
        } catch (err) {
            console.error('Failed to save token:', err);
        }
    }

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

const user = {
    /**
     * Creates an accounts with a POST
     * @param {string} username
     * @param {string} password
     */
    createAccount: async function createAccount(username, password) {
        try {
            const account = await fetch('/users/create', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            return await account.json();
        } catch (error) {
            return {
                error: `Create account failure ${error.message}`,
            };
        }
    },

    /**
     * Login user with a POST
     * @param {string} username
     * @param {string} password
     */
    login: async function login(username, password) {
        try {
            const loginReq = await fetch('/users/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
                credentials: 'include',
            });
            return await loginReq.json();
        } catch (error) {
            return {
                error: `Login failure ${error.message}`,
            };
        }
    },
    /**
     * Logout user with a GET
     */
    logout: async function logout() {
        try {
            const login = await fetch('/users/logout', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                credentials: 'include',
            });
            return await login.json();
        } catch (error) {
            return {
                error: `Logout failure ${error.message}`,
            };
        }
    },
};

export default user;

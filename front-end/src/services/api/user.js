const user = {
    createAccount: async function createAccount(username, password) {
        try {
            const account = await fetch('http://localhost:9000/users/create', {
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

    login: async function login(username, password) {
        try {
            let login = await fetch('http://localhost:9000/users/login', {
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
            return await login.json();
        } catch (error) {
            return {
                error: `Login failure ${error.message}`,
            };
        }
    },
    logout: async function logout() {
        try {
            let login = await fetch('http://localhost:9000/users/logout', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                credentials: "include",
            });
            return await login.json();
        } catch (error) {
            return {
                error: `Logout failure ${error.message}`,
            };
        };
    }
}

export default user;
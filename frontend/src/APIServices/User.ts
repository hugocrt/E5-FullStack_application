import createApiClient from './Config.ts';

const userAPI = createApiClient('http://localhost:5000/users');

export const SignIn = async (username: string, password: string) => {
    try {
        const response = await userAPI.post('/signin', { username, password });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
};

export const SignUp = async (username: string, password: string) => {
    try {
        const response = await userAPI.post('/signup', { username, password });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l’inscription:', error);
        throw error;
    }
};

export const Delete = async (password: string) => {
    try {
        const response = await userAPI.delete(`/me`, {
            data: { password }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        throw error;
    }
};

export const searchUsers = async (query: string, skip: number, limit: number) => {
    try {
        const response = await userAPI.get('/search', {
            params: { query, skip, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recherche d\'utilisateurs:', error);
        throw error;
    }
};

export const getCurrentUserId = async () => {
    try {
        const response = await userAPI.get('/me/user-id');
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l utilisateur`, error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await userAPI.get('/me');
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l utilisateur`, error);
        throw error;
    }
};

export const getUserById = async (userId: string) => {
    try {
        const response = await userAPI.get(`/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l utilisateur: ${userId}`, error);
        throw error;
    }
};

export const updateUser = async (username?: string, password?: string, bio?: string, profile_picture?: string) => {
    try {
        console.log('edit user',profile_picture);
        const response = await userAPI.put(`/me`, {username: username, password: password, bio: bio, profile_picture: profile_picture});
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw error;
    }
};

export const followUser = async (userId: string) => {
    try {
        const response = await userAPI.post(`/${userId}/follow`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du suivi de l\'utilisateur:', error);
        throw error;
    }
};

export const unfollowUser = async (userId: string) => {
    try {
        const response = await userAPI.post(`/${userId}/unfollow`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'annulation du suivi de l\'utilisateur:', error);
        throw error;
    }
};

export const getUserFollowers = async (userId: string) => {
    try {
        const response = await userAPI.get(`/${userId}/followers`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des followers:', error);
        throw error;
    }
};

export const getUserFollowing = async (userId: string) => {
    try {
        const response = await userAPI.get(`/${userId}/following`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs suivis:', error);
        throw error;
    }
};

export const getUserProfile = async (userId: string) => {
    try {
        const response = await userAPI.get(`/${userId}/profile`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du profil de l\'utilisateur:', error);
        throw error;
    }
};

export const getUserLikedPosts = async () => {
    try {
        const response = await userAPI.get('/me/likes');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des posts aimés:', error);
        throw error;
    }
};

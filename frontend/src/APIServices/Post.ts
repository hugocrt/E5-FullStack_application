import createApiClient from './Config.ts';

const postAPI = createApiClient('http://localhost:5000/posts')

export const createPost = async (title?: string, picture?: string, text?: string) => {
    try {
        const response = await postAPI.post('/', {title: title, picture: picture, text:text});
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création du post:', error);
        throw error;
    }
};



export const getPosts = async () => {
    try {
        const response = await postAPI.get('/');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        throw error;
    }
};

export const getFollowedPosts = async (skip: number = 0, limit: number = 50) => {
    try {
        const response = await postAPI.get('/followed', { params: { skip, limit } });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des posts suivis:', error);
        throw error;
    }
};

export const getUserPosts = async (userId: string) => {
    try {
        const response = await postAPI.get(`/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des posts de l’utilisateur:', error);
        throw error;
    }
};

export const getPostById = async (postId: string) => {
    try {
        const response = await postAPI.get(`/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du post par ID:', error);
        throw error;
    }
};

export const updatePostById = async (postId: string, title?: string, picture?: string, text?: string) => {
    try {
        const response = await postAPI.put(`/${postId}`, {title: title, picture: picture, text:text});
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création du post:', error);
        throw error;
    }
};

export const deletePostById = async (postId: string) => {
    try {
        const response = await postAPI.delete(`/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du post par ID:', error);
        throw error;
    }
};

export const likePost = async (postId: string) => {
    try {
        const response = await postAPI.post(`/${postId}/like`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'aime du post:', error);
        throw error;
    }
};

export const unlikePost = async (postId: string) => {
    try {
        const response = await postAPI.delete(`/${postId}/like`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'aime du post:', error);
        throw error;
    }
};

export const getPostLikesCount = async (postId: string) => {
    try {
        const response = await postAPI.get(`/${postId}/likes/count`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre d\'aimes du post:', error);
        throw error;
    }
};

export const getPostLikers = async (postId: string) => {
    try {
        const response = await postAPI.get(`/${postId}/likes`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des likers du post:', error);
        throw error;
    }
};

export const addCommentToPost = async (postId: string, content: string) => {
    try {
        const response = await postAPI.post(`/${postId}/comments`, {content: content});
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un commentaire au post:', error);
        throw error;
    }
};

export const getCommentsForPost = async (postId: string) => {
    try {
        const response = await postAPI.get(`/${postId}/comments`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires du post:', error);
        throw error;
    }
};

export const countCommentsForPost = async (postId: string) => {
    try {
        const response = await postAPI.get(`/${postId}/comments/count`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de commentaires du post:', error);
        throw error;
    }
};

import createApiClient from './Config.ts';

const commentAPI = createApiClient('http://localhost:5000/comments');

export const deleteComment = async (commentId: string) => {
    try {
        const response = await commentAPI.delete(`/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
        throw error;
    }
};

export const updateComment = async (commentId: string, content: string) => {
    try {
        const response = await commentAPI.put(`/${commentId}`, { content: content });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du commentaire:', error);
        throw error;
    }
};

export const getCommentById = async (commentId: string) => {
    try {
        const response = await commentAPI.get(`/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du commentaire:', error);
        throw error;
    }
};

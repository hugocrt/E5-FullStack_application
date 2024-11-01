// comment.types.ts
import { User } from './User'; // Importer l'interface User
import { Post } from './Post'; // Importer l'interface Post

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: Date;
    post: Post;
    user: User;
}

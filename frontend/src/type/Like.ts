// like.types.ts
import { User } from './User'; // Importer l'interface User
import { Post } from './Post'; // Importer l'interface Post

export interface Like {
    id: string;
    user_id: string;
    post_id: string;
    created_at: Date;
    user: User;
    post: Post;
}

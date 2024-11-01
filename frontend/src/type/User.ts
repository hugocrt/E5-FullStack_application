// user.types.ts
import {Post} from "./Post.ts";

export interface User {
    id: string;
    username: string;
    password?: string;
    profile_picture?: string;
    bio?: string;
    created_at: Date;
    updated_at: Date;
    followers?: User[];
    following?: User[];
    posts?: Post[];
    followers_count: number;
    following_count: number;
}
// post.types.ts
export interface Post {
    title: string;
    text?: string;
    created_at: Date;
    updated_at: Date;
    id: string;
    picture?: string;
    owner_id: string;
}


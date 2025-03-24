export interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string,
  bio: string,
  image: string,
  followers: number,
  followings: number
}
export interface Tag {
  name: string
}


export interface Post {
  id: string;
  description: string;
  image: string;
  user: User;
  created_at: string;
  comments_on: boolean;
  category: string;
  tags: Tag;
}

export interface Comment {
  content: string;
  user: User;
  post: Post;
}